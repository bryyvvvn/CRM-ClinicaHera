import { Bot, MessageCircleMore, MessagesSquare } from 'lucide-react';

// TODO: Replace these temporary metrics with dashboard API data when its endpoint exists.
export const dashboardMetrics = [
  {
    title: 'Conversaciones activas',
    value: 12,
    detail: 'En atención actualmente',
    icon: MessagesSquare,
    tone: 'blue' as const,
  },
  {
    title: 'Pendientes',
    value: 5,
    detail: 'Esperando respuesta',
    icon: MessageCircleMore,
    tone: 'coral' as const,
  },
  {
    title: 'Respondidas por IA',
    value: 18,
    detail: 'Durante el día de hoy',
    icon: Bot,
    tone: 'soft-blue' as const,
  },
];
