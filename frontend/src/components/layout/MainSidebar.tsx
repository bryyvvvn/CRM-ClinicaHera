import { LayoutDashboard, MessagesSquare, Moon, Sun } from 'lucide-react';
import logo from '../../assets/clinica-hera-logo.png';
import type { AppView } from '../../App.tsx';
import type { Theme } from '../../hooks/useTheme.ts';

type MainSidebarProps = {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  theme: Theme;
  onToggleTheme: () => void;
};

const navigation: Array<{
  id: AppView;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'conversations', label: 'Conversaciones', icon: MessagesSquare },
];

export function MainSidebar({
  activeView,
  onViewChange,
  theme,
  onToggleTheme,
}: MainSidebarProps) {
  const isDark = theme === 'dark';

  return (
    <>
      <aside className="hidden h-screen w-[228px] shrink-0 flex-col border-r border-[var(--hera-border)] bg-[var(--hera-surface)] md:flex md:w-[86px] xl:w-[228px]">
        <div className="flex h-24 items-center justify-center border-b border-[var(--hera-border)] px-5 xl:justify-start">
          <img
            src={logo}
            alt="Clínica Hera"
            className="h-auto w-14 object-contain xl:w-44"
          />
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3 py-6" aria-label="Navegación principal">
          {navigation.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onViewChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex h-12 items-center justify-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors xl:justify-start ${
                  isActive
                    ? 'bg-[var(--hera-coral-soft)] text-[var(--hera-coral-dark)]'
                    : 'text-[var(--hera-muted)] hover:bg-[var(--hera-surface-soft)] hover:text-[var(--hera-blue)]'
                }`}
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                <span className="hidden xl:inline">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[var(--hera-border)] p-3">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            aria-pressed={isDark}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl px-3 text-sm font-medium text-[var(--hera-muted)] transition-colors hover:bg-[var(--hera-surface-soft)] hover:text-[var(--hera-blue)] xl:justify-start"
          >
            {isDark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
            <span className="hidden xl:inline">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
        </div>
      </aside>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex h-16 border-t border-[var(--hera-border)] bg-[var(--hera-surface)] px-3 shadow-[0_-8px_24px_rgba(43,73,82,0.06)] md:hidden"
        aria-label="Navegación principal"
      >
        {navigation.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                isActive ? 'text-[var(--hera-coral-dark)]' : 'text-[var(--hera-muted)]'
              }`}
            >
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              {label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
          aria-pressed={isDark}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-[var(--hera-muted)]"
        >
          {isDark ? <Sun size={20} strokeWidth={1.8} aria-hidden="true" /> : <Moon size={20} strokeWidth={1.8} aria-hidden="true" />}
          {isDark ? 'Claro' : 'Oscuro'}
        </button>
      </nav>
    </>
  );
}
