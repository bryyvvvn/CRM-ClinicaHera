import { useState, type FormEvent } from 'react';
import type { ChatMessage, Conversation } from '../../types/chat.ts';
import { MessageBubble } from './MessageBubble.tsx';

type ChatWindowProps = {
  conversation?: Conversation;
  messages: ChatMessage[];
  connected: boolean;
  onToggleAi: (isAiActive: boolean) => void;
  onSend: (content: string) => void;
};

export function ChatWindow({
  conversation,
  messages,
  connected,
  onToggleAi,
  onSend,
}: ChatWindowProps) {
  const [draft, setDraft] = useState('');

  if (!conversation) {
    return (
      <main className="flex flex-1 items-center justify-center bg-slate-50 text-slate-500">
        Selecciona una conversación
      </main>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) {
      return;
    }
    onSend(content);
    setDraft('');
  };

  return (
    <main className="flex h-full flex-1 flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {conversation.patientName}
          </h2>
          <p className="text-xs text-slate-500">
            {conversation.phone} · {connected ? 'conectado' : 'desconectado'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleAi(!conversation.isAiActive)}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            conversation.isAiActive
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          {conversation.isAiActive ? 'Pausar IA / Asumir control' : 'Reanudar IA'}
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-slate-200 bg-white px-6 py-3"
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
