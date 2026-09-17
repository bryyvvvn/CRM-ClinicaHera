import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import type {
  CreateCitaInput,
  CreatePacienteInput,
  FindPacientesQuery,
  GetAgendaQuery,
  MedilinkAtencion,
  MedilinkCita,
  MedilinkCupo,
  MedilinkEspecialidad,
  MedilinkEstadoCita,
  MedilinkList,
  MedilinkPaciente,
  MedilinkProfesional,
  MedilinkSillon,
  MedilinkSucursal,
  UpdateCitaInput,
} from './medilink.types.js';

const DEFAULT_BASE_URL = 'https://api.medilink2.healthatom.com/api/v5';
const DEFAULT_DURATION = 30;

@Injectable()
export class MedilinkService {
  private readonly logger = new Logger(MedilinkService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findPacientes(query: FindPacientesQuery): Promise<MedilinkPaciente[]> {
    if (query.celular) {
      for (const candidate of phoneCandidates(query.celular)) {
        const byCell = await this.tryList<MedilinkPaciente>('/pacientes', {
          celular: { eq: candidate },
        });
        if (byCell.length) {
          return byCell;
        }

        const byPhone = await this.tryList<MedilinkPaciente>('/pacientes', {
          telefono: { eq: candidate },
        });
        if (byPhone.length) {
          return byPhone;
        }
      }
    }

    if (query.rut) {
      return this.tryList<MedilinkPaciente>('/pacientes', { rut: { eq: query.rut } });
    }

    if (query.nombre) {
      return this.tryList<MedilinkPaciente>('/pacientes', {
        nombre: { like: query.nombre },
      });
    }

    return [];
  }

  getPaciente(id: number): Promise<MedilinkPaciente> {
    return this.getOne<MedilinkPaciente>(`/pacientes/${id}`);
  }

  createPaciente(input: CreatePacienteInput): Promise<MedilinkPaciente> {
    return this.post<MedilinkPaciente>('/pacientes', {
      nombre: input.nombre,
      apellidos: input.apellidos,
      celular: input.celular ?? '',
      telefono: input.telefono ?? input.celular ?? '',
      rut: input.rut ?? '',
      email: input.email ?? '',
      sexo: input.sexo,
      fecha_nacimiento: input.fecha_nacimiento,
    });
  }

  listCitasPaciente(idPaciente: number): Promise<MedilinkCita[]> {
    return this.getList<MedilinkCita>(`/pacientes/${idPaciente}/citas`);
  }

  listCitas(): Promise<MedilinkCita[]> {
    return this.getList<MedilinkCita>('/citas');
  }

  getCita(id: number): Promise<MedilinkCita> {
    return this.getOne<MedilinkCita>(`/citas/${id}`);
  }

  listAtencionesPaciente(idPaciente: number): Promise<MedilinkAtencion[]> {
    return this.getList<MedilinkAtencion>(`/pacientes/${idPaciente}/atenciones`);
  }

  listSucursales(): Promise<MedilinkSucursal[]> {
    return this.getList<MedilinkSucursal>('/sucursales');
  }

  listProfesionales(): Promise<MedilinkProfesional[]> {
    return this.getList<MedilinkProfesional>('/profesionales');
  }

  listEspecialidades(): Promise<MedilinkEspecialidad[]> {
    return this.getList<MedilinkEspecialidad>('/especialidades');
  }

  listSillones(): Promise<MedilinkSillon[]> {
    return this.getList<MedilinkSillon>('/sillones');
  }

  listEstadosCita(): Promise<MedilinkEstadoCita[]> {
    return this.getList<MedilinkEstadoCita>('/citas/estados');
  }

  getProximosCupos(idEspecialidad: number): Promise<MedilinkCupo[]> {
    return this.getList<MedilinkCupo>(`/especialidades/${idEspecialidad}/proxima`);
  }

  getAgenda(query: GetAgendaQuery): Promise<MedilinkCupo[]> {
    return this.getList<MedilinkCupo>('/agendas', {
      fecha: query.fecha,
      duracion: query.duracion ?? DEFAULT_DURATION,
      ...(query.id_sucursal ? { id_sucursal: query.id_sucursal } : {}),
      ...(query.id_profesional ? { id_profesional: query.id_profesional } : {}),
    });
  }

  async createCita(input: CreateCitaInput): Promise<MedilinkCita> {
    const paciente = await this.resolvePaciente(input);
    const sucursalId =
      input.id_sucursal ??
      this.optionalNumber('MEDILINK_DEFAULT_SUCURSAL_ID') ??
      (await this.firstSucursal()).id;
    const profesionalId = await this.resolveProfesionalId(input);
    const sillonId =
      input.id_sillon ??
      this.optionalNumber('MEDILINK_DEFAULT_SILLON_ID') ??
      (await this.firstSillon()).id;
    const estadoId =
      input.id_estado ??
      this.optionalNumber('MEDILINK_ESTADO_NUEVA_CITA') ??
      (await this.findEstadoId('no confirmado', false));
    const atencionId = input.id_atencion ?? (await this.latestOpenAtencionId(paciente.id));
    const duracion = input.duracion ?? DEFAULT_DURATION;

    if (!atencionId) {
      throw new HttpException(
        'El paciente no tiene una atención abierta en MediLink; no se puede crear la cita',
        422,
      );
    }

    const body = {
      id_profesional: profesionalId,
      id_sucursal: sucursalId,
      id_estado: estadoId,
      id_sillon: sillonId,
      id_paciente: paciente.id,
      id_atencion: atencionId,
      fecha: input.fecha,
      hora_inicio: normalizeTime(input.hora_inicio),
      duracion,
      comentario: input.comentario ?? 'Agendada por WhatsApp',
    };

    this.logger.log(
      `MediLink POST /citas paciente=${paciente.id} fecha=${body.fecha} hora=${body.hora_inicio}`,
    );
    return this.post<MedilinkCita>('/citas', body);
  }

  async updateCita(input: UpdateCitaInput): Promise<MedilinkCita> {
    const body: Record<string, number | string> = {};
    if (input.id_estado !== undefined) {
      body.id_estado = input.id_estado;
    }
    if (input.duracion !== undefined) {
      body.duracion = input.duracion;
    }
    if (input.comentario !== undefined) {
      body.comentario = input.comentario;
    }
    if (input.citas_relacionadas !== undefined) {
      body.citas_relacionadas = input.citas_relacionadas;
    }

    this.logger.log(`MediLink PUT /citas/${input.id_cita}`);
    return this.put<MedilinkCita>(`/citas/${input.id_cita}`, body);
  }

  async confirmarCita(idCita: number): Promise<MedilinkCita> {
    const idEstado =
      this.optionalNumber('MEDILINK_ESTADO_CONFIRMADA') ??
      (await this.findEstadoId('confirmado', false));
    return this.updateCita({
      id_cita: idCita,
      id_estado: idEstado,
      comentario: 'Confirmada por WhatsApp',
    });
  }

  async anularCita(idCita: number): Promise<MedilinkCita> {
    const idEstado =
      this.optionalNumber('MEDILINK_ESTADO_ANULADA') ??
      (await this.findEstadoId('anul', true));
    return this.updateCita({
      id_cita: idCita,
      id_estado: idEstado,
      comentario: 'Anulada por WhatsApp',
    });
  }

  private async resolvePaciente(input: CreateCitaInput): Promise<MedilinkPaciente> {
    if (input.id_paciente) {
      return this.getPaciente(input.id_paciente);
    }
    if (!input.celular) {
      throw new HttpException('Falta id_paciente o celular para crear la cita', 400);
    }
    const matches = await this.findPacientes({ celular: input.celular });
    if (!matches.length) {
      throw new HttpException(
        `No hay paciente en MediLink con celular ${input.celular}`,
        404,
      );
    }
    return matches[0];
  }

  private async resolveProfesionalId(input: CreateCitaInput): Promise<number> {
    if (input.id_profesional) {
      return input.id_profesional;
    }

    const profesionales = await this.listProfesionales();
    const enabled = profesionales.filter((item) => item.habilitado !== 0);

    if (input.nombre_profesional) {
      const needle = fold(input.nombre_profesional);
      const match = enabled.find((item) =>
        fold(`${item.nombre ?? ''} ${item.apellidos ?? ''}`).includes(needle),
      );
      if (match) {
        return match.id;
      }
    }

    const fallbackId = this.optionalNumber('MEDILINK_DEFAULT_PROFESIONAL_ID');
    if (fallbackId) {
      return fallbackId;
    }
    if (enabled[0]) {
      return enabled[0].id;
    }
    throw new HttpException('No hay profesionales habilitados en MediLink', 422);
  }

  private async firstSucursal(): Promise<MedilinkSucursal> {
    const sucursales = await this.listSucursales();
    const match = sucursales.find((item) => item.habilitada !== 0) ?? sucursales[0];
    if (!match) {
      throw new HttpException('No hay sucursales en MediLink', 422);
    }
    return match;
  }

  private async firstSillon(): Promise<MedilinkSillon> {
    const sillones = await this.listSillones();
    if (!sillones[0]) {
      throw new HttpException('No hay sillones en MediLink', 422);
    }
    return sillones[0];
  }

  private async latestOpenAtencionId(idPaciente: number): Promise<number | undefined> {
    const atenciones = await this.listAtencionesPaciente(idPaciente);
    const open = atenciones.find((item) => item.finalizado !== 1 && item.bloqueado !== 1);
    return open?.id ?? atenciones[0]?.id;
  }

  private async findEstadoId(needle: string, preferAnulacion: boolean): Promise<number> {
    const estados = await this.listEstadosCita();
    const folded = fold(needle);
    const match = preferAnulacion
      ? estados.find((item) => item.anulacion === 1) ??
        estados.find((item) => fold(item.nombre ?? '').includes(folded))
      : estados.find(
          (item) => item.anulacion !== 1 && fold(item.nombre ?? '').includes(folded),
        );
    if (!match) {
      throw new HttpException(`No se encontró un estado de cita para "${needle}"`, 422);
    }
    return match.id;
  }

  private optionalNumber(key: string): number | undefined {
    const raw = this.configService.get<string>(key);
    if (!raw) {
      return undefined;
    }
    const value = Number(raw);
    return Number.isFinite(value) ? value : undefined;
  }

  private getList<T>(path: string, filter?: Record<string, unknown>): Promise<T[]> {
    return this.request<T[]>('GET', path, { filter, expectList: true });
  }

  private async tryList<T>(path: string, filter?: Record<string, unknown>): Promise<T[]> {
    try {
      return await this.getList<T>(path, filter);
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'error';
      this.logger.warn(`MediLink GET ${path} filter ignored: ${detail}`);
      return [];
    }
  }

  private getOne<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  private post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    return this.request<T>('POST', path, { body });
  }

  private put<T>(path: string, body: Record<string, unknown>): Promise<T> {
    return this.request<T>('PUT', path, { body });
  }

  private credentials() {
    const token = this.configService.get<string>('MEDILINK_TOKEN')?.trim();
    const baseUrl = (
      this.configService.get<string>('MEDILINK_BASE_URL') ?? DEFAULT_BASE_URL
    ).replace(/\/$/, '');

    if (!token) {
      throw new HttpException('Falta MEDILINK_TOKEN en el .env', 500);
    }

    return { token, baseUrl };
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT',
    path: string,
    options?: {
      filter?: Record<string, unknown>;
      body?: Record<string, unknown>;
      expectList?: boolean;
    },
  ): Promise<T> {
    const { token, baseUrl } = this.credentials();
    const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    try {
      const response = await firstValueFrom(
        this.httpService.request<MedilinkList<T>>({
          method,
          url,
          headers: {
            Authorization: `Token ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          params: options?.filter ? { q: JSON.stringify(options.filter) } : undefined,
          data: options?.body,
        }),
      );

      this.logger.log(`MediLink ${method} ${path} ${response.status}`);
      return unwrap(response.data, options?.expectList) as T;
    } catch (error) {
      throw this.toHttpException(method, path, error);
    }
  }

  private toHttpException(method: string, path: string, error: unknown): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    const axiosError = error as AxiosError<MedilinkList<unknown>>;
    const status = axiosError.response?.status ?? 502;
    const payload = axiosError.response?.data;
    const detail =
      (typeof payload?.error === 'string' ? payload.error : payload?.error?.message) ??
      axiosError.message;

    this.logger.error(`MediLink ${method} ${path} failed: ${detail}`);
    return new HttpException(`MediLink ${method} ${path}: ${detail}`, status);
  }
}

function unwrap<T>(payload: MedilinkList<T> | T, expectList?: boolean): T | T[] {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const inner = (payload as MedilinkList<T>).data;
    if (expectList) {
      return Array.isArray(inner) ? inner : inner ? [inner] : [];
    }
    return inner as T;
  }
  if (expectList) {
    return Array.isArray(payload) ? payload : [];
  }
  return payload as T;
}

function phoneCandidates(raw: string): string[] {
  const digits = raw.replace(/\D/g, '');
  const values = new Set<string>([raw.trim(), digits]);

  if (digits.startsWith('56') && digits.length >= 11) {
    values.add(digits.slice(2));
    values.add(digits.slice(-9));
    values.add(digits.slice(-8));
  }
  if (digits.length === 9 && digits.startsWith('9')) {
    values.add(`56${digits}`);
  }
  if (digits.length === 8) {
    values.add(`9${digits}`);
    values.add(`569${digits}`);
  }

  return [...values].filter(Boolean);
}

function normalizeTime(value: string): string {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return value;
  }
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
