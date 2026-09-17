import { HttpException, Injectable, Logger } from '@nestjs/common';
import { MedilinkService } from '../medilink/medilink.service.js';
import type { MedilinkCita, MedilinkPaciente } from '../medilink/medilink.types.js';
import {
  AI_TOOL_NAMES,
  AI_TOOLS,
  type AiToolCall,
  type AiToolContext,
  type AiToolName,
} from './ai.tools.js';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly medilinkService: MedilinkService) {}

  listTools() {
    return AI_TOOLS;
  }

  async complete(_prompt: string): Promise<string> {
    // El modelo (OpenAI/Claude) se cablea después. Hoy las tools se prueban con executeTool.
    return '';
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
          celular: asString(args.celular) ?? context.celular,
          rut: asString(args.rut),
          nombre: asString(args.nombre),
        });

      case 'verCitas': {
        const paciente = await this.requirePaciente(args, context);
        return this.medilinkService.listCitasPaciente(paciente.id);
      }

      case 'verCupos':
        return this.verCupos(args);

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
          celular: asString(args.celular) ?? context.celular,
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

      case 'crearPaciente': {
        const nombre = asString(args.nombre);
        const apellidos = asString(args.apellidos);
        if (!nombre || !apellidos) {
          throw new HttpException('crearPaciente requiere nombre y apellidos', 400);
        }
        return this.medilinkService.createPaciente({
          nombre,
          apellidos,
          celular: asString(args.celular) ?? context.celular,
          rut: asString(args.rut),
          email: asString(args.email),
        });
      }

      default:
        throw new HttpException(`Tool no implementada: ${name}`, 501);
    }
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
      const sucursalId =
        idSucursal ?? (await this.medilinkService.listSucursales())[0]?.id;
      if (!sucursalId) {
        throw new HttpException('No hay sucursal para consultar cupos', 422);
      }
      return this.medilinkService.getAgenda({
        fecha,
        id_sucursal: sucursalId,
        id_profesional: idProfesional,
        duracion,
      });
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

    const celular = asString(args.celular) ?? context.celular;
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
    const citas = await this.medilinkService.listCitasPaciente(paciente.id);
    const next = pickUpcomingCita(citas);
    if (!next) {
      throw new HttpException('El paciente no tiene citas para actualizar', 404);
    }
    return next.id;
  }
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

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function pickUpcomingCita(citas: MedilinkCita[]): MedilinkCita | undefined {
  const now = Date.now();
  const upcoming = citas
    .filter((cita) => !fold(cita.estado_cita ?? '').includes('anul'))
    .map((cita) => ({ cita, time: citaTimestamp(cita) }))
    .filter((item) => item.time === undefined || item.time >= now)
    .sort((left, right) => (left.time ?? 0) - (right.time ?? 0));

  return upcoming[0]?.cita ?? citas[0];
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

function toIsoDate(value: string): string {
  const [day, month, year] = value.split('/');
  if (!year) {
    return value;
  }
  return `${year.padStart(4, '20')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
