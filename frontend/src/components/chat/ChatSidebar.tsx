import { AlertTriangle, Bell, Bot, CheckCircle2, Loader2, UserRound } from 'lucide-react';
import {
  conversationStatus,
  type Conversation,
  type ResolvedListStatus,
} from '../../types/chat.ts';
import { formatShortDate } from '../../utils/formatDate.ts';

export type ConversationFilter = 'all' | 'ai' | 'human';
export type ChatTab = 'active' | 'attention' | 'resolved';
export type NotificationPermissionState = NotificationPermission | 'unsupported';

type ChatSidebarProps = {
  openConversations: Conversation[];
  resolvedConversations: Conversation[];
  resolvedStatus: ResolvedListStatus;
  hasMoreResolved: boolean;
  onLoadMoreResolved: () => void;
  onRetryResolved: () => void;
  selectedId?: string;
  searchQuery: string;
  tab: ChatTab;
  onTabChange: (tab: ChatTab) => void;
  filter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
  onSelect: (id: string) => void;
  notificationPermission: NotificationPermissionState;
  onEnableNotifications: () => void;
};

const filters: Array<{ id: ConversationFilter; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'ai', label: 'IA' },
  { id: 'human', label: 'Humano' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hera-blue)]';

const emptyCopy: Record<ChatTab, { title: string; empty: string }> = {
  active: {
    title: 'Aún no hay conversaciones',
    empty: 'Las nuevas conversaciones de WhatsApp aparecerán aquí.',
  },
  attention: {
    title: 'Nada pendiente',
    empty: 'Las conversaciones que requieran atención aparecerán aquí.',
  },
  resolved: {
    title: 'Sin conversaciones resueltas',
    empty: 'Las conversaciones que marques como resueltas aparecerán aquí.',
  },
};

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

function attentionTime(conversation: Conversation) {
  const time = conversation.attentionAt ? Date.parse(conversation.attentionAt) : Number.NaN;
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

export function ChatSidebar({
  openConversations,
  resolvedConversations,
  resolvedStatus,
  hasMoreResolved,
  onLoadMoreResolved,
  onRetryResolved,
  selectedId,
  searchQuery,
  tab,
  onTabChange,
  filter,
  onFilterChange,
  onSelect,
  notificationPermission,
  onEnableNotifications,
}: ChatSidebarProps) {
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase('es');

  const matchesSearch = (conversation: Conversation) =>
    !normalizedSearch ||
    conversation.patientName.toLocaleLowerCase('es').includes(normalizedSearch) ||
    conversation.phone.toLocaleLowerCase('es').includes(normalizedSearch);

  const attentionConversations = openConversations
    .filter((conversation) => conversation.needsAttention)
    .sort((a, b) => attentionTime(a) - attentionTime(b));

  const tabSource: Record<ChatTab, Conversation[]> = {
    active: openConversations,
    attention: attentionConversations,
    resolved: resolvedConversations,
  };
  const source = tabSource[tab];

  const visibleConversations = source.filter((conversation) => {
    const matchesFilter =
      tab !== 'active' ||
      filter === 'all' ||
      (filter === 'ai' && conversation.isAiActive) ||
      (filter === 'human' && !conversation.isAiActive);

    return matchesSearch(conversation) && matchesFilter;
  });

  const attentionCount = attentionConversations.length;
  const tabs: Array<{ id: ChatTab; label: string; count?: number }> = [
    { id: 'active', label: 'Activas', count: openConversations.length },
    { id: 'attention', label: 'Atención', count: attentionCount },
    { id: 'resolved', label: 'Resueltas' },
  ];

  const resolvedLoadingFirst = tab === 'resolved' && resolvedStatus === 'loading' && source.length === 0;
  const resolvedFailedFirst = tab === 'resolved' && resolvedStatus === 'error' && source.length === 0;

  return (
    <aside className="flex h-full min-h-0 min-w-0 w-full flex-col border-r border-[var(--hera-border)] bg-[var(--hera-surface)]">
      <div className="border-b border-[var(--hera-border)] px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-[var(--hera-text)]">
              Conversaciones
            </h1>

            <p className="mt-0.5 text-xs text-[var(--hera-muted)]">
              WhatsApp · Clínica Hera
            </p>
          </div>

          {notificationPermission === 'default' ? (
            <button
              type="button"
              onClick={onEnableNotifications}
              aria-label="Activar avisos del navegador para conversaciones que requieren atención"
              className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--hera-border)] px-2.5 text-xs font-medium text-[var(--hera-muted)] transition hover:border-[var(--hera-blue)] hover:text-[var(--hera-blue-dark)] ${focusRing}`}
            >
              <Bell size={14} aria-hidden="true" />
              Activar avisos
            </button>
          ) : null}
        </div>

        <div
          className="mt-4 flex gap-1 rounded-xl bg-[var(--hera-surface-soft)] p-1"
          role="tablist"
          aria-label="Estado de las conversaciones"
        >
          {tabs.map((item) => {
            const active = tab === item.id;
            const alert = item.id === 'attention' && (item.count ?? 0) > 0;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${focusRing} ${
                  active
                    ? 'bg-[var(--hera-surface)] text-[var(--hera-blue-dark)] shadow-sm ring-1 ring-inset ring-[var(--hera-border)]'
                    : 'text-[var(--hera-muted)] hover:bg-[var(--hera-background)] hover:text-[var(--hera-text)]'
                }`}
              >
                {item.label}
                {item.count !== undefined ? (
                  <span
                    className={`min-w-[1.25rem] rounded-full px-1.5 text-[10px] font-semibold leading-4 ${
                      alert
                        ? 'bg-[var(--hera-alert)] text-[var(--hera-on-alert)]'
                        : 'bg-[var(--hera-blue-soft)] text-[var(--hera-blue-dark)]'
                    }`}
                  >
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {tab === 'active' ? (
          <div className="mt-2 flex gap-1" aria-label="Filtrar conversaciones">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onFilterChange(item.id)}
                aria-pressed={filter === item.id}
                className={`flex-1 rounded-lg px-2 py-1 text-xs font-medium transition ${focusRing} ${
                  filter === item.id
                    ? 'bg-[var(--hera-blue-soft)] text-[var(--hera-blue-dark)]'
                    : 'text-[var(--hera-muted)] hover:bg-[var(--hera-surface-soft)] hover:text-[var(--hera-text)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <ul className="flex-1 overflow-y-auto px-2 py-2" role="tabpanel">
        {resolvedLoadingFirst ? (
          <li className="flex h-full min-h-56 items-center justify-center gap-2 text-xs text-[var(--hera-muted)]">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Cargando resueltas…
          </li>
        ) : resolvedFailedFirst ? (
          <li className="flex h-full min-h-56 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm text-[var(--hera-muted)]">No se pudieron cargar las resueltas.</p>
            <button
              type="button"
              onClick={onRetryResolved}
              className={`rounded-lg border border-[var(--hera-border)] px-3 py-1.5 text-xs font-medium text-[var(--hera-text)] hover:border-[var(--hera-blue)] ${focusRing}`}
            >
              Reintentar
            </button>
          </li>
        ) : visibleConversations.length === 0 ? (
          <li className="flex h-full min-h-56 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--hera-blue-soft)] text-[var(--hera-blue)]">
              <UserRound
                size={21}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-[var(--hera-text)]">
              {source.length === 0 ? emptyCopy[tab].title : 'Sin resultados'}
            </p>

            <p className="mt-1.5 text-xs leading-5 text-[var(--hera-muted)]">
              {source.length === 0
                ? emptyCopy[tab].empty
                : 'Prueba con otro nombre, número o filtro.'}
            </p>
          </li>
        ) : (
          visibleConversations.map((conversation) => {
            const selected = conversation.id === selectedId;
            const resolved = conversationStatus(conversation) === 'resolved';
            const needsAttention = !resolved && Boolean(conversation.needsAttention);

            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  aria-current={selected ? 'true' : undefined}
                  className={`group relative my-1 flex min-h-[72px] w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-colors ${focusRing} ${
                    selected
                      ? 'bg-[var(--hera-surface-soft)] ring-1 ring-inset ring-[var(--hera-border)]'
                      : 'hover:bg-[var(--hera-surface-soft)]'
                  } ${resolved ? 'opacity-70' : ''}`}
                >
                  {selected || needsAttention ? (
                    <span
                      className={`absolute bottom-3 left-0 top-3 w-0.5 rounded-r-full ${
                        needsAttention ? 'bg-[var(--hera-alert)]' : 'bg-[var(--hera-coral)]'
                      }`}
                      aria-hidden="true"
                    />
                  ) : null}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      selected
                        ? 'bg-[var(--hera-surface)] text-[var(--hera-coral)] ring-1 ring-[var(--hera-border)]'
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

                      {resolved ? (
                        <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--hera-muted)]">
                          <CheckCircle2 size={12} aria-hidden="true" />
                          Resuelta
                          {conversation.resolvedAt ? ` · ${formatShortDate(conversation.resolvedAt)}` : ''}
                        </span>
                      ) : (
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
                      )}
                    </div>

                    {needsAttention ? (
                      <p className="mt-1 flex min-w-0 items-center gap-1.5 text-[12px] leading-4">
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--hera-alert-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--hera-alert-strong)]">
                          <AlertTriangle size={11} aria-hidden="true" />
                          Requiere atención
                        </span>
                        {conversation.attentionReason ? (
                          <span className="truncate text-[var(--hera-alert-strong)]">
                            {conversation.attentionReason}
                          </span>
                        ) : null}
                      </p>
                    ) : null}

                    <p className="mt-1 truncate text-[13px] leading-[18px] text-[var(--hera-muted)]">
                      {conversation.lastMessage || 'Sin mensajes todavía'}
                    </p>
                  </div>
                </button>
              </li>
            );
          })
        )}

        {tab === 'resolved' && source.length > 0 && (hasMoreResolved || resolvedStatus === 'error') ? (
          <li className="flex justify-center py-3">
            <button
              type="button"
              onClick={resolvedStatus === 'error' ? onRetryResolved : onLoadMoreResolved}
              disabled={resolvedStatus === 'loading'}
              className={`flex items-center gap-2 rounded-lg border border-[var(--hera-border)] px-3 py-1.5 text-xs font-medium text-[var(--hera-text)] transition hover:border-[var(--hera-blue)] disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
            >
              {resolvedStatus === 'loading' ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : null}
              {resolvedStatus === 'error' ? 'Reintentar' : 'Cargar más'}
            </button>
          </li>
        ) : null}
      </ul>
    </aside>
  );
}
