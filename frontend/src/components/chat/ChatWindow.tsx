import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
  Send,
  UserRound,
} from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react';
import { formatChileanPhone } from '../../utils/formatPhone.ts';
import { conversationStatus, type ChatMessage, type Conversation } from '../../types/chat.ts';
import { formatDateTime, formatTime } from '../../utils/formatDate.ts';
import { WhatsAppIcon } from '../icons/WhatsAppIcon.tsx';
import { MessageBubble } from './MessageBubble.tsx';
import { DateSeparator, getMessageDateKey } from './DataSeparator.tsx';

export type PendingAction = 'resolve' | 'reopen' | 'clearAttention';

type ChatWindowProps = {
  conversation?: Conversation;
  messages: ChatMessage[];
  connected: boolean;
  onBack: () => void;
  onToggleAi: (isAiActive: boolean) => void;
  onResolve: () => void;
  onReopen: () => void;
  onClearAttention: () => void;
  pendingAction: PendingAction | null;
  actionError: string | null;
  summaryStatus?: 'idle' | 'loading' | 'error';
  onSend: (content: string) => void;
  onTyping: () => void;
  assistantTyping: boolean;
};

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hera-blue)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--hera-surface)]';

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
  onResolve,
  onReopen,
  onClearAttention,
  pendingAction,
  actionError,
  summaryStatus = 'idle',
  onSend,
  onTyping,
  assistantTyping,
}: ChatWindowProps) {
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastTypingAt = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, assistantTyping]);

  const handleDraftChange = (value: string) => {
    setDraft(value);
    if (!value.trim()) {
      return;
    }
    const now = Date.now();
    if (now - lastTypingAt.current < 4000) {
      return;
    }
    lastTypingAt.current = now;
    onTyping();
  };

  if (!conversation) {
    return (
      <main className="flex h-full min-h-0 min-w-0 w-full flex-1 items-center justify-center overflow-hidden bg-[var(--hera-chat-background)] px-6 text-center">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--hera-surface)] text-[var(--hera-blue)] shadow-sm ring-1 ring-[var(--hera-border)]">
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

  const resolved = conversationStatus(conversation) === 'resolved';
  const needsAttention = !resolved && Boolean(conversation.needsAttention);
  const summaryLoading = summaryStatus === 'loading' && !conversation.handoffSummary;

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
    <main className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-[var(--hera-chat-background)]">
      <header className="flex min-h-[76px] min-w-0 w-full items-center justify-between gap-3 overflow-hidden border-b border-[var(--hera-border)] bg-[var(--hera-surface)] px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--hera-muted)] hover:bg-[var(--hera-chat-background)] md:hidden"
            aria-label="Volver a conversaciones"
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--hera-blue-soft)] text-sm font-semibold text-[var(--hera-blue-dark)]">
            {getInitials(conversation.patientName)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold text-[var(--hera-text)] sm:text-base">
                {conversation.patientName}
              </h2>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--hera-muted)] sm:text-xs">
              <span className="flex min-w-0 items-center gap-1.5">
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
                <span className="truncate">{formatChileanPhone(conversation.phone)}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex shrink-0 items-center gap-1">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-[var(--hera-muted)]'}`}
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
          <div className="flex items-center gap-2">
            {!resolved ? (
              <button
                type="button"
                onClick={onResolve}
                disabled={pendingAction === 'resolve'}
                aria-label="Marcar conversación como resuelta"
                className={`flex h-9 items-center gap-2 rounded-xl border border-[var(--hera-border)] bg-[var(--hera-surface)] px-3 text-xs font-semibold text-[var(--hera-text)] transition hover:border-[var(--hera-blue)] hover:text-[var(--hera-blue-dark)] disabled:cursor-wait disabled:opacity-60 sm:h-10 sm:px-4 ${focusRing}`}
              >
                <CheckCircle2 size={15} aria-hidden="true" />
                <span className="hidden min-[430px]:inline">Marcar resuelto</span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onToggleAi(!conversation.isAiActive)}
              aria-label={conversation.isAiActive ? 'Pausar IA' : 'Reanudar IA'}
              className={`flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition sm:h-10 sm:px-4 ${focusRing} ${
                conversation.isAiActive
                  ? 'border border-[var(--hera-border)] bg-[var(--hera-surface)] text-[var(--hera-text)] hover:border-[var(--hera-coral)] hover:text-[var(--hera-coral-dark)]'
                  : 'bg-[var(--hera-blue)] text-[var(--hera-on-accent)] hover:bg-[var(--hera-blue-dark)]'
              }`}
            >
              {conversation.isAiActive ? <Pause size={15} /> : <Play size={15} />}
              <span className="hidden min-[430px]:inline">
                {conversation.isAiActive ? 'Pausar IA' : 'Reanudar IA'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {resolved ? (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--hera-border)] bg-[var(--hera-surface-soft)] px-4 py-2 sm:px-5">
          <p className="flex min-w-0 items-center gap-2 text-xs text-[var(--hera-muted)]">
            <CheckCircle2 size={15} className="shrink-0 text-[var(--hera-blue)]" aria-hidden="true" />
            <span className="min-w-0">
              Conversación resuelta
              {conversation.resolvedAt ? ` el ${formatDateTime(conversation.resolvedAt)}` : ''}
            </span>
          </p>
          <button
            type="button"
            onClick={onReopen}
            disabled={pendingAction === 'reopen'}
            aria-label="Reabrir conversación"
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--hera-border)] bg-[var(--hera-surface)] px-3 text-xs font-semibold text-[var(--hera-text)] transition hover:border-[var(--hera-blue)] hover:text-[var(--hera-blue-dark)] disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reabrir
          </button>
        </div>
      ) : null}

      {needsAttention ? (
        <div
          role="alert"
          className="border-b border-[var(--hera-border)] bg-[var(--hera-alert-soft)] px-4 py-2 sm:px-5"
        >
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <p className="flex min-w-0 flex-1 items-center gap-2 text-xs text-[var(--hera-alert-strong)]">
              <AlertTriangle size={15} className="shrink-0 text-[var(--hera-alert)]" aria-hidden="true" />
              <span className="min-w-0">
                <span className="font-semibold">Requiere atención</span>
                {conversation.attentionReason ? `: ${conversation.attentionReason}` : ''}
                {conversation.attentionAt ? (
                  <span className="opacity-80"> · {formatTime(conversation.attentionAt)}</span>
                ) : null}
              </span>
            </p>
            <button
              type="button"
              onClick={onClearAttention}
              disabled={pendingAction === 'clearAttention'}
              aria-label="Marcar alerta como atendida"
              className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[var(--hera-alert)] px-3 text-xs font-semibold text-[var(--hera-on-alert)] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
            >
              <CheckCircle2 size={14} aria-hidden="true" />
              Atendido
            </button>
          </div>
          {conversation.handoffSummary ? (
            <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[var(--hera-text)]">
              {conversation.handoffSummary}
            </p>
          ) : summaryLoading ? (
            <p className="mt-1 text-xs text-[var(--hera-alert-strong)]">Armando el resumen…</p>
          ) : null}
        </div>
      ) : !conversation.isAiActive && (conversation.handoffSummary || summaryLoading) ? (
        <div className="border-b border-[var(--hera-border)] bg-[var(--hera-surface-soft)] px-4 py-2 sm:px-5">
          <p className="text-xs font-semibold text-[var(--hera-muted)]">Resumen para secretaría</p>
          {conversation.handoffSummary ? (
            <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[var(--hera-text)]">
              {conversation.handoffSummary}
            </p>
          ) : (
            <p className="mt-1 text-xs text-[var(--hera-muted)]">Armando el resumen…</p>
          )}
        </div>
      ) : null}

      <p
        role="status"
        aria-live="polite"
        className={
          actionError
            ? 'border-b border-[var(--hera-border)] bg-[var(--hera-surface)] px-4 py-1.5 text-xs text-[var(--hera-coral-dark)] sm:px-5'
            : 'sr-only'
        }
      >
        {actionError ?? ''}
      </p>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 overflow-x-hidden overflow-y-auto px-4 py-5 sm:gap-3 sm:px-6 sm:py-6 lg:px-8">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="text-xs text-[var(--hera-muted)]">
              Aún no hay mensajes en esta conversación.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const previousMessage = messages[index - 1];

            const currentDateKey = getMessageDateKey(message.createdAt);

            const previousDateKey = previousMessage
              ? getMessageDateKey(previousMessage.createdAt)
              : null;

            const showDateSeparator =
              !previousMessage ||
              currentDateKey !== previousDateKey;

            return (
              <Fragment key={message.id}>
                {showDateSeparator ? (
                  <DateSeparator date={message.createdAt} />
                ) : null}

                <MessageBubble message={message} />
              </Fragment>
            );
          })
        )}
        {assistantTyping ? (
          <div className="flex justify-end">
            <div className="rounded-2xl rounded-br-md bg-[var(--hera-chat-outgoing)] px-4 py-2.5 text-sm tracking-widest text-[var(--hera-muted)]">
              .....
            </div>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex min-w-0 w-full items-center gap-2 overflow-hidden border-t border-[var(--hera-border)] bg-[var(--hera-surface)] px-3 py-3 sm:px-6"
      >
        <label className="sr-only" htmlFor="message-draft">
          Mensaje
        </label>
        <input
          id="message-draft"
          value={draft}
          onChange={(event) => handleDraftChange(event.target.value)}
          placeholder={resolved ? 'Conversación resuelta: al enviar se reabre' : 'Escribe un mensaje...'}
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-2xl border border-[var(--hera-border)] bg-[var(--hera-chat-background)] px-4 text-sm text-[var(--hera-text)] outline-none transition placeholder:text-[var(--hera-placeholder)] focus:border-[var(--hera-blue)] focus:bg-[var(--hera-surface)] focus:ring-4 focus:ring-[var(--hera-blue-soft)]"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--hera-blue)] text-[var(--hera-on-accent)] shadow-[0_8px_18px_rgba(39,127,150,0.2)] transition hover:bg-[var(--hera-blue-dark)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Enviar mensaje"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </main>
  );
}
