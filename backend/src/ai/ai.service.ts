import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ChatService } from '../chat/chat.service.js';
import type { ConversationDto } from '../chat/chat.types.js';
import { MedilinkService } from '../medilink/medilink.service.js';
import type { MedilinkCita, MedilinkPaciente } from '../medilink/medilink.types.js';
import { DeepseekClient, type DeepseekChatMessage } from './deepseek.client.js';
import { buildClinicaHeraPrompt } from './ai.prompt.js';
import {
  AI_TOOL_NAMES,
  AI_TOOLS,
  type AiToolCall,
  type AiToolContext,
  type AiToolName,
} from './ai.tools.js';

const HISTORY_LIMIT = 16;
const MAX_TOOL_ROUNDS = 6;

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

    const lastUser = [...recent].reverse().find((message) => message.role === 'user');
    const lastAssistant = [...recent].reverse().find((message) => message.role === 'assistant');
    if (lastUser && shouldForceCancel(lastUser.content, lastAssistant?.content)) {
      return this.cancelFromConversation(conversation);
    }
    if (lastUser && shouldForceChange(lastUser.content, lastAssistant?.content)) {
      return this.changeFromConversation(conversation, recent);
    }
    if (lastUser && shouldForceBook(lastUser.content, lastAssistant?.content)) {
      return this.bookFromConversation(conversation, recent);
    }

    const messages: DeepseekChatMessage[] = [
      { role: 'system', content: await this.systemPrompt() },
      ...recent.map((message) => ({
        role: message.role as 'user' | 'assistant',
        content: message.content,
      })),
    ];

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

  private async bookFromConversation(
    conversation: ConversationDto,
    recent: Array<{ role: string; content: string }>,
  ): Promise<string> {
    const todayIso = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
    const booking = extractBooking(
      recent.map((message) => message.content),
      todayIso,
    );
    if (!booking.fecha || !booking.hora) {
      return '¿Me confirmas el día y la hora para agendar?';
    }

    this.logger.log(`AI forced crearCita session=${conversation.id} fecha=${booking.fecha} hora=${booking.hora}`);
    try {
      const result = (await this.executeTool(
        {
          name: 'crearCita',
          arguments: {
            fecha: booking.fecha,
            hora_inicio: booking.hora,
            celular: conversation.phone,
            comentario: 'Consulta agendada por WhatsApp',
          },
        },
        { celular: conversation.phone },
      )) as MedilinkCita;
      const when = [result.fecha ?? booking.fecha, (result.hora_inicio ?? booking.hora).slice(0, 5)]
        .filter(Boolean)
        .join(' a las ');
      return `Listo, tu hora del ${when} quedó agendada.`;
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`AI forced crearCita failed: ${detail}`);
      return 'No pude agendar esa hora en el sistema. ¿Quieres que te ofrezca otro horario?';
    }
  }

  private async changeFromConversation(
    conversation: ConversationDto,
    recent: Array<{ role: string; content: string }>,
  ): Promise<string> {
    const todayIso = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
    const texts = recent.map((message) => message.content);
    const lastUser = [...recent].reverse().find((message) => message.role === 'user')?.content ?? '';
    const profesional = extractProfesional(lastUser) ?? [...texts].reverse().map(extractProfesional).find(Boolean);
    const citas = (await this.executeTool(
      { name: 'verCitas', arguments: {} },
      { celular: conversation.phone },
    )) as MedilinkCita[];
    const current = pickUpcomingCita(citas);
    const horaActual = current?.hora_inicio?.slice(0, 5);
    // Si el paciente solo dijo "confirmo", la hora pedida está en la pregunta de
    // confirmación. No se busca más atrás para no tomar una hora de un listado.
    const lastAssistant =
      [...recent].reverse().find((message) => message.role === 'assistant')?.content ?? '';
    const hora =
      extractHora(lastUser) ??
      (isChangeConfirmPrompt(lastAssistant)
        ? extractHoraObjetivo(lastAssistant, horaActual)
        : undefined) ??
      horaActual;
    const fecha = extractFecha(lastUser, todayIso) ?? current?.fecha;

    this.logger.log(
      `AI forced cambio session=${conversation.id} fecha=${fecha ?? ''} hora=${hora ?? ''} cita=${current?.id ?? ''} profesional=${profesional ?? ''}`,
    );

    if (
      current &&
      fecha === current.fecha &&
      hora === horaActual &&
      isSameProfesional(profesional, current)
    ) {
      return `Tu hora ya está agendada para el ${fecha} a las ${horaActual}. ¿A qué hora la quieres mover?`;
    }

    try {
      const result = (await this.executeTool(
        {
          name: 'cambiarCita',
          arguments: {
            id_cita: current?.id,
            fecha,
            hora_inicio: hora,
            nombre_profesional: profesional,
            celular: conversation.phone,
          },
        },
        { celular: conversation.phone },
      )) as MedilinkCita;
      const when = [result.fecha ?? fecha, (result.hora_inicio ?? hora ?? '').slice(0, 5)]
        .filter(Boolean)
        .join(' a las ');
      const who = result.nombre_profesional ?? result.nombre_dentista ?? profesional;
      return who
        ? `Listo, tu hora quedó cambiada al ${when} con ${who}.`
        : `Listo, tu hora quedó cambiada al ${when}.`;
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`AI forced cambio failed: ${detail}`);
      if (/tope con otra cita|ya cuenta con una cita|cupo/i.test(detail)) {
        return hora
          ? `Las ${hora} se acaban de ocupar. ¿Quieres que te ofrezca las otras horas libres de ese día?`
          : 'Esa hora se acaba de ocupar. ¿Quieres que te ofrezca las otras horas libres de ese día?';
      }
      return 'No pude cambiar esa hora en el sistema. ¿Quieres que te ofrezca otra alternativa?';
    }
  }

  private async cancelFromConversation(conversation: ConversationDto): Promise<string> {
    this.logger.log(`AI forced anularCita session=${conversation.id}`);
    try {
      const result = (await this.executeTool(
        { name: 'anularCita', arguments: {} },
        { celular: conversation.phone },
      )) as MedilinkCita;
      const when = [result.fecha, result.hora_inicio?.slice(0, 5)].filter(Boolean).join(' a las ');
      return when
        ? `Listo, tu hora del ${when} quedó anulada.`
        : 'Listo, tu hora quedó anulada.';
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`AI forced anularCita failed: ${detail}`);
      return 'No pude anular la hora en el sistema. ¿Me confirmas el día y la hora para reintentar?';
    }
  }

  private async systemPrompt(): Promise<string> {
    const now = new Date();
    const todayIso = now.toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
    const weekday = now.toLocaleDateString('es-CL', {
      weekday: 'long',
      timeZone: 'America/Santiago',
    });
    const horaActual = now.toLocaleTimeString('en-GB', {
      timeZone: 'America/Santiago',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const sucursales = await this.listSucursalesPrompt();
    return buildClinicaHeraPrompt(todayIso, weekday, sucursales, horaActual);
  }

  private async listSucursalesPrompt() {
    try {
      const items = await this.medilinkService.listSucursales();
      return items
        .filter((item) => item.habilitada !== 0)
        .map((item) => ({ nombre: item.nombre?.trim() || `Sucursal ${item.id}` }));
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

    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const turn = await this.deepseek.completeTurn(thread, AI_TOOLS);
      if (!turn.toolCalls.length) {
        if (!turn.content) {
          throw new HttpException('DeepSeek devolvió una respuesta vacía', 502);
        }
        return turn.content;
      }

      thread.push(turn.assistantMessage);
      for (const call of turn.toolCalls) {
        const result = await this.safeExecuteTool(call.function.name, call.function.arguments, context);
        thread.push({
          role: 'tool',
          tool_call_id: call.id,
          content: result,
        });
      }
    }

    throw new HttpException('La IA hizo demasiadas llamadas a tools', 502);
  }

  private async safeExecuteTool(
    name: string,
    rawArgs: string,
    context: AiToolContext,
  ): Promise<string> {
    let args: Record<string, unknown> = {};
    try {
      args = rawArgs ? (JSON.parse(rawArgs) as Record<string, unknown>) : {};
    } catch {
      return JSON.stringify({ error: 'Argumentos de tool inválidos' });
    }

    try {
      const result = await this.executeTool({ name, arguments: args }, context);
      return JSON.stringify(truncateToolResult(result));
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`AI tool ${name} failed: ${detail}`);
      return JSON.stringify({ error: detail });
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
      case 'buscarPaciente':
        return this.medilinkService.findPacientes({
          celular: preferConversationPhone(asString(args.celular), context.celular),
          rut: asString(args.rut),
          nombre: asString(args.nombre),
        });

      case 'verCitas': {
        const paciente = await this.requirePaciente(args, context);
        const citas = await this.medilinkService.listCitasPaciente(paciente.id);
        const vigentes = citas.filter((cita) => !isCancelledCita(cita));
        return vigentes;
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
        return this.medilinkService.createCita({
          fecha,
          hora_inicio: hora,
          duracion: asNumber(args.duracion),
          comentario: asString(args.comentario),
          id_profesional: asNumber(args.id_profesional),
          nombre_profesional: asString(args.nombre_profesional),
          id_sucursal: asNumber(args.id_sucursal),
          id_paciente: asNumber(args.id_paciente),
          celular: preferConversationPhone(asString(args.celular), context.celular),
          nueva_atencion: args.reemplazo === true,
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
        const idCita = await this.requireCitaId(args, context);
        return this.medilinkService.changeCita({
          id_cita: idCita,
          fecha: asString(args.fecha),
          hora_inicio: asString(args.hora_inicio),
          duracion: asNumber(args.duracion),
          id_profesional: asNumber(args.id_profesional),
          nombre_profesional: asString(args.nombre_profesional),
        });
      }

      case 'crearPaciente': {
        const nombre = asString(args.nombre);
        const apellidos = asString(args.apellidos);
        if (!nombre || !apellidos) {
          throw new HttpException('crearPaciente requiere nombre y apellidos', 400);
        }
        return this.medilinkService.createPaciente({
          nombre,
          apellidos,
          celular: preferConversationPhone(asString(args.celular), context.celular),
          rut: asString(args.rut),
          email: asString(args.email),
        });
      }

      default:
        throw new HttpException(`Tool no implementada: ${name}`, 501);
    }
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
        const nombre = [item.nombre, item.apellidos]
          .filter(Boolean)
          .join(' ')
          .replace(/\b(dr\.?|dra\.?|dentista|m[eé]dico)\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
        const rubro =
          item.especialidad?.trim() ||
          especialidadById.get(item.id_especialidad ?? -1)?.trim() ||
          'Consulta general';
        return {
          id: item.id,
          nombre,
          especialidad: rubro,
        };
      })
      .filter((item) => item.nombre)
      .filter((item) => !needle || fold(`${item.nombre} ${item.especialidad}`).includes(needle));
  }

  private async verCupos(args: Record<string, unknown>) {
    const fecha = asString(args.fecha);
    const duracion = asNumber(args.duracion);
    let idProfesional = asNumber(args.id_profesional);
    const idSucursal = asNumber(args.id_sucursal);
    const idEspecialidad = asNumber(args.id_especialidad);
    const nombreProfesional = asString(args.nombre_profesional);

    if (!idProfesional && nombreProfesional) {
      const profesionales = await this.medilinkService.listProfesionales();
      const needle = fold(nombreProfesional);
      const match = profesionales.find((item) =>
        fold(`${item.nombre ?? ''} ${item.apellidos ?? ''}`).includes(needle),
      );
      idProfesional = match?.id;
    }

    if (fecha) {
      let slots = await this.medilinkService.getAgenda({
        fecha,
        id_sucursal: idSucursal,
        id_profesional: idProfesional,
        duracion,
      });
      if (!slots.length && idSucursal) {
        slots = await this.medilinkService.getAgenda({
          fecha,
          id_profesional: idProfesional,
          duracion,
        });
      }
      const horas = [...new Set(slots.map((slot) => (slot.hora_inicio ?? '').slice(0, 5)).filter(Boolean))];
      return {
        fecha,
        cantidad: horas.length,
        horas,
        profesional: slots[0]?.nombre_profesional,
      };
    }

    const especialidadId =
      idEspecialidad ?? (await this.medilinkService.listEspecialidades())[0]?.id;
    if (!especialidadId) {
      throw new HttpException('No hay especialidad para consultar cupos', 422);
    }
    return this.medilinkService.getProximosCupos(especialidadId);
  }

  private async requirePaciente(
    args: Record<string, unknown>,
    context: AiToolContext,
  ): Promise<MedilinkPaciente> {
    const idPaciente = asNumber(args.id_paciente);
    if (idPaciente) {
      return this.medilinkService.getPaciente(idPaciente);
    }

    const celular = preferConversationPhone(asString(args.celular), context.celular);
    if (!celular) {
      throw new HttpException('Falta celular o id_paciente', 400);
    }

    const matches = await this.medilinkService.findPacientes({ celular });
    if (!matches[0]) {
      throw new HttpException(`No hay paciente en MediLink con celular ${celular}`, 404);
    }
    return matches[0];
  }

  private async requireCitaId(
    args: Record<string, unknown>,
    context: AiToolContext,
  ): Promise<number> {
    const idCita = asNumber(args.id_cita);
    if (idCita) {
      return idCita;
    }

    const paciente = await this.requirePaciente(args, context);
    const citas = (await this.medilinkService.listCitasPaciente(paciente.id)).filter(
      (cita) => !isCancelledCita(cita),
    );
    const next = pickUpcomingCita(citas);
    if (!next) {
      throw new HttpException('El paciente no tiene citas para actualizar', 404);
    }
    return next.id;
  }
}

function shouldForceChange(userText: string, lastAssistant?: string): boolean {
  if (isCancelIntent(userText)) {
    return false;
  }
  const hasDetails = Boolean(extractHora(userText) || extractProfesional(userText));
  if (isChangeIntent(userText) && hasDetails) {
    return true;
  }
  return isAffirmative(userText) && Boolean(lastAssistant && isChangeConfirmPrompt(lastAssistant));
}

function isChangeIntent(text: string): boolean {
  return /(cambi(ar|o)|reprogram|otro profesional|profesional|otra hora|pasarla|moverla)/i.test(
    text,
  );
}

/**
 * Solo cuenta como confirmación si la IA propuso un horario concreto. Si todavía
 * está pidiendo datos ("¿con qué profesional?"), un "sí" no debe ejecutar el cambio.
 */
function isChangeConfirmPrompt(text: string): boolean {
  if (isCancelIntent(text) || !isChangeIntent(text)) {
    return false;
  }
  if (/(qu[eé]|cu[aá]l)\s+profesional|lista de (los )?profesionales/i.test(text)) {
    return false;
  }
  return Boolean(extractHora(text));
}

function extractProfesional(text: string): string | undefined {
  const match = text.match(
    /(?:con|(?:el\s+)?profesional(?:\s+a)?)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ]+)?)/i,
  );
  const name = match?.[1]?.trim();
  if (!name || /^(a|el|la|un|una)$/i.test(name)) {
    return undefined;
  }
  return name;
}

function shouldForceBook(userText: string, lastAssistant?: string): boolean {
  return isAffirmative(userText) && Boolean(lastAssistant && isBookConfirmPrompt(lastAssistant));
}

function isBookConfirmPrompt(text: string): boolean {
  if (isCancelIntent(text)) {
    return false;
  }
  return /(agend|te la agendo|confirmas con un|confirmo entonces)/i.test(text);
}

function extractBooking(texts: string[], todayIso: string): { fecha?: string; hora?: string } {
  let fecha: string | undefined;
  let hora: string | undefined;
  for (const text of [...texts].reverse()) {
    fecha ??= extractFecha(text, todayIso);
    hora ??= extractHora(text);
    if (fecha && hora) {
      break;
    }
  }
  return { fecha, hora };
}

function extractFecha(text: string, todayIso: string): string | undefined {
  const iso = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (iso) {
    return iso[1];
  }

  const dayMonth = text.match(
    /\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\b/i,
  );
  if (dayMonth) {
    return `${todayIso.slice(0, 4)}-${MONTH_NUMBER[fold(dayMonth[2])]}-${dayMonth[1].padStart(2, '0')}`;
  }

  if (/\bmañana\b/i.test(text)) {
    return addIsoDays(todayIso, 1);
  }
  return undefined;
}

function extractHora(text: string): string | undefined {
  const clock = text.match(/\b(\d{1,2})[:.](\d{2})\b/);
  if (clock && Number(clock[1]) <= 23 && Number(clock[2]) < 60) {
    return `${clock[1].padStart(2, '0')}:${clock[2]}`;
  }

  // "a las 1130" o "1130 hrs": pegado, sin separador.
  const compact =
    text.match(/\blas\s+(\d{1,2})(\d{2})\b/i) ??
    text.match(/\b(\d{1,2})(\d{2})\s*(?:hrs?|horas)\b/i);
  if (compact && Number(compact[1]) <= 23 && Number(compact[2]) < 60) {
    return `${compact[1].padStart(2, '0')}:${compact[2]}`;
  }

  const spoken = text.match(
    /\blas\s+(\d{1,2})(?:\s+y\s+(media|treinta))?(?:\s+de\s+la\s+(mañana|tarde|noche))?\b/i,
  );
  if (!spoken) {
    return undefined;
  }
  let hour = Number(spoken[1]);
  const period = spoken[3]?.toLowerCase();
  if ((period === 'tarde' || period === 'noche') && hour < 12) {
    hour += 12;
  }
  return `${String(hour).padStart(2, '0')}:${spoken[2] ? '30' : '00'}`;
}

/**
 * La pregunta de confirmación menciona la hora vigente y la nueva ("tu cita es a
 * las 11:00, ¿la cambio a las 11:30?"), así que hay que tomar la que no es la actual.
 */
function extractHoraObjetivo(text: string, horaActual?: string): string | undefined {
  const horas = [...text.matchAll(/\b(\d{1,2})[:.](\d{2})\b/g)]
    .filter((match) => Number(match[1]) <= 23 && Number(match[2]) < 60)
    .map((match) => `${match[1].padStart(2, '0')}:${match[2]}`);
  return [...horas].reverse().find((hora) => hora !== horaActual) ?? extractHora(text);
}

function addIsoDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const MONTH_NUMBER: Record<string, string> = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12',
};

function shouldForceCancel(userText: string, lastAssistant?: string): boolean {
  if (isCancelIntent(userText)) {
    return true;
  }
  return isAffirmative(userText) && Boolean(lastAssistant && isCancelIntent(lastAssistant));
}

function isCancelIntent(text: string): boolean {
  if (/(no (la |lo )?(cancel|anul)|no quiero (cancel|anul))/i.test(text)) {
    return false;
  }
  return /(cancelar|anula(r|s|e)?|elimina(r)? (la )?cita|borra(r)? (la )?hora)/i.test(text);
}

function isAvailabilityIntent(text: string): boolean {
  if (isCancelIntent(text)) {
    return false;
  }
  if (/(cupos?|disponibilidad|disponibles?)/i.test(text)) {
    return true;
  }
  if (/\bhay\b/i.test(text) && /(hora|\d{1,2}([:.]\d{2})?|ma[ñn]ana|tarde)/i.test(text)) {
    return true;
  }
  return /\bhoras?\b/i.test(text) &&
    /(qu[eé]|cu[aá]l|dime|mu[eé]stra|muestra|ver|tiene|tienes|quedan|libres)/i.test(text);
}

const AFFIRMATIVE_START = /^(si|ok|okey|oka|dale|ya|listo|claro|confirmo|confirma|confirmado|perfecto|sipo|sale|bueno)$/;

const AFFIRMATIVE_FILLER = new Set([
  'si', 'ok', 'okey', 'oka', 'dale', 'ya', 'listo', 'claro', 'confirmo', 'confirma',
  'confirmado', 'perfecto', 'sipo', 'sale', 'bueno', 'de', 'acuerdo', 'por', 'favor',
  'porfavor', 'porfa', 'pf', 'gracias', 'esa', 'eso', 'esta', 'mismo',
]);

/**
 * Un "sí" suelto confirma; "si, muestra la lista" es una petición nueva y no debe
 * disparar los flujos forzados de cambio o agendamiento.
 */
function isAffirmative(text: string): boolean {
  const words = fold(text)
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length || !AFFIRMATIVE_START.test(words[0])) {
    return false;
  }
  return words.every((word) => AFFIRMATIVE_FILLER.has(word));
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
  if (value && typeof value === 'object' && !Array.isArray(value) && 'horas' in value) {
    return value;
  }
  if (!Array.isArray(value)) {
    return value;
  }
  if (value[0] && typeof value[0] === 'object' && value[0] !== null && 'hora_inicio' in value[0]) {
    return value;
  }
  return value.slice(0, 12);
}

function isSameProfesional(nombre: string | undefined, cita: MedilinkCita): boolean {
  if (!nombre) {
    return true;
  }
  const actual = fold(cita.nombre_profesional ?? cita.nombre_dentista ?? '');
  if (!actual) {
    return true;
  }
  return fold(nombre)
    .split(/\s+/)
    .filter((part) => part.length > 2)
    .some((part) => actual.includes(part));
}

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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

function pickUpcomingCita(citas: MedilinkCita[]): MedilinkCita | undefined {
  const now = Date.now();
  const ranked = citas
    .filter((cita) => !isCancelledCita(cita))
    .map((cita) => ({ cita, time: citaTimestamp(cita) }))
    .filter((item) => item.time === undefined || item.time >= now)
    .sort((left, right) => {
      const leftLive = left.cita.estado_anulacion === 1 ? 1 : 0;
      const rightLive = right.cita.estado_anulacion === 1 ? 1 : 0;
      if (leftLive !== rightLive) {
        return leftLive - rightLive;
      }
      const leftUpdated = Date.parse(left.cita.fecha_actualizacion ?? '') || 0;
      const rightUpdated = Date.parse(right.cita.fecha_actualizacion ?? '') || 0;
      if (leftUpdated !== rightUpdated) {
        return rightUpdated - leftUpdated;
      }
      return (right.time ?? 0) - (left.time ?? 0);
    });

  return ranked[0]?.cita;
}

function citaTimestamp(cita: MedilinkCita): number | undefined {
  if (!cita.fecha) {
    return undefined;
  }
  const time = (cita.hora_inicio ?? '00:00').slice(0, 5);
  const iso = cita.fecha.includes('/')
    ? toIsoDate(cita.fecha)
    : cita.fecha;
  const parsed = Date.parse(`${iso}T${time}:00`);
  return Number.isNaN(parsed) ? undefined : parsed;
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
