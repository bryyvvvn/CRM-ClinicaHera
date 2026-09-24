import { Bot, UserRound } from 'lucide-react';
import type { Conversation } from '../../types/chat.ts';

export type ConversationFilter = 'all' | 'ai' | 'human';

type ChatSidebarProps = {
  conversations: Conversation[];
  selectedId?: string;
  searchQuery: string;
  filter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
  onSelect: (id: string) => void;
};

const filters: Array<{ id: ConversationFilter; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'ai', label: 'IA' },
  { id: 'human', label: 'Humano' },
];

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || 'CH';
}

export function ChatSidebar({
  conversations,
  selectedId,
  searchQuery,
  filter,
  onFilterChange,
  onSelect,
}: ChatSidebarProps) {
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase('es');
  const visibleConversations = conversations.filter((conversation) => {
    const matchesSearch =
      !normalizedSearch ||
      conversation.patientName.toLocaleLowerCase('es').includes(normalizedSearch) ||
      conversation.phone.toLocaleLowerCase('es').includes(normalizedSearch);
    const matchesFilter =
      filter === 'all' ||
      (filter === 'ai' && conversation.isAiActive) ||
      (filter === 'human' && !conversation.isAiActive);

    return matchesSearch && matchesFilter;
  });

  return (
    <aside className="flex h-full min-h-0 min-w-0 w-full flex-col border-r border-[var(--hera-border)] bg-[var(--hera-surface)]">
      <div className="border-b border-[var(--hera-border)] px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-[var(--hera-text)]">Conversaciones</h1>
            <p className="mt-0.5 text-xs text-[var(--hera-muted)]">WhatsApp · Clínica Hera</p>
          </div>
          <span className="rounded-full bg-[var(--hera-blue-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--hera-blue-dark)]">
            {conversations.length}
          </span>
        </div>

        <div className="mt-4 flex gap-1 rounded-xl bg-[var(--hera-background)] p-1" aria-label="Filtrar conversaciones">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange(item.id)}
              aria-pressed={filter === item.id}
              className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                filter === item.id
                  ? 'bg-[var(--hera-surface)] text-[var(--hera-blue-dark)] shadow-sm'
                  : 'text-[var(--hera-muted)] hover:text-[var(--hera-text)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto px-2 py-2">
        {visibleConversations.length === 0 ? (
          <li className="flex h-full min-h-56 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--hera-blue-soft)] text-[var(--hera-blue)]">
              <UserRound size={21} strokeWidth={1.7} aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[var(--hera-text)]">
              {conversations.length === 0 ? 'Aún no hay conversaciones' : 'Sin resultados'}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-[var(--hera-muted)]">
              {conversations.length === 0
                ? 'Las nuevas conversaciones de WhatsApp aparecerán aquí.'
                : 'Prueba con otro nombre, número o filtro.'}
            </p>
          </li>
        ) : (
          visibleConversations.map((conversation) => {
            const selected = conversation.id === selectedId;
            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  aria-current={selected ? 'true' : undefined}
                  className={`group my-1 flex min-h-[72px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? 'bg-[var(--hera-coral-soft)]'
                      : 'hover:bg-[var(--hera-background)]'
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      selected
                        ? 'bg-[var(--hera-surface)] text-[var(--hera-coral-dark)]'
                        : 'bg-[var(--hera-blue-soft)] text-[var(--hera-blue-dark)]'
                    }`}
                  >
                    {getInitials(conversation.patientName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[15px] font-semibold leading-5 text-[var(--hera-text)]">
                        {conversation.patientName}
                      </span>
                      <span
                        className={`flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${
                          conversation.isAiActive
                            ? 'text-[var(--hera-blue)]'
                            : 'text-[var(--hera-coral-dark)]'
                        }`}
                      >
                        {conversation.isAiActive ? (
                          <Bot size={12} aria-hidden="true" />
                        ) : (
                          <UserRound size={12} aria-hidden="true" />
                        )}
                        {conversation.isAiActive ? 'IA' : 'Humano'}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[13px] leading-[18px] text-[var(--hera-muted)]">
                      {conversation.lastMessage || 'Sin mensajes todavía'}
                    </p>
                  </div>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
}
