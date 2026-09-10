import type { ChatMessage } from '../../types/chat.ts';

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'system') {
    return (
      <p className="mx-auto max-w-md text-center text-xs text-slate-500">
        {message.content}
      </p>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? 'bg-teal-600 text-white'
            : 'bg-white text-slate-800 ring-1 ring-slate-200'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
