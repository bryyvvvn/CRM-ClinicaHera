import heraLogo from '../../assets/icono-hera.png';
import type { ChatMessage } from '../../types/chat.ts';

type MessageBubbleProps = {
  message: ChatMessage;
};

function formatMessageTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'system') {
    return (
      <div className="my-1 flex justify-center">
        <p className="max-w-lg rounded-full bg-[var(--hera-surface)] px-4 py-1.5 text-center text-[11px] leading-5 text-[var(--hera-muted)] shadow-sm ring-1 ring-[var(--hera-border)]">
          {message.content}
        </p>
      </div>
    );
  }

  const fromClinic = message.role === 'assistant';
  const time = formatMessageTime(message.createdAt);

  return (
    <div
      className={`flex min-w-0 items-end ${
        fromClinic ? 'justify-end gap-2' : 'justify-start'
      }`}
    >
      <div
        className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-[1.5] [overflow-wrap:anywhere] shadow-[0_4px_14px_rgba(46,70,77,0.035)] sm:text-sm md:min-w-[110px] md:[max-width:min(680px,62%)] ${
          fromClinic
            ? 'rounded-br-md bg-[var(--hera-blue-soft)] text-[var(--hera-text)]'
            : 'rounded-bl-md bg-[var(--hera-surface)] text-[var(--hera-text)] ring-1 ring-[var(--hera-border)]'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {time ? (
          <time
            dateTime={message.createdAt}
            className="mt-1 block text-right text-[10.5px] leading-none text-[var(--hera-muted)]"
          >
            {time}
          </time>
        ) : null}
      </div>

      {fromClinic ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--hera-logo-surface)] ring-1 ring-[var(--hera-border)]">
          <img
            src={heraLogo}
            alt="Clínica Hera"
            className="h-6 w-6 object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}
