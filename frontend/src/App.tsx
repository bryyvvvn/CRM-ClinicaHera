import { useState } from 'react';
import { ChatLayout } from './components/chat/ChatLayout.tsx';
import { Dashboard } from './components/dashboard/Dashboard.tsx';
import { AppShell } from './components/layout/AppShell.tsx';
import { useTheme } from './hooks/useTheme.ts';

export type AppView = 'dashboard' | 'conversations';

function App() {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [conversationSearch, setConversationSearch] = useState('');
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell
      activeView={activeView}
      onViewChange={setActiveView}
      conversationSearch={conversationSearch}
      onConversationSearchChange={setConversationSearch}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {activeView === 'dashboard' ? (
        <Dashboard />
      ) : (
        <ChatLayout searchQuery={conversationSearch} />
      )}
    </AppShell>
  );
}

export default App;
