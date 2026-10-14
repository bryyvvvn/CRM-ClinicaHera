export type MedilinkList<T> = {
  data?: T[] | T;
  error?: { message?: string } | string;
};

export type MedilinkPaciente = {
  id: number;
  rut?: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  celular?: string;
  email?: string;
  habilitado?: number;
};

export type MedilinkCita = {
  id: number;
  id_paciente?: number;
  nombre_paciente?: string;
  id_estado?: number;
  estado_cita?: string;
  id_atencion?: number;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  duracion?: number;
  id_profesional?: number;
  id_dentista?: number;
  nombre_profesional?: string;
  nombre_dentista?: string;
  id_sucursal?: number;
  nombre_sucursal?: string;
  id_sillon?: number;
  comentarios?: string;
  fecha_actualizacion?: string;
  estado_anulacion?: number;
};

export type MedilinkAtencion = {
  id: number;
  nombre?: string;
  tipo_atencion?: string;
  finalizado?: number;
  bloqueado?: number;
  id_paciente?: number;
  id_profesional?: number;
  id_sucursal?: number;
};

export type MedilinkSucursal = {
  id: number;
  nombre?: string;
  habilitada?: number;
};

export type MedilinkProfesional = {
  id: number;
  nombre?: string;
  apellidos?: string;
  id_especialidad?: number;
  especialidad?: string;
  habilitado?: number;
  intervalo?: number;
};

export type MedilinkEspecialidad = {
  id: number;
  nombre?: string;
  habilitado?: number;
  habilitada?: number;
};

export type MedilinkSillon = {
  id: number;
  nombre?: string;
};

export type MedilinkEstadoCita = {
  id: number;
  nombre?: string;
  reservado?: number;
  anulacion?: number;
  uso_interno?: number;
  habilitado?: number;
};

export type MedilinkCupo = {
  id_paciente?: number;
  hora_inicio?: string;
  hora_fin?: string;
  duracion?: number;
  id_profesional?: number;
  nombre_profesional?: string;
  fecha?: string;
  id_recurso?: number;
};

export type FindPacientesQuery = {
  celular?: string;
  rut?: string;
  nombre?: string;
};

export type CreatePacienteInput = {
  nombre: string;
  apellidos: string;
  celular?: string;
  telefono?: string;
  rut?: string;
  email?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  observaciones?: string;
};

export type GetAgendaQuery = {
  fecha: string;
  id_sucursal?: number;
  id_profesional?: number;
  duracion?: number;
};

export type CreateCitaInput = {
  fecha: string;
  hora_inicio: string;
  celular?: string;
  id_paciente?: number;
  id_profesional?: number;
  nombre_profesional?: string;
  id_sucursal?: number;
  id_sillon?: number;
  id_atencion?: number;
  id_estado?: number;
  duracion?: number;
  comentario?: string;
  nueva_atencion?: boolean;
};

export type UpdateCitaInput = {
  id_cita: number;
  id_estado?: number;
  duracion?: number;
  comentario?: string;
  citas_relacionadas?: number;
};

export type ChangeCitaInput = {
  id_cita: number;
  fecha?: string;
  hora_inicio?: string;
  duracion?: number;
  id_profesional?: number;
  nombre_profesional?: string;
  id_sillon?: number;
};
