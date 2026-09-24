import { ArrowLeft, Bot, MessageCircle, Pause, Play, Send, UserRound } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { ChatMessage, Conversation } from '../../types/chat.ts';
import { MessageBubble } from './MessageBubble.tsx';

type ChatWindowProps = {
  conversation?: Conversation;
  messages: ChatMessage[];
  connected: boolean;
  onBack: () => void;
  onToggleAi: (isAiActive: boolean) => void;
  onSend: (content: string) => void;
};

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'CH'
  );
}

export function ChatWindow({
  conversation,
  messages,
  connected,
  onBack,
  onToggleAi,
  onSend,
}: ChatWindowProps) {
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  if (!conversation) {
    return (
      <main className="flex h-full min-h-0 min-w-0 w-full flex-1 items-center justify-center overflow-hidden bg-[var(--hera-background)] px-6 text-center">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--hera-blue)] shadow-sm ring-1 ring-[var(--hera-border)]">
            <MessageCircle size={27} strokeWidth={1.6} aria-hidden="true" />
          </div>
          <p className="mt-5 text-sm font-semibold text-[var(--hera-text)]">Selecciona una conversación</p>
          <p className="mt-1 text-xs text-[var(--hera-muted)]">
            Elige un contacto para ver su historial de mensajes.
          </p>
        </div>
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
    <main className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-[var(--hera-background)]">
      <header className="flex min-h-[82px] min-w-0 w-full items-center justify-between gap-3 overflow-hidden border-b border-[var(--hera-border)] bg-white px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--hera-muted)] hover:bg-[var(--hera-background)] md:hidden"
            aria-label="Volver a conversaciones"
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--hera-blue-soft)] text-sm font-semibold text-[var(--hera-blue-dark)]">
            {getInitials(conversation.patientName)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold text-[var(--hera-text)] sm:text-base">
                {conversation.patientName}
              </h2>
              <MessageCircle
                size={15}
                aria-label="WhatsApp"
                className="shrink-0 text-emerald-600"
              />
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--hera-muted)] sm:text-xs">
              <span className="truncate">{conversation.phone}</span>
              <span aria-hidden="true">·</span>
              <span className="flex shrink-0 items-center gap-1">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-300'}`}
                />
                {connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <span
            className={`hidden items-center gap-1.5 text-xs font-medium lg:flex ${
              conversation.isAiActive
                ? 'text-[var(--hera-blue)]'
                : 'text-[var(--hera-coral-dark)]'
            }`}
          >
            {conversation.isAiActive ? <Bot size={15} /> : <UserRound size={15} />}
            {conversation.isAiActive ? 'IA activa' : 'Modo humano'}
          </span>
          <button
            type="button"
            onClick={() => onToggleAi(!conversation.isAiActive)}
            className={`flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition sm:h-10 sm:px-4 ${
              conversation.isAiActive
                ? 'border border-[var(--hera-border)] bg-white text-[var(--hera-text)] hover:border-[var(--hera-coral)] hover:text-[var(--hera-coral-dark)]'
                : 'bg-[var(--hera-blue)] text-white hover:bg-[var(--hera-blue-dark)]'
            }`}
          >
            {conversation.isAiActive ? <Pause size={15} /> : <Play size={15} />}
            <span className="hidden min-[430px]:inline">
              {conversation.isAiActive ? 'Pausar IA' : 'Reanudar IA'}
            </span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="text-xs text-[var(--hera-muted)]">Aún no hay mensajes en esta conversación.</p>
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex min-w-0 w-full items-center gap-2 overflow-hidden border-t border-[var(--hera-border)] bg-white px-3 py-3 sm:px-6 sm:py-4"
      >
        <label className="sr-only" htmlFor="message-draft">
          Mensaje
        </label>
        <input
          id="message-draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escribe un mensaje..."
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-2xl border border-[var(--hera-border)] bg-[var(--hera-background)] px-4 text-sm text-[var(--hera-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--hera-blue)] focus:bg-white focus:ring-4 focus:ring-[var(--hera-blue-soft)]"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--hera-blue)] text-white shadow-[0_8px_18px_rgba(39,127,150,0.2)] transition hover:bg-[var(--hera-blue-dark)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Enviar mensaje"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </main>
  );
}
