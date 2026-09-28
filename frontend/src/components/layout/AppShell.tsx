import type { ReactNode } from 'react';
import type { AppView } from '../../App.tsx';
import type { Theme } from '../../hooks/useTheme.ts';
import { MainSidebar } from './MainSidebar.tsx';
import { TopBar } from './TopBar.tsx';

type AppShellProps = {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  conversationSearch: string;
  onConversationSearchChange: (value: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  children: ReactNode;
};

export function AppShell({
  activeView,
  onViewChange,
  conversationSearch,
  onConversationSearchChange,
  theme,
  onToggleTheme,
  children,
}: AppShellProps) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--hera-background)]">
      <MainSidebar
        activeView={activeView}
        onViewChange={onViewChange}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <TopBar
          activeView={activeView}
          conversationSearch={conversationSearch}
          onConversationSearchChange={onConversationSearchChange}
        />
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
