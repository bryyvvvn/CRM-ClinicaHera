import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ChatService } from '../chat/chat.service.js';
import type { ConversationDto } from '../chat/chat.types.js';
import { MedilinkService } from '../medilink/medilink.service.js';
import type {
  MedilinkCita,
  MedilinkPaciente,
  MedilinkProfesional,
} from '../medilink/medilink.types.js';
import { DeepseekClient, type DeepseekChatMessage } from './deepseek.client.js';
import { buildClinicaHeraPrompt, type Sucursal } from './ai.prompt.js';
import {
  AI_TOOL_NAMES,
  AI_TOOLS,
  type AiToolCall,
  type AiToolContext,
  type AiToolName,
} from './ai.tools.js';

const HISTORY_LIMIT = 16;
const MAX_TOOL_ROUNDS = 6;
const TZ = 'America/Santiago';

/**
 * v2 (oct 2026):
 * - Se eliminaron los flujos "forzados" por regex (agendar / cambiar / anular sin pasar por la IA).
 *   Anulaban horas con frases como "¿se puede cancelar por sesión?" y agendaban con el primer
 *   profesional habilitado. Ahora toda acción la decide la IA siguiendo el prompt.
 * - En su reemplazo hay una red de seguridad: si la IA dice que algo "quedó agendado/cambiado/anulado/
 *   confirmado" sin que la herramienta haya respondido OK en este turno, se le exige llamarla.
 * - El paciente siempre se identifica por el celular de la conversación (no por ids que mande la IA),
 *   y una cita solo se puede tocar si pertenece a ese paciente.
 * - Profesional por nombre: si no calza o calza con varios, error explicativo (antes caía al primero).
 * - Regla de citas por día, validación de RUT y deduplicación de fichas.
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly medilinkService: MedilinkService,
    private readonly chatService: ChatService,
    private readonly deepseek: DeepseekClient,
  ) {}

  listTools() {
    return AI_TOOLS;
  }

  async complete(prompt: string, context: AiToolContext = {}): Promise<string> {
    return this.runWithTools(
      [
        { role: 'system', content: await this.systemPrompt() },
        { role: 'user', content: prompt },
      ],
      context,
    );
  }

  async replyToConversation(conversation: ConversationDto): Promise<string> {
    const history = await this.chatService.findMessages(conversation.id);
    const recent = collapseUserRuns(
      history
        .filter((message) => message.role === 'user' || message.role === 'assistant')
        .slice(-HISTORY_LIMIT),
    );

    const messages: DeepseekChatMessage[] = [
      { role: 'system', content: await this.systemPrompt() },
      ...recent.map((message) => ({
        role: message.role as 'user' | 'assistant',
        content: message.content,
      })),
    ];

    const lastUser = [...recent].reverse().find((message) => message.role === 'user');
    if (lastUser && isAvailabilityIntent(lastUser.content)) {
      messages.push({
        role: 'system',
        content:
          'El paciente está preguntando por horas disponibles. Llama verCupos en este turno, aunque ya hayas hablado de horas antes: las que aparecen en el chat están desactualizadas. Ofrece todas las horas que devuelva la herramienta. Si son muchas, agrúpalas en mañana (antes de 12:00) y tarde (12:00 en adelante); si todas caen en el mismo bloque, muestra una sola lista sin títulos.',
      });
      this.logger.log(`AI availability nudge session=${conversation.id}`);
    }

    this.logger.log(`AI reply session=${conversation.id} turns=${recent.length}`);
    return this.runWithTools(messages, { celular: conversation.phone });
  }

  private async systemPrompt(): Promise<string> {
    const now = new Date();
    const todayIso = todayInChile();
    const weekday = now.toLocaleDateString('es-CL', { weekday: 'long', timeZone: TZ });
    const sucursales = await this.listSucursalesPrompt();
    return buildClinicaHeraPrompt(todayIso, weekday, sucursales, nowHourInChile());
  }

  private async listSucursalesPrompt(): Promise<Sucursal[]> {
    try {
      const items = await this.medilinkService.listSucursales();
      return items
        .filter((item) => item.habilitada !== 0)
        .map((item) => ({ id: item.id, nombre: item.nombre?.trim() || `Sucursal ${item.id}` }));
    } catch (error) {
      this.logger.warn(
        `No pude leer sucursales para el prompt: ${error instanceof Error ? error.message : 'error'}`,
      );
      return [];
    }
  }

  private async runWithTools(
    messages: DeepseekChatMessage[],
    context: AiToolContext,
  ): Promise<string> {
    const thread = [...messages];
    const succeeded = new Set<string>();
    let nudged = false;

    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const turn = await this.deepseek.completeTurn(thread, AI_TOOLS);
      if (!turn.toolCalls.length) {
        if (!turn.content) {
          throw new HttpException('DeepSeek devolvió una respuesta vacía', 502);
        }

        const unverified = unverifiedClaim(turn.content, succeeded, nudged);
        if (!unverified) {
          return turn.content;
        }
        if (nudged) {
          this.logger.warn(`AI afirmó "${unverified}" sin tool OK tras el aviso; respuesta bloqueada`);
          return 'No alcancé a completar eso en el sistema. ¿Me confirmas de nuevo para intentarlo?';
        }
        this.logger.warn(`AI afirmó "${unverified}" sin tool OK; se le pide llamarla`);
        nudged = true;
        thread.push({
          role: 'system',
          content: `Tu respuesta dice que algo quedó ${unverified}, pero en este turno ninguna herramienta lo hizo con éxito. Si el paciente ya confirmó esa acción, llama ahora la herramienta que corresponde. Si solo estás informando el estado de una cita que ya existía, llama verCitas y descríbela sin decir que "quedó" ${unverified}. Nunca afirmes una acción que no se ejecutó.`,
        });
        continue;
      }

      thread.push(turn.assistantMessage);
      for (const call of turn.toolCalls) {
        const result = await this.safeExecuteTool(call.function.name, call.function.arguments, context);
        if (result.ok) {
          succeeded.add(call.function.name);
        }
        thread.push({
          role: 'tool',
          tool_call_id: call.id,
          content: result.content,
        });
      }
    }

    throw new HttpException('La IA hizo demasiadas llamadas a tools', 502);
  }

  private async safeExecuteTool(
    name: string,
    rawArgs: string,
    context: AiToolContext,
  ): Promise<{ ok: boolean; content: string }> {
    let args: Record<string, unknown> = {};
    try {
      args = rawArgs ? (JSON.parse(rawArgs) as Record<string, unknown>) : {};
    } catch {
      return { ok: false, content: JSON.stringify({ error: 'Argumentos de tool inválidos' }) };
    }

    try {
      const result = await this.executeTool({ name, arguments: args }, context);
      return { ok: true, content: JSON.stringify(truncateToolResult(result)) };
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`AI tool ${name} failed: ${detail}`);
      return { ok: false, content: JSON.stringify({ error: detail }) };
    }
  }

  async executeTool(call: AiToolCall, context: AiToolContext = {}): Promise<unknown> {
    const name = call.name as AiToolName;
    if (!AI_TOOL_NAMES.includes(name)) {
      throw new HttpException(`Tool desconocida: ${call.name}`, 400);
    }

    const args = call.arguments ?? {};
    this.logger.log(`AI tool ${name} args=${JSON.stringify(args)}`);

    switch (name) {
      case 'verCitas': {
        const paciente = await this.findPaciente(args, context);
        if (!paciente) {
          return { tiene_ficha: false, citas: [] };
        }
        const citas = await this.citasVigentes(paciente.id);
        return { tiene_ficha: true, citas: citas.map(toCitaResumen) };
      }

      case 'verCupos':
        return this.verCupos(args);

      case 'verProfesionales':
        return this.verProfesionales(asString(args.especialidad));

      case 'crearCita': {
        const fecha = asString(args.fecha);
        const hora = asString(args.hora_inicio);
        if (!fecha || !hora) {
          throw new HttpException('crearCita requiere fecha y hora_inicio', 400);
        }
        const paciente = args.para_otra_persona === true
          ? await this.pacienteDeTercero(args)
          : await this.requirePaciente(args, context);
        const idProfesional = await this.resolveProfesionalArg(args);
        if (!idProfesional) {
          throw new HttpException(
            'crearCita requiere el profesional (nombre_profesional o id_profesional). Pregunta al paciente con quién se quiere atender.',
            400,
          );
        }
        const idSucursal = await this.resolveSucursalArg(args);
        const reemplazo = args.reemplazo === true;
        if (!reemplazo) {
          await this.assertCupoDiario(paciente.id, fecha, idProfesional);
        }
        return this.medilinkService.createCita({
          fecha,
          hora_inicio: hora,
          duracion: asNumber(args.duracion),
          comentario: buildComentario(asString(args.comentario)),
          id_profesional: idProfesional,
          id_sucursal: idSucursal,
          id_paciente: paciente.id,
          nueva_atencion: reemplazo,
        });
      }

      case 'confirmarCita': {
        const idCita = await this.requireCitaId(args, context);
        return this.medilinkService.confirmarCita(idCita);
      }

      case 'anularCita': {
        const idCita = await this.requireCitaId(args, context);
        return this.medilinkService.anularCita(idCita);
      }

      case 'cambiarCita': {
        const paciente = await this.requirePaciente(args, context);
        const idCita = await this.requireCitaId(args, context);
        const idProfesional = await this.resolveProfesionalArg(args);
        const fecha = asString(args.fecha);
        if (fecha) {
          const actual = (await this.citasVigentes(paciente.id)).find((cita) => cita.id === idCita);
          const profesionalFinal = idProfesional ?? profesionalDe(actual);
          await this.assertCupoDiario(paciente.id, fecha, profesionalFinal, idCita);
        }
        return this.medilinkService.changeCita({
          id_cita: idCita,
          fecha,
          hora_inicio: asString(args.hora_inicio),
          duracion: asNumber(args.duracion),
          id_profesional: idProfesional,
        });
      }

      case 'crearPaciente':
        return this.crearPaciente(args, context);

      default:
        throw new HttpException(`Tool no implementada: ${name}`, 501);
    }
  }

  private async crearPaciente(args: Record<string, unknown>, context: AiToolContext) {
    const nombre = asString(args.nombre);
    const apellidos = asString(args.apellidos);
    if (!nombre || !apellidos) {
      throw new HttpException('crearPaciente requiere nombre y apellidos', 400);
    }

    const paraOtra = args.para_otra_persona === true;
    const celularAjeno = asString(args.celular);
    if (paraOtra && !celularAjeno) {
      throw new HttpException(
        'Falta el celular de la otra persona. Pídelo. No uses el WhatsApp de quien escribe.',
        400,
      );
    }
    const celular = paraOtra
      ? celularAjeno
      : preferConversationPhone(celularAjeno, context.celular);
    if (!paraOtra && celular) {
      const existentes = await this.medilinkService.findPacientes({ celular });
      if (existentes[0]) {
        return { ya_existia: true, id_paciente: existentes[0].id };
      }
    }

    const extranjero = asBool(args.extranjero);
    const rutRaw = asString(args.rut);
    const rutChileno = rutRaw ? normalizeRut(rutRaw) : undefined;
    if (rutRaw && !rutChileno && extranjero !== true) {
      throw new HttpException(
        'RUT inválido (formato o dígito verificador). Pide al paciente que lo revise. Si es extranjero, indícalo y usa su pasaporte.',
        400,
      );
    }
    const rut = rutChileno ?? (extranjero ? rutRaw : undefined);
    if (rutChileno) {
      const porRut = await this.medilinkService.findPacientes({ rut: rutChileno });
      if (porRut[0]) {
        if (paraOtra) {
          return this.fichaTerceroExistente(porRut[0].id, rutChileno, asString(args.direccion), asString(args.comuna));
        }
        throw new HttpException(
          'Ya existe una ficha con ese RUT asociada a otro número. No la modifiques ni des sus datos: entrega el contacto de recepción.',
          409,
        );
      }
    }
    if (paraOtra && celular && (rutChileno || rutRaw)) {
      const porCelular = await this.medilinkService.findPacientes({ celular });
      const ficha = porCelular[0];
      if (ficha) {
        const rutFicha = ficha.rut ? normalizeRut(ficha.rut) : undefined;
        const rutDistinto =
          (rutChileno && rutFicha && rutFicha !== rutChileno) ||
          (!rutChileno && !!ficha.rut?.trim() && fold(ficha.rut) !== fold(rutRaw ?? ''));
        if (rutDistinto) {
          throw new HttpException(
            'Ese celular ya tiene una ficha con otro RUT. No la uses: entrega el contacto de recepción.',
            409,
          );
        }
        return this.fichaTerceroExistente(
          ficha.id,
          rutChileno ?? rutRaw ?? '',
          asString(args.direccion),
          asString(args.comuna),
        );
      }
    }

    const email = asString(args.email);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpException('Falta un correo válido. Pide al paciente que lo revise.', 400);
    }

    const direccion = asString(args.direccion);
    const ocupacion = asString(args.ocupacion);
    if (!direccion || !ocupacion || extranjero === undefined) {
      throw new HttpException(
        'Faltan datos de la ficha. Pide solo lo que falte: dirección, ocupación o profesión, y si es extranjero (sí o no).',
        400,
      );
    }
    if (!rutRaw) {
      throw new HttpException(
        extranjero
          ? 'Falta el pasaporte o el RUT. Pídeselo al paciente.'
          : 'Falta el RUT. Pídeselo al paciente.',
        400,
      );
    }

    const lugar = inferLugar(direccion, asString(args.comuna));
    const otroContacto = asString(args.telefono) ?? asString(args.celular);
    const telefono =
      otroContacto && celular && !samePhone(otroContacto, celular) ? otroContacto : celular;
    const creado = await this.medilinkService.createPaciente({
      nombre,
      apellidos,
      celular,
      telefono,
      rut,
      email,
      direccion,
      comuna: lugar.comuna,
      ciudad: lugar.ciudad,
      observaciones: `Ocupación: ${ocupacion}. Extranjero: ${extranjero ? 'sí' : 'no'}.`,
    });
    return {
      creado: true,
      id_paciente: creado.id,
      ...(paraOtra ? { para_otra_persona: true, rut: rut ?? rutRaw } : {}),
      comuna: lugar.comuna,
      sucursal_sugerida: lugar.sucursal,
    };
  }

  /** La hora de un tercero solo se engancha al id que calza con el RUT recién entregado. */
  private async pacienteDeTercero(args: Record<string, unknown>): Promise<MedilinkPaciente> {
    const idPaciente = asNumber(args.id_paciente);
    const rutRaw = asString(args.rut);
    if (!idPaciente || !rutRaw) {
      throw new HttpException(
        'Para agendar a otra persona hacen falta id_paciente y rut, los que devolvió crearPaciente. No inventes el id.',
        400,
      );
    }
    const paciente = await this.medilinkService.getPaciente(idPaciente);
    const rutChileno = normalizeRut(rutRaw);
    const rutFicha = paciente.rut ? normalizeRut(paciente.rut) : undefined;
    const calzaRut = rutChileno
      ? rutFicha === rutChileno
      : fold(paciente.rut ?? '') === fold(rutRaw);
    const celular = asString(args.celular);
    const calzaCelular =
      !paciente.rut?.trim() &&
      !!celular &&
      !!paciente.celular &&
      samePhone(celular, paciente.celular);
    if (!calzaRut && !calzaCelular) {
      throw new HttpException(
        'Ese id no corresponde al RUT indicado. Usa el id_paciente que devolvió crearPaciente para ese RUT.',
        400,
      );
    }
    return paciente;
  }

  private fichaTerceroExistente(
    idPaciente: number,
    rut: string,
    direccion?: string,
    comuna?: string,
  ) {
    const lugar = direccion ? inferLugar(direccion, comuna) : undefined;
    return {
      ya_existia: true,
      para_otra_persona: true,
      id_paciente: idPaciente,
      rut,
      ...(lugar?.sucursal ? { comuna: lugar.comuna, sucursal_sugerida: lugar.sucursal } : {}),
    };
  }

  private async verProfesionales(especialidad?: string) {
    const [profesionales, especialidades] = await Promise.all([
      this.medilinkService.listProfesionales(),
      this.medilinkService.listEspecialidades(),
    ]);
    const especialidadById = new Map(
      especialidades.map((item) => [item.id, item.nombre ?? ''] as const),
    );
    const needle = especialidad ? fold(especialidad) : '';

    return profesionales
      .filter((item) => item.habilitado !== 0)
      .map((item) => {
        const rubro =
          item.especialidad?.trim() ||
          especialidadById.get(item.id_especialidad ?? -1)?.trim() ||
          'Consulta general';
        return { id: item.id, nombre: nombreProfesional(item), especialidad: rubro };
      })
      .filter((item) => item.nombre)
      .filter((item) => !needle || fold(`${item.nombre} ${item.especialidad}`).includes(needle));
  }

  private async verCupos(args: Record<string, unknown>) {
    const fecha = asString(args.fecha);
    const duracion = asNumber(args.duracion);
    const idProfesional = await this.resolveProfesionalArg(args);
    const idSucursal = await this.resolveSucursalArg(args, false);
    const idEspecialidad = asNumber(args.id_especialidad);

    if (fecha) {
      if (!idProfesional) {
        throw new HttpException(
          'verCupos con fecha requiere el profesional (nombre_profesional o id_profesional). Si el paciente no tiene preferencia, elige según "Equipo y prestaciones" y consulta a uno a la vez.',
          400,
        );
      }
      // Sin fallback a otra sucursal: si no hay cupos donde se pidió, se informa así.
      const slots = await this.medilinkService.getAgenda({
        fecha,
        id_sucursal: idSucursal,
        id_profesional: idProfesional,
        duracion,
      });
      const horas = [
        ...new Set(slots.map((slot) => (slot.hora_inicio ?? '').slice(0, 5)).filter(Boolean)),
      ].filter((hora) => fecha !== todayInChile() || hora > nowHourInChile());
      return {
        fecha,
        fecha_texto: fechaTexto(fecha),
        cantidad: horas.length,
        horas,
        profesional: slots[0]?.nombre_profesional,
      };
    }

    if (!idEspecialidad) {
      throw new HttpException('verCupos requiere fecha (YYYY-MM-DD).', 400);
    }
    return this.medilinkService.getProximosCupos(idEspecialidad);
  }

  /** Paciente de la conversación. Con celular de WhatsApp se ignora cualquier id que mande la IA. */
  private async findPaciente(
    args: Record<string, unknown>,
    context: AiToolContext,
  ): Promise<MedilinkPaciente | undefined> {
    if (!context.celular) {
      const idPaciente = asNumber(args.id_paciente);
      if (idPaciente) {
        return this.medilinkService.getPaciente(idPaciente);
      }
    }
    const celular = preferConversationPhone(asString(args.celular), context.celular);
    if (!celular) {
      throw new HttpException('Falta el celular del paciente', 400);
    }
    const matches = await this.medilinkService.findPacientes({ celular });
    return matches[0];
  }

  private async requirePaciente(
    args: Record<string, unknown>,
    context: AiToolContext,
  ): Promise<MedilinkPaciente> {
    const paciente = await this.findPaciente(args, context);
    if (!paciente) {
      throw new HttpException(
        'El paciente no tiene ficha con este celular. Sigue "Crear la ficha" antes de continuar.',
        404,
      );
    }
    return paciente;
  }

  /** Solo acepta citas vigentes del propio paciente; si hay varias, exige elegir. */
  private async requireCitaId(
    args: Record<string, unknown>,
    context: AiToolContext,
  ): Promise<number> {
    const paciente = await this.requirePaciente(args, context);
    const citas = await this.citasVigentes(paciente.id);
    const idCita = asNumber(args.id_cita);

    if (idCita) {
      if (!citas.some((cita) => cita.id === idCita)) {
        throw new HttpException(
          'Esa cita no pertenece al paciente o ya no está vigente. Llama verCitas y usa un id_cita de ahí.',
          404,
        );
      }
      return idCita;
    }
    if (citas.length === 1) {
      return citas[0].id;
    }
    if (!citas.length) {
      throw new HttpException('El paciente no tiene citas vigentes.', 404);
    }
    throw new HttpException(
      `El paciente tiene ${citas.length} citas vigentes. Pregúntale cuál y usa su id_cita (de verCitas).`,
      409,
    );
  }

  /** Citas no anuladas desde ahora en adelante, ordenadas por fecha y hora. */
  private async citasVigentes(idPaciente: number): Promise<MedilinkCita[]> {
    const hoy = todayInChile();
    const ahora = nowHourInChile();
    const citas = await this.medilinkService.listCitasPaciente(idPaciente);
    return citas
      .filter((cita) => !isCancelledCita(cita))
      .filter((cita) => {
        const fecha = isoFecha(cita.fecha);
        if (!fecha) {
          return false;
        }
        return fecha > hoy || (fecha === hoy && (cita.hora_inicio ?? '').slice(0, 5) >= ahora);
      })
      .sort((a, b) =>
        `${isoFecha(a.fecha)} ${a.hora_inicio ?? ''}`.localeCompare(
          `${isoFecha(b.fecha)} ${b.hora_inicio ?? ''}`,
        ),
      );
  }

  /**
   * Regla de la clínica: 1 hora por día; excepcionalmente 2 el mismo día con profesionales distintos.
   * @param excluirCita cita que se está cambiando (no cuenta contra sí misma)
   */
  private async assertCupoDiario(
    idPaciente: number,
    fecha: string,
    idProfesional: number | undefined,
    excluirCita?: number,
  ): Promise<void> {
    const delDia = (await this.citasVigentes(idPaciente)).filter(
      (cita) => cita.id !== excluirCita && isoFecha(cita.fecha) === fecha,
    );
    if (idProfesional && delDia.some((cita) => profesionalDe(cita) === idProfesional)) {
      throw new HttpException(
        'El paciente ya tiene una hora ese día con ese mismo profesional. No se agenda otra: ofrece otro día.',
        409,
      );
    }
    if (delDia.length >= 2) {
      throw new HttpException(
        'El paciente ya tiene 2 horas ese día, que es el máximo. Ofrece otro día.',
        409,
      );
    }
  }

  /** id del profesional desde id_profesional o nombre_profesional, sin caer a un profesional por defecto. */
  private async resolveProfesionalArg(args: Record<string, unknown>): Promise<number | undefined> {
    const profesionales = await this.medilinkService.listProfesionales();
    const habilitados = profesionales.filter((item) => item.habilitado !== 0);

    const id = asNumber(args.id_profesional);
    if (id) {
      if (!habilitados.some((item) => item.id === id)) {
        throw new HttpException(
          `No hay un profesional habilitado con id ${id}. Usa nombre_profesional o revisa con verProfesionales.`,
          404,
        );
      }
      return id;
    }

    const nombre = asString(args.nombre_profesional);
    if (!nombre) {
      return undefined;
    }
    const tokens = nameTokens(nombre);
    if (!tokens.length) {
      throw new HttpException(`Nombre de profesional no válido: "${nombre}"`, 400);
    }
    const matches = habilitados.filter((item) => {
      const full = fold(`${item.nombre ?? ''} ${item.apellidos ?? ''}`);
      return tokens.every((token) => full.includes(token));
    });
    if (matches.length === 1) {
      return matches[0].id;
    }
    if (!matches.length) {
      throw new HttpException(
        `No encontré un profesional habilitado llamado "${nombre}". Revisa con verProfesionales.`,
        404,
      );
    }
    throw new HttpException(
      `"${nombre}" calza con varios profesionales: ${matches.map(nombreProfesional).join(', ')}. Pregunta al paciente cuál.`,
      409,
    );
  }

  /** Valida id_sucursal. Si hay más de una sucursal y no viene, crearCita no puede adivinarla. */
  private async resolveSucursalArg(
    args: Record<string, unknown>,
    requerida = true,
  ): Promise<number | undefined> {
    const sucursales = (await this.medilinkService.listSucursales()).filter(
      (item) => item.habilitada !== 0,
    );
    const id = asNumber(args.id_sucursal);
    if (id) {
      if (!sucursales.some((item) => item.id === id)) {
        throw new HttpException(
          `id_sucursal ${id} no existe. Usa un id de la lista de sucursales del prompt.`,
          400,
        );
      }
      return id;
    }
    if (sucursales.length === 1) {
      return sucursales[0].id;
    }
    if (requerida && sucursales.length > 1) {
      throw new HttpException(
        'Falta id_sucursal. Pregunta al paciente en qué sucursal quiere atenderse y usa el id de la lista.',
        400,
      );
    }
    return undefined;
  }
}

/**
 * Frases con que la IA da por hecha una acción, y qué tool OK la respalda.
 * En el segundo intento se acepta verCitas como respaldo para estados ya existentes.
 */
function unverifiedClaim(
  text: string,
  succeeded: Set<string>,
  segundoIntento: boolean,
): string | undefined {
  const ok = (...names: string[]) => names.some((name) => succeeded.has(name));
  const claims: Array<{ label: string; re: RegExp; backed: () => boolean }> = [
    {
      label: 'agendada',
      re: /qued[oó]\s+(agendad|reservad)|te\s+(la\s+)?agend[eé]/i,
      backed: () => ok('crearCita') || (segundoIntento && ok('verCitas')),
    },
    {
      label: 'cambiada',
      re: /qued[oó]\s+(cambiad|modificad|movid|reprogramad)/i,
      backed: () => ok('cambiarCita') || (ok('crearCita') && ok('anularCita')),
    },
    {
      label: 'anulada',
      re: /qued[oó]\s+anulad|anul[eé]\s+tu/i,
      backed: () => ok('anularCita'),
    },
    {
      label: 'confirmada',
      re: /qued[oó]\s+confirmad|confirm[eé]\s+tu\s+asistencia/i,
      backed: () => ok('confirmarCita') || (segundoIntento && ok('verCitas')),
    },
    {
      label: 'creada',
      re: /(cre[eé]|qued[oó]\s+cread[ao])\s+tu\s+ficha|tu\s+ficha\s+qued[oó]/i,
      backed: () => ok('crearPaciente'),
    },
  ];
  return claims.find((claim) => claim.re.test(text) && !claim.backed())?.label;
}

function isAvailabilityIntent(text: string): boolean {
  if (/(cupos?|disponibilidad|disponibles?)/i.test(text)) {
    return true;
  }
  if (/\bhay\b/i.test(text) && /(hora|\d{1,2}([:.]\d{2})?|ma[ñn]ana|tarde)/i.test(text)) {
    return true;
  }
  return (
    /\bhoras?\b/i.test(text) &&
    /(qu[eé]|cu[aá]l|dime|mu[eé]stra|muestra|ver|tiene|tienes|quedan|libres)/i.test(text)
  );
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/** "2026-10-15" → "jueves 15 de octubre", para que la IA no muestre fechas ISO. */
function fechaTexto(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) {
    return iso;
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DIAS[date.getUTCDay()]} ${d} de ${MESES[m - 1]}`;
}

function toCitaResumen(cita: MedilinkCita) {
  const fecha = isoFecha(cita.fecha) ?? '';
  return {
    id_cita: cita.id,
    fecha,
    fecha_texto: fecha ? fechaTexto(fecha) : undefined,
    hora: (cita.hora_inicio ?? '').slice(0, 5),
    profesional: cita.nombre_profesional ?? cita.nombre_dentista,
    id_profesional: profesionalDe(cita),
    sucursal: cita.nombre_sucursal,
    id_sucursal: cita.id_sucursal,
    estado: cita.estado_cita,
  };
}

function buildComentario(comentario?: string): string {
  return comentario ? `${comentario} (agendada por WhatsApp)` : 'Agendada por WhatsApp';
}

function profesionalDe(cita?: MedilinkCita): number | undefined {
  return cita?.id_profesional ?? cita?.id_dentista;
}

function nombreProfesional(item: MedilinkProfesional): string {
  return [item.nombre, item.apellidos]
    .filter(Boolean)
    .join(' ')
    .replace(/\b(dr\.?|dra\.?|dentista|m[eé]dico)(?=\s|$)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const NAME_STOPWORDS = new Set([
  'dr', 'dra', 'doctor', 'doctora', 'matrona', 'kine', 'kinesiologa', 'kinesiologo',
  'con', 'la', 'el', 'los', 'las', 'del', 'de', 'y',
]);

function nameTokens(value: string): string[] {
  return fold(value)
    .replace(/[^a-zñ\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !NAME_STOPWORDS.has(token));
}

/** Valida RUT chileno (módulo 11). Devuelve "12345678-5" o undefined si no es válido. */
export function normalizeRut(raw: string): string | undefined {
  const clean = raw.replace(/[.\s-]/g, '').toUpperCase();
  const match = clean.match(/^(\d{7,8})([0-9K])$/);
  if (!match) {
    return undefined;
  }
  const [, body, dv] = match;
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += Number(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const rest = 11 - (sum % 11);
  const expected = rest === 11 ? '0' : rest === 10 ? 'K' : String(rest);
  return expected === dv ? `${body}-${dv}` : undefined;
}

function todayInChile(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ });
}

function nowHourInChile(): string {
  return new Date().toLocaleTimeString('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function isoFecha(fecha?: string): string | undefined {
  if (!fecha) {
    return undefined;
  }
  return fecha.includes('/') ? toIsoDate(fecha) : fecha.slice(0, 10);
}

function asBool(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value !== 'string') {
    return undefined;
  }
  const text = fold(value);
  if (['si', 'true', '1', 'extranjero'].includes(text)) {
    return true;
  }
  if (['no', 'false', '0', 'chileno', 'chilena'].includes(text)) {
    return false;
  }
  return undefined;
}

/** La dirección decide si la hora queda en La Serena o en Coquimbo. */
function inferLugar(
  direccion: string,
  comuna?: string,
): { comuna: string; ciudad: string; sucursal: string } {
  const text = fold(`${direccion} ${comuna ?? ''}`);
  const coquimbo = /coquimbo|tierras blancas|guayacan|sindempart|penuelas|la cantera/.test(text);
  const serena = /la serena|\bserena\b|las companias|la florida|la pampa|el milagro|cerro grande/.test(text);
  if (coquimbo && !serena) {
    return { comuna: 'Coquimbo', ciudad: 'Coquimbo', sucursal: 'Coquimbo' };
  }
  if (serena && !coquimbo) {
    return { comuna: 'La Serena', ciudad: 'La Serena', sucursal: 'La Serena' };
  }
  const fallback = comuna?.trim() || '';
  return { comuna: fallback, ciudad: fallback, sucursal: '' };
}

function preferConversationPhone(arg?: string, context?: string): string | undefined {
  if (context && arg && !samePhone(arg, context)) {
    return context;
  }
  return arg ?? context;
}

function samePhone(left: string, right: string): boolean {
  const a = left.replace(/\D/g, '');
  const b = right.replace(/\D/g, '');
  if (!a || !b) {
    return false;
  }
  return a === b || a.endsWith(b) || b.endsWith(a);
}

function asString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function truncateToolResult(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }
  if (value[0] && typeof value[0] === 'object' && value[0] !== null && 'hora_inicio' in value[0]) {
    return value;
  }
  return value.slice(0, 40);
}

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function isCancelledCita(cita: MedilinkCita): boolean {
  const name = fold(cita.estado_cita ?? '');
  if (name.includes('anul')) {
    return true;
  }
  if (cita.estado_anulacion === 1 && !name.includes('cambio')) {
    return true;
  }
  return false;
}

/** Varios mensajes seguidos del paciente cuentan como una sola idea. */
function collapseUserRuns<T extends { role: string; content: string }>(messages: T[]): T[] {
  const collapsed: T[] = [];
  for (const message of messages) {
    const previous = collapsed[collapsed.length - 1];
    if (message.role === 'user' && previous?.role === 'user') {
      previous.content = `${previous.content}\n${message.content}`;
      continue;
    }
    collapsed.push({ ...message });
  }
  return collapsed;
}

function toIsoDate(value: string): string {
  const [day, month, year] = value.split('/');
  if (!year) {
    return value;
  }
  return `${year.padStart(4, '20')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}