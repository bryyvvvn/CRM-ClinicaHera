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
        <p className="max-w-lg rounded-full bg-white/80 px-4 py-1.5 text-center text-[11px] leading-5 text-[var(--hera-muted)] shadow-sm ring-1 ring-[var(--hera-border)]">
          {message.content}
        </p>
      </div>
    );
  }

  const fromClinic = message.role === 'assistant';
  const time = formatMessageTime(message.createdAt);

  return (
    <div className={`flex min-w-0 ${fromClinic ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 [overflow-wrap:anywhere] shadow-[0_5px_16px_rgba(46,70,77,0.04)] sm:max-w-[72%] ${
          fromClinic
            ? 'rounded-br-md bg-[var(--hera-blue-soft)] text-[var(--hera-text)]'
            : 'rounded-bl-md bg-white text-[var(--hera-text)] ring-1 ring-[var(--hera-border)]'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {time ? (
          <time
            dateTime={message.createdAt}
            className="mt-1 block text-right text-[10px] leading-none text-[var(--hera-muted)]"
          >
            {time}
          </time>
        ) : null}
      </div>
    </div>
  );
}
