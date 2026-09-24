export type AiToolName =
  | 'buscarPaciente'
  | 'verCitas'
  | 'verCupos'
  | 'crearCita'
  | 'confirmarCita'
  | 'anularCita'
  | 'cambiarCita'
  | 'crearPaciente';

export type AiToolDefinition = {
  type: 'function';
  function: {
    name: AiToolName;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
};

export const AI_TOOLS: AiToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'buscarPaciente',
      description:
        'Busca un paciente en MediLink por celular, RUT o nombre. El celular de WhatsApp ya viene en el contexto si no se pasa.',
      parameters: {
        type: 'object',
        properties: {
          celular: { type: 'string', description: 'Teléfono, con o sin código de país' },
          rut: { type: 'string', description: 'RUT chileno si el paciente lo dictó' },
          nombre: { type: 'string', description: 'Nombre o apellido para búsqueda parcial' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'verCitas',
      description: 'Lista las citas del paciente identificado (por celular de WhatsApp o id_paciente).',
      parameters: {
        type: 'object',
        properties: {
          id_paciente: { type: 'number' },
          celular: { type: 'string' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'verCupos',
      description:
        'Consulta horas disponibles. Si hay fecha usa la agenda de ese día; si no, las próximas de una especialidad.',
      parameters: {
        type: 'object',
        properties: {
          fecha: { type: 'string', description: 'YYYY-MM-DD' },
          id_sucursal: { type: 'number' },
          id_profesional: { type: 'number' },
          nombre_profesional: { type: 'string' },
          id_especialidad: { type: 'number' },
          duracion: { type: 'number', description: 'Minutos; por defecto 30' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'crearCita',
      description:
        'Crea una cita en MediLink. Usar solo cuando el paciente confirmó día y hora. El backend completa IDs (paciente, sillón, atención, estado).',
      parameters: {
        type: 'object',
        properties: {
          fecha: { type: 'string', description: 'YYYY-MM-DD' },
          hora_inicio: { type: 'string', description: 'HH:mm' },
          duracion: { type: 'number' },
          comentario: { type: 'string' },
          id_profesional: { type: 'number' },
          nombre_profesional: { type: 'string' },
          id_sucursal: { type: 'number' },
          id_paciente: { type: 'number' },
          celular: { type: 'string' },
        },
        required: ['fecha', 'hora_inicio'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'confirmarCita',
      description: 'Confirma una cita existente. Si no hay id_cita, usa la próxima del paciente.',
      parameters: {
        type: 'object',
        properties: {
          id_cita: { type: 'number' },
          id_paciente: { type: 'number' },
          celular: { type: 'string' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'anularCita',
      description:
        'Anula una cita en MediLink. Obligatorio cuando el paciente confirma que quiere cancelar. No digas que quedó anulada sin llamar esta tool. Si no hay id_cita, usa la próxima del paciente.',
      parameters: {
        type: 'object',
        properties: {
          id_cita: { type: 'number' },
          id_paciente: { type: 'number' },
          celular: { type: 'string' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cambiarCita',
      description:
        'Reprograma una cita existente (hora, fecha o profesional) sin anularla. Usar cuando el paciente quiere cambiar la hora o el profesional. Si no hay id_cita, usa la próxima del paciente.',
      parameters: {
        type: 'object',
        properties: {
          id_cita: { type: 'number' },
          fecha: { type: 'string', description: 'YYYY-MM-DD' },
          hora_inicio: { type: 'string', description: 'HH:mm' },
          id_profesional: { type: 'number' },
          nombre_profesional: { type: 'string' },
          id_paciente: { type: 'number' },
          celular: { type: 'string' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'crearPaciente',
      description: 'Crea el paciente en MediLink si no existe. Mínimo nombre y apellidos.',
      parameters: {
        type: 'object',
        properties: {
          nombre: { type: 'string' },
          apellidos: { type: 'string' },
          celular: { type: 'string' },
          rut: { type: 'string' },
          email: { type: 'string' },
        },
        required: ['nombre', 'apellidos'],
      },
    },
  },
];

export const AI_TOOL_NAMES = AI_TOOLS.map((tool) => tool.function.name);

export type AiToolContext = {
  celular?: string;
};

export type AiToolCall = {
  name: string;
  arguments?: Record<string, unknown>;
};
