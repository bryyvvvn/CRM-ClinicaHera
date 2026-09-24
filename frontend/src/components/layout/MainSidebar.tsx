import { LayoutDashboard, MessagesSquare } from 'lucide-react';
import logo from '../../assets/clinica-hera-logo.png';
import type { AppView } from '../../App.tsx';

type MainSidebarProps = {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
};

const navigation: Array<{
  id: AppView;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'conversations', label: 'Conversaciones', icon: MessagesSquare },
];

export function MainSidebar({ activeView, onViewChange }: MainSidebarProps) {
  return (
    <>
      <aside className="hidden h-screen w-[228px] shrink-0 flex-col border-r border-[var(--hera-border)] bg-white md:flex md:w-[86px] xl:w-[228px]">
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
                    : 'text-[var(--hera-muted)] hover:bg-slate-50 hover:text-[var(--hera-blue)]'
                }`}
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                <span className="hidden xl:inline">{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex h-16 border-t border-[var(--hera-border)] bg-white px-3 shadow-[0_-8px_24px_rgba(43,73,82,0.06)] md:hidden"
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
      </nav>
    </>
  );
}
