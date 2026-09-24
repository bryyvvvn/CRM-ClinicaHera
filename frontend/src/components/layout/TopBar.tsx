import { Search } from 'lucide-react';
import type { AppView } from '../../App.tsx';

type TopBarProps = {
  activeView: AppView;
  conversationSearch: string;
  onConversationSearchChange: (value: string) => void;
};

export function TopBar({
  activeView,
  conversationSearch,
  onConversationSearchChange,
}: TopBarProps) {
  const isConversations = activeView === 'conversations';

  return (
    <header className="flex h-20 shrink-0 items-center gap-4 border-b border-[var(--hera-border)] bg-white px-4 sm:px-6 lg:px-8">
      <div className="min-w-0 flex-1">
        {isConversations ? (
          <label className="relative block max-w-[680px]">
            <span className="sr-only">Buscar conversaciones</span>
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--hera-muted)]"
            />
            <input
              type="search"
              value={conversationSearch}
              onChange={(event) => onConversationSearchChange(event.target.value)}
              placeholder="Buscar conversaciones por nombre o número..."
              className="h-[46px] w-full rounded-[14px] border border-[var(--hera-border)] bg-[var(--hera-background)] pl-11 pr-4 text-sm text-[var(--hera-text)] outline-none transition focus:border-[var(--hera-blue)] focus:bg-white focus:ring-4 focus:ring-[var(--hera-blue-soft)]"
            />
          </label>
        ) : (
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--hera-muted)]">
              Clínica Hera
            </p>
            <h1 className="mt-1 text-xl font-semibold text-[var(--hera-text)]">Dashboard</h1>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 border-l border-[var(--hera-border)] pl-4 sm:pl-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--hera-blue-soft)] text-sm font-semibold text-[var(--hera-blue-dark)]">
          AD
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-[var(--hera-text)]">Administrador</p>
          <p className="text-xs text-[var(--hera-muted)]">Clínica Hera</p>
        </div>
      </div>
    </header>
  );
}
