import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import type {
  ChangeCitaInput,
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
const DENTALINK_WRITE_URL = 'https://api.dentalink.healthatom.com/api/v1';
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
      direccion: input.direccion ?? '',
      comuna: input.comuna ?? '',
      ciudad: input.ciudad ?? '',
      observaciones: input.observaciones ?? '',
    });
  }

  listCitasPaciente(idPaciente: number): Promise<MedilinkCita[]> {
    return this.getList<MedilinkCita>(
      `/pacientes/${idPaciente}/citas`,
      undefined,
      this.writeBaseUrl(),
    );
  }

  listCitas(): Promise<MedilinkCita[]> {
    return this.getList<MedilinkCita>('/citas');
  }

  getCita(id: number): Promise<MedilinkCita> {
    return this.getOne<MedilinkCita>(`/citas/${id}`);
  }

  private getCitaWrite(id: number): Promise<MedilinkCita> {
    return this.request<MedilinkCita>('GET', `/citas/${id}`, { baseUrl: this.writeBaseUrl() });
  }

  listAtencionesPaciente(idPaciente: number): Promise<MedilinkAtencion[]> {
    return this.getList<MedilinkAtencion>(`/pacientes/${idPaciente}/atenciones`);
  }

  listTratamientosPaciente(idPaciente: number): Promise<MedilinkAtencion[]> {
    return this.tryList<MedilinkAtencion>(`/pacientes/${idPaciente}/tratamientos`);
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
    return this.getList<MedilinkEstadoCita>('/citas/estados', undefined, this.writeBaseUrl());
  }

  getProximosCupos(idEspecialidad: number): Promise<MedilinkCupo[]> {
    return this.getList<MedilinkCupo>(
      `/especialidades/${idEspecialidad}/proxima`,
      undefined,
      this.writeBaseUrl(),
    ).then(normalizeCupos);
  }

  async getAgenda(query: GetAgendaQuery): Promise<MedilinkCupo[]> {
    const profesionalId =
      query.id_profesional ??
      this.optionalNumber('MEDILINK_DEFAULT_PROFESIONAL_ID') ??
      (await this.resolveProfesionalId({}));
    const { baseUrl } = this.credentials();
    const hosts = [...new Set([this.writeBaseUrl(), baseUrl])];
    const sucursales = query.id_sucursal
      ? [query.id_sucursal]
      : [
          await this.resolveProfesionalSucursal(profesionalId),
          this.optionalNumber('MEDILINK_DEFAULT_SUCURSAL_ID'),
          (await this.firstSucursal()).id,
        ].filter((id, index, all): id is number => id !== undefined && all.indexOf(id) === index);

    const collected: MedilinkCupo[] = [];
    for (const sucursalId of sucursales) {
      for (const host of hosts) {
        try {
          const slots = normalizeCupos(
            await this.getList<Record<string, unknown>>(
              '/agendas',
              {
                id_sucursal: { eq: sucursalId },
                fecha: { eq: query.fecha },
                id_dentista: { eq: profesionalId },
                id_profesional: { eq: profesionalId },
              },
              host,
            ),
          ).filter((slot) => !slot.id_profesional || slot.id_profesional === profesionalId);
          collected.push(...slots);
        } catch (error) {
          this.logger.warn(
            `GET /agendas sucursal=${sucursalId} falló (${error instanceof Error ? error.message : 'error'})`,
          );
        }

        try {
          const grid = await this.request<unknown>(
            'GET',
            `/sucursales/${sucursalId}/dentistas/${profesionalId}/agendas`,
            {
              filter: {
                fecha_inicio: { eq: query.fecha },
                fecha_fin: { eq: query.fecha },
                mostrar_detalles: { eq: 0 },
              },
              baseUrl: host,
            },
          );
          collected.push(...flattenDentistAgenda(grid, query.fecha, profesionalId));
        } catch (error) {
          this.logger.warn(
            `GET agenda dentista=${profesionalId} sucursal=${sucursalId} falló (${
              error instanceof Error ? error.message : 'error'
            })`,
          );
        }
      }
    }

    const ocupadas = await this.horasOcupadas(query.fecha, profesionalId, hosts);
    const dia = isoDia(query.fecha);
    return uniqueCupos(collected).filter(
      (slot) => isoDia(slot.fecha) === dia && !ocupadas.has(slot.hora_inicio ?? ''),
    );
  }

  /**
   * La unión de agendas de los dos hosts puede traer horas que ya tienen cita,
   * así que las citas del día son la fuente final de verdad.
   */
  private async horasOcupadas(
    fecha: string,
    profesionalId: number,
    hosts: string[],
  ): Promise<Set<string>> {
    const ocupadas = new Set<string>();
    for (const host of hosts) {
      for (const campo of ['id_profesional', 'id_dentista']) {
        try {
          const citas = await this.getList<MedilinkCita>(
            '/citas',
            { fecha: { eq: fecha }, [campo]: { eq: profesionalId } },
            host,
          );
          for (const cita of citas) {
            const citaProfesional = cita.id_profesional ?? cita.id_dentista;
            const mismoDia = !cita.fecha || cita.fecha === fecha;
            if (!mismoDia || (citaProfesional && citaProfesional !== profesionalId)) {
              continue;
            }
            if (isCitaAnulada(cita)) {
              continue;
            }
            for (const hora of citaHoras(cita)) {
              ocupadas.add(hora);
            }
          }
          break;
        } catch (error) {
          this.logger.warn(
            `GET /citas fecha=${fecha} ${campo}=${profesionalId} falló (${
              error instanceof Error ? error.message : 'error'
            })`,
          );
        }
      }
    }

    if (ocupadas.size) {
      this.logger.log(
        `Agenda ${fecha} profesional=${profesionalId} horas ocupadas: ${[...ocupadas]
          .sort()
          .join(', ')}`,
      );
    }
    return ocupadas;
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
    const tratamientoId = await this.resolveTratamientoId(
      input,
      paciente.id,
      sucursalId,
      profesionalId,
    );
    const hora = normalizeTime(input.hora_inicio);
    const cupos = await this.getAgenda({
      fecha: input.fecha,
      id_sucursal: sucursalId,
      id_profesional: profesionalId,
    });
    const cupo = cupos.find((slot) => (slot.hora_inicio ?? '').slice(0, 5) === hora.slice(0, 5));
    if (!cupo) {
      throw new HttpException(
        `No hay cupo el ${input.fecha} a las ${hora} con ese profesional. Llama verCupos para esa fecha y ofrece solo las horas que devuelva. Si no hay ninguna, dilo y ofrece el día más cercano.`,
        409,
      );
    }
    const duracion = cupo.duracion ?? input.duracion ?? DEFAULT_DURATION;
    const body: Record<string, number | string> = {
      id_profesional: profesionalId,
      id_dentista: profesionalId,
      id_sucursal: sucursalId,
      id_estado: estadoId,
      id_sillon: sillonId,
      id_paciente: paciente.id,
      fecha: input.fecha,
      hora_inicio: hora,
      duracion,
      comentario: input.comentario ?? 'Agendada por WhatsApp',
    };
    if (tratamientoId !== undefined) {
      body.id_atencion = tratamientoId;
      body.id_tratamiento = tratamientoId;
    }

    this.logger.log(
      `MediLink POST /citas paciente=${paciente.id} fecha=${body.fecha} hora=${body.hora_inicio}`,
    );

    try {
      return await this.postCitaHosts(body);
    } catch (error) {
      if (!input.nueva_atencion && !input.id_atencion && this.isAtencionOcupadaError(error)) {
        this.logger.warn('POST /citas: la atención ya tiene cita; creo un tratamiento nuevo');
        return this.createCita({ ...input, nueva_atencion: true });
      }
      throw error;
    }
  }

  private async postCitaHosts(body: Record<string, number | string>): Promise<MedilinkCita> {
    try {
      return await this.post<MedilinkCita>('/citas/', body);
    } catch (error) {
      if (!this.isDentalBranchError(error)) {
        throw error;
      }
      this.logger.warn('POST /citas rechazado en MediLink v5; reintento Dentalink v1');
      return this.post<MedilinkCita>('/citas/', body, this.writeBaseUrl());
    }
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
      body.comentarios = input.comentario;
    }
    if (input.citas_relacionadas !== undefined) {
      body.citas_relacionadas = input.citas_relacionadas;
    }

    this.logger.log(`MediLink PUT /citas/${input.id_cita}`);
    return this.put<MedilinkCita>(`/citas/${input.id_cita}`, body, this.writeBaseUrl());
  }

  async changeCita(input: ChangeCitaInput): Promise<MedilinkCita> {
    const current = await this.getCitaWrite(input.id_cita);
    let profesionalId = input.id_profesional;
    if (!profesionalId && input.nombre_profesional) {
      profesionalId = await this.resolveProfesionalId({
        nombre_profesional: input.nombre_profesional,
      });
    }
    profesionalId = profesionalId ?? current.id_profesional ?? current.id_dentista;
    if (!profesionalId) {
      throw new HttpException('Falta el profesional para cambiar la cita', 400);
    }

    const fecha = input.fecha ?? current.fecha;
    const hora = normalizeTime(input.hora_inicio ?? current.hora_inicio ?? '');
    if (!fecha || !hora) {
      throw new HttpException('cambiarCita requiere fecha y hora_inicio', 400);
    }

    const base = {
      id_sesion: current.id,
      id_dentista: profesionalId,
      fecha,
      hora_inicio: hora,
      duracion: input.duracion ?? current.duracion ?? DEFAULT_DURATION,
      buscar_especialidad: 0,
      return_options: 0,
    };

    const currentProfesional = current.id_profesional ?? current.id_dentista;
    if (currentProfesional && profesionalId !== currentProfesional) {
      return this.replaceCita(current, {
        fecha,
        hora_inicio: hora,
        id_profesional: profesionalId,
        id_sillon: input.id_sillon ?? current.id_sillon,
      });
    }

    try {
      this.logger.log(
        `MediLink POST /citas/changeDate cita=${current.id} fecha=${fecha} hora=${hora} dentista=${profesionalId} sillon=${input.id_sillon ?? current.id_sillon ?? 1}`,
      );
      return await this.post<MedilinkCita>(
        '/citas/changeDate',
        {
          ...base,
          id_sillon: input.id_sillon ?? current.id_sillon ?? 1,
        },
        this.writeBaseUrl(),
      );
    } catch (error) {
      if (!this.isSillonChangeError(error)) {
        throw error;
      }
      this.logger.warn(`changeDate sin sillón; reemplazo cita=${current.id} por una nueva`);
      return this.replaceCita(current, {
        fecha,
        hora_inicio: hora,
        id_profesional: profesionalId,
        id_sillon: input.id_sillon ?? current.id_sillon,
      });
    }
  }

  private async replaceCita(
    current: MedilinkCita,
    input: {
      fecha: string;
      hora_inicio: string;
      id_profesional: number;
      id_sillon?: number;
    },
  ): Promise<MedilinkCita> {
    const homeSucursal = await this.resolveProfesionalSucursal(
      input.id_profesional,
      current.id_sucursal,
    );
    const sucursales = [...new Set([current.id_sucursal, homeSucursal].filter(
      (id): id is number => typeof id === 'number',
    ))];

    let created: MedilinkCita | undefined;
    let lastError: unknown;
    for (const idSucursal of sucursales) {
      try {
        this.logger.log(
          `MediLink reemplazo cita=${current.id} → profesional=${input.id_profesional} sucursal=${idSucursal}`,
        );
        created = await this.createCita({
          fecha: input.fecha,
          hora_inicio: input.hora_inicio,
          id_paciente: current.id_paciente,
          id_profesional: input.id_profesional,
          id_sucursal: idSucursal,
          id_sillon: input.id_sillon,
          comentario: 'Cambio de hora por WhatsApp',
          nueva_atencion: true,
        });
        break;
      } catch (error) {
        lastError = error;
        this.logger.warn(
          `No pude crear la hora nueva en sucursal=${idSucursal}: ${
            error instanceof Error ? error.message : 'error'
          }`,
        );
      }
    }

    if (!created) {
      throw lastError instanceof HttpException
        ? lastError
        : new HttpException('No se pudo cambiar la hora en el sistema', 409);
    }

    try {
      await this.anularCita(current.id);
    } catch (error) {
      this.logger.warn(
        `Hora nueva ${created.id} lista, pero no pude liberar ${current.id}: ${
          error instanceof Error ? error.message : 'error'
        }`,
      );
    }
    return created;
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
    const configured = this.optionalNumber('MEDILINK_ESTADO_ANULADA');
    const estadoIds = configured
      ? [configured]
      : await this.findAnulacionEstadoIds();
    if (!estadoIds.length) {
      throw new HttpException(
        'No hay un estado de anulación usable por API. Crea uno personalizado en Dentalink (Anulación=Sí, no reservado).',
        422,
      );
    }

    let lastError: unknown;
    for (const idEstado of estadoIds) {
      try {
        this.logger.log(`MediLink anular cita=${idCita} estado=${idEstado}`);
        return await this.updateCita({
          id_cita: idCita,
          id_estado: idEstado,
          comentario: 'Anulada por WhatsApp',
        });
      } catch (error) {
        if (!this.isReservedEstadoError(error)) {
          throw error;
        }
        lastError = error;
        this.logger.warn(`Estado ${idEstado} reservado; pruebo otro`);
      }
    }

    throw lastError instanceof HttpException
      ? lastError
      : new HttpException(
          'No se pudo anular: Dentalink rechazó los estados de anulación.',
          422,
        );
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

  private async resolveProfesionalId(
    input: Pick<CreateCitaInput, 'id_profesional' | 'nombre_profesional'>,
  ): Promise<number> {
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

  private async resolveProfesionalSucursal(
    profesionalId: number,
    currentSucursal?: number,
  ): Promise<number> {
    try {
      const horarios = await this.getList<Record<string, unknown>>(
        `/dentistas/${profesionalId}/horarios`,
        undefined,
        this.writeBaseUrl(),
      );
      const sucursalIds = horarios
        .map((row) => asOptionalNumber(row.id_sucursal))
        .filter((id): id is number => id !== undefined);
      if (currentSucursal && sucursalIds.includes(currentSucursal)) {
        return currentSucursal;
      }
      if (sucursalIds[0]) {
        return sucursalIds[0];
      }
    } catch (error) {
      this.logger.warn(
        `No pude leer horarios del profesional ${profesionalId}: ${
          error instanceof Error ? error.message : 'error'
        }`,
      );
    }

    const sucursales = await this.listSucursales();
    const other = sucursales.find((item) => item.id !== currentSucursal && item.habilitada !== 0);
    return other?.id ?? currentSucursal ?? (await this.firstSucursal()).id;
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
    const named = sillones.find((item) => /sill[oó]n\s*1$/i.test(item.nombre ?? ''));
    const lowest = [...sillones].sort((left, right) => left.id - right.id)[0];
    const match = named ?? (lowest && lowest.id < 100 ? lowest : undefined) ?? {
      id: 1,
      nombre: 'Sillon 1',
    };
    if (!match) {
      throw new HttpException('No hay sillones en MediLink', 422);
    }
    return match;
  }

  private async latestOpenAtencionId(idPaciente: number): Promise<number | undefined> {
    const atenciones = await this.listAtencionesPaciente(idPaciente);
    const tratamientos = await this.listTratamientosPaciente(idPaciente);
    const pool = [...atenciones, ...tratamientos];
    const open = pool.find((item) => item.finalizado !== 1 && item.bloqueado !== 1);
    return open?.id ?? pool[0]?.id;
  }

  private async resolveTratamientoId(
    input: CreateCitaInput,
    idPaciente: number,
    idSucursal: number,
    idProfesional: number,
  ): Promise<number | undefined> {
    if (input.id_atencion !== undefined) {
      return input.id_atencion;
    }
    if (!input.nueva_atencion) {
      const abierta = await this.latestOpenAtencionId(idPaciente);
      if (abierta !== undefined) {
        return abierta;
      }
    }
    try {
      return await this.createTratamiento(idPaciente, idSucursal, idProfesional);
    } catch (error) {
      if (!this.isIncompatibleBranchError(error)) {
        throw error;
      }
      this.logger.warn(
        'La sucursal médica no abre el plan por Dentalink. La cita se crea igual en MediLink.',
      );
      return undefined;
    }
  }

  private async createTratamiento(
    idPaciente: number,
    idSucursal: number,
    idProfesional: number,
  ): Promise<number> {
    const created = await this.post<MedilinkAtencion>(
      '/tratamientos/',
      {
        id_sucursal: idSucursal,
        id_paciente: idPaciente,
        id_dentista: idProfesional,
        id_profesional: idProfesional,
        nombre: 'Consulta WhatsApp',
      },
      this.writeBaseUrl(),
    );
    if (!created?.id) {
      throw new HttpException('No se pudo crear el tratamiento para la cita', 422);
    }
    return created.id;
  }

  private writeBaseUrl(): string {
    const configured = this.configService.get<string>('MEDILINK_WRITE_BASE_URL')?.trim();
    if (configured) {
      return configured.replace(/\/$/, '');
    }
    const { baseUrl } = this.credentials();
    if (baseUrl.includes('medilink2')) {
      return DENTALINK_WRITE_URL;
    }
    return baseUrl;
  }

  private isDentalBranchError(error: unknown): boolean {
    return this.isIncompatibleBranchError(error);
  }

  private isIncompatibleBranchError(error: unknown): boolean {
    if (error instanceof HttpException && error.getStatus() === 412) {
      return true;
    }
    const message = error instanceof Error ? error.message : String(error);
    return /sucursal (m[eé]dica|dental)|no es compatible|412/i.test(message);
  }

  private async findEstadoId(needle: string, preferAnulacion: boolean): Promise<number> {
    const ids = preferAnulacion
      ? await this.findAnulacionEstadoIds()
      : (await this.writableEstados())
          .filter((item) => item.anulacion !== 1 && fold(item.nombre ?? '').includes(fold(needle)))
          .map((item) => item.id);
    if (!ids[0]) {
      throw new HttpException(`No se encontró un estado de cita para "${needle}"`, 422);
    }
    return ids[0];
  }

  private async findAnulacionEstadoIds(): Promise<number[]> {
    const writable = await this.writableEstados();
    const cancel = writable.filter(
      (item) => item.anulacion === 1 || fold(item.nombre ?? '').includes('anul'),
    );
    const ranked = [...cancel].sort((left, right) => {
      const leftName = fold(left.nombre ?? '');
      const rightName = fold(right.nombre ?? '');
      return scoreAnulacionNombre(leftName) - scoreAnulacionNombre(rightName);
    });
    return ranked.map((item) => item.id);
  }

  private async writableEstados(): Promise<MedilinkEstadoCita[]> {
    const estados = await this.listEstadosCita();
    const writable = estados.filter(
      (item) =>
        item.habilitado !== 0 && item.reservado !== 1 && item.uso_interno !== 1,
    );
    return writable.length ? writable : estados.filter((item) => item.habilitado !== 0);
  }

  private isReservedEstadoError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return /reservado|uso interno/i.test(message);
  }

  private isSillonChangeError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return /sillon/i.test(message);
  }

  private isAtencionOcupadaError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return /atenci[oó]n ya cuenta con una cita/i.test(message);
  }

  private optionalNumber(key: string): number | undefined {
    const raw = this.configService.get<string>(key);
    if (!raw) {
      return undefined;
    }
    const value = Number(raw);
    return Number.isFinite(value) ? value : undefined;
  }

  private getList<T>(
    path: string,
    filter?: Record<string, unknown>,
    baseUrl?: string,
  ): Promise<T[]> {
    return this.request<T[]>('GET', path, { filter, expectList: true, baseUrl });
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

  private post<T>(
    path: string,
    body: Record<string, unknown>,
    baseUrl?: string,
  ): Promise<T> {
    return this.request<T>('POST', path, { body, baseUrl });
  }

  private put<T>(
    path: string,
    body: Record<string, unknown>,
    baseUrl?: string,
  ): Promise<T> {
    return this.request<T>('PUT', path, { body, baseUrl });
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
      baseUrl?: string;
    },
  ): Promise<T> {
    const { token, baseUrl } = this.credentials();
    const host = (options?.baseUrl ?? baseUrl).replace(/\/$/, '');
    const url = `${host}${path.startsWith('/') ? path : `/${path}`}`;

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

function normalizeCupos(items: Array<Record<string, unknown> | MedilinkCupo>): MedilinkCupo[] {
  return items
    .map((item) => {
      const row = item as Record<string, unknown>;
      return {
        id_paciente: asOptionalNumber(row.id_paciente),
        hora_inicio: asOptionalString(row.hora_inicio),
        hora_fin: asOptionalString(row.hora_fin),
        duracion: asOptionalNumber(row.duracion),
        id_profesional:
          asOptionalNumber(row.id_profesional) ?? asOptionalNumber(row.id_dentista),
        nombre_profesional:
          asOptionalString(row.nombre_profesional) ?? asOptionalString(row.nombre_dentista),
        fecha: asOptionalString(row.fecha),
        id_recurso: asOptionalNumber(row.id_recurso),
      };
    })
    .filter((item) => !item.id_paciente);
}

function isCitaAnulada(cita: MedilinkCita): boolean {
  const estado = (cita.estado_cita ?? '').toLowerCase();
  if (estado.includes('anul')) {
    return true;
  }
  return cita.estado_anulacion === 1 && !estado.includes('cambio');
}

/** Una cita de 60 minutos bloquea 11:00 y 11:30, no solo su hora de inicio. */
function citaHoras(cita: MedilinkCita): string[] {
  const inicio = toMinutes(cita.hora_inicio);
  if (inicio === undefined) {
    return [];
  }
  const fin = toMinutes(cita.hora_fin) ?? inicio + (cita.duracion ?? DEFAULT_DURATION);
  const horas: string[] = [];
  for (let minute = inicio; minute < Math.max(fin, inicio + 1); minute += 30) {
    horas.push(fromMinutes(minute));
  }
  return horas;
}

function toMinutes(value?: string): number | undefined {
  const match = /^(\d{1,2}):(\d{2})/.exec(value ?? '');
  return match ? Number(match[1]) * 60 + Number(match[2]) : undefined;
}

function fromMinutes(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function uniqueCupos(items: MedilinkCupo[]): MedilinkCupo[] {
  const seen = new Set<string>();
  const unique: MedilinkCupo[] = [];
  for (const item of items) {
    const hora = (item.hora_inicio ?? '').slice(0, 5);
    if (!hora) {
      continue;
    }
    const key = `${item.fecha ?? ''}|${hora}|${item.id_profesional ?? ''}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push({ ...item, hora_inicio: hora });
  }
  return unique.sort((left, right) =>
    (left.hora_inicio ?? '').localeCompare(right.hora_inicio ?? ''),
  );
}

function isoDia(value: string | undefined): string {
  const text = value?.trim() ?? '';
  const dmy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(text);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  return iso ? `${iso[1]}-${iso[2]}-${iso[3]}` : '';
}

function flattenDentistAgenda(
  payload: unknown,
  fecha: string,
  idProfesional: number,
): MedilinkCupo[] {
  const root =
    payload && typeof payload === 'object' && 'data' in payload
      ? (payload as { data?: unknown }).data
      : payload;
  const fechas =
    root && typeof root === 'object' && 'fechas' in root
      ? (root as { fechas?: Record<string, { horas?: Record<string, { sillones?: Record<string, unknown> }> }> })
          .fechas
      : undefined;
  if (!fechas) {
    return [];
  }

  const slots: MedilinkCupo[] = [];
  for (const [day, dayValue] of Object.entries(fechas)) {
    if (isoDia(day) !== isoDia(fecha)) {
      continue;
    }
    const libres = Object.entries(dayValue.horas ?? {})
      .filter(([, slot]) =>
        Object.entries(slot.sillones ?? {}).some(
          ([key, value]) => key !== 'Sobrecupo' && value === true,
        ),
      )
      .map(([hora]) => hora)
      .sort();
    libres.forEach((hora, index) => {
      const siguiente = toMinutes(libres[index + 1]);
      const anterior = toMinutes(libres[index - 1]);
      const actual = toMinutes(hora);
      const gap =
        actual !== undefined && siguiente !== undefined
          ? siguiente - actual
          : actual !== undefined && anterior !== undefined
            ? actual - anterior
            : DEFAULT_DURATION;
      slots.push({
        fecha: isoDia(day),
        hora_inicio: hora,
        duracion: gap > 0 ? gap : DEFAULT_DURATION,
        id_profesional: idProfesional,
      });
    });
  }
  return slots;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
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

function scoreAnulacionNombre(nombre: string): number {
  if (/whatsapp|email|correo|paciente|pte/.test(nombre)) {
    return 0;
  }
  if (nombre === 'anulado') {
    return 1;
  }
  return 2;
}
