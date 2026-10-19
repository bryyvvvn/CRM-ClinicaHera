/**
 * v2 (oct 2026): se quitó buscarPaciente (permitía a la IA buscar fichas ajenas por RUT o nombre)
 * y se quitaron id_paciente/celular de los parámetros: el backend siempre usa el celular de la
 * conversación. Las descripciones quedan alineadas con ai.prompt.ts y ai.service.ts.
 */
export type AiToolName =
  | 'verCitas'
  | 'verCupos'
  | 'verProfesionales'
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
      name: 'verCitas',
      description:
        'Citas vigentes (de hoy en adelante, no anuladas) del paciente de esta conversación. Devuelve tiene_ficha y citas con id_cita, fecha_texto, hora, profesional, sucursal y estado. Si tiene_ficha es false, hay que crear la ficha antes de agendar.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'verCupos',
      description:
        'Horas libres de UN profesional en un día (campo horas, ya sin las horas pasadas). Requiere fecha y profesional. Si el paciente no tiene preferencia, consulta a los profesionales que correspondan uno por uno. No asumas que solo hay 2 o 3 horas.',
      parameters: {
        type: 'object',
        properties: {
          fecha: { type: 'string', description: 'YYYY-MM-DD' },
          nombre_profesional: { type: 'string', description: 'Nombre y apellido, sin Dr./Dra.' },
          id_profesional: { type: 'number', description: 'Solo si lo sacaste de verProfesionales o verCitas' },
          id_sucursal: { type: 'number', description: 'id de la lista de sucursales del prompt' },
          duracion: { type: 'number', description: 'Minutos; por defecto 30' },
        },
        required: ['fecha'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'verProfesionales',
      description:
        'Lista los profesionales habilitados en el sistema con su especialidad. Úsala para confirmar que alguien está habilitado o para obtener su id.',
      parameters: {
        type: 'object',
        properties: {
          especialidad: {
            type: 'string',
            description: 'Opcional. Filtra por especialidad o nombre (ej. ginecología, pediatría).',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'crearCita',
      description:
        'Agenda una hora nueva (siempre como consulta). Solo después de que la ficha ya existe y el paciente confirmó el resumen. Si es para otra persona, exige para_otra_persona, id_paciente y rut devueltos por crearPaciente. Requiere profesional y, si hay más de una sucursal, id_sucursal. En comentario va "Motivo: ..." con el motivo de consulta. El backend rechaza una segunda hora el mismo día con el mismo profesional y más de 2 horas el mismo día.',
      parameters: {
        type: 'object',
        properties: {
          fecha: { type: 'string', description: 'YYYY-MM-DD' },
          hora_inicio: { type: 'string', description: 'HH:mm' },
          nombre_profesional: { type: 'string', description: 'Nombre y apellido, sin Dr./Dra.' },
          id_profesional: { type: 'number' },
          id_sucursal: { type: 'number', description: 'id de la lista de sucursales del prompt' },
          comentario: { type: 'string', description: 'Motivo: <motivo en palabras del paciente>' },
          duracion: { type: 'number' },
          reemplazo: {
            type: 'boolean',
            description: 'true solo cuando reemplaza una cita vigente por cambio de sucursal',
          },
          para_otra_persona: {
            type: 'boolean',
            description: 'true solo si la hora es para alguien distinto de quien escribe por WhatsApp',
          },
          id_paciente: {
            type: 'number',
            description: 'Solo junto con para_otra_persona. El id que devolvió crearPaciente.',
          },
          rut: {
            type: 'string',
            description: 'Solo junto con para_otra_persona. El mismo RUT o pasaporte usado en crearPaciente.',
          },
          celular: {
            type: 'string',
            description: 'Solo junto con para_otra_persona. El celular de ella, si la ficha no tenía RUT.',
          },
        },
        required: ['fecha', 'hora_inicio'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'confirmarCita',
      description:
        'Confirma la asistencia a una cita del paciente. Si tiene más de una cita vigente, id_cita es obligatorio (sácalo de verCitas).',
      parameters: {
        type: 'object',
        properties: { id_cita: { type: 'number' } },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'anularCita',
      description:
        'Anula una cita del paciente. Solo después de que el paciente confirmó explícitamente la anulación. Si tiene más de una cita vigente, id_cita es obligatorio (sácalo de verCitas).',
      parameters: {
        type: 'object',
        properties: { id_cita: { type: 'number' } },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'cambiarCita',
      description:
        'Cambia día, hora y/o profesional de una cita vigente, en la misma sucursal. Si cambia el profesional, el backend crea la hora nueva y libera la anterior: no llames anularCita. Para cambiar de sucursal usa crearCita (reemplazo=true) y luego anularCita. Si tiene más de una cita vigente, id_cita es obligatorio.',
      parameters: {
        type: 'object',
        properties: {
          id_cita: { type: 'number' },
          fecha: { type: 'string', description: 'YYYY-MM-DD' },
          hora_inicio: { type: 'string', description: 'HH:mm' },
          nombre_profesional: { type: 'string', description: 'Solo si cambia el profesional' },
          id_profesional: { type: 'number' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'crearPaciente',
      description:
        'Crea la ficha de quien se va a atender. Sin para_otra_persona, el celular es el WhatsApp de esta conversación. Con para_otra_persona true, la ficha es de la otra persona y celular es el número de ella, no el de quien escribe. Si ese RUT ya existe, devuelve solo id_paciente, sin otros datos. Úsala una sola vez, con nombre, apellidos, RUT o pasaporte, correo, dirección, ocupación y si es extranjero.',
      parameters: {
        type: 'object',
        properties: {
          nombre: { type: 'string', description: 'Nombres de pila, sin apellidos.' },
          apellidos: { type: 'string' },
          rut: { type: 'string', description: 'RUT chileno, o pasaporte si es extranjero.' },
          email: { type: 'string' },
          celular: {
            type: 'string',
            description: 'Celular de la otra persona. Obligatorio si para_otra_persona es true.',
          },
          telefono: { type: 'string', description: 'Otro número de contacto, solo si es distinto al celular de la ficha.' },
          direccion: { type: 'string', description: 'Dirección tal como la dijo el paciente.' },
          comuna: { type: 'string', description: 'La Serena, Coquimbo u otra comuna que haya nombrado.' },
          ocupacion: { type: 'string', description: 'Profesión u ocupación. Obligatoria.' },
          extranjero: { type: 'boolean', description: 'true si es extranjero, false si es chileno.' },
          para_otra_persona: {
            type: 'boolean',
            description: 'true si la ficha no es de quien escribe por WhatsApp.',
          },
        },
        required: ['nombre', 'apellidos', 'rut', 'email', 'direccion', 'ocupacion', 'extranjero'],
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