import { useState } from 'react';
import { ChatLayout } from './components/chat/ChatLayout.tsx';
import { Dashboard } from './components/dashboard/Dashboard.tsx';
import { AppShell } from './components/layout/AppShell.tsx';

export type AppView = 'dashboard' | 'conversations';

function App() {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [conversationSearch, setConversationSearch] = useState('');

  return (
    <AppShell
      activeView={activeView}
      onViewChange={setActiveView}
      conversationSearch={conversationSearch}
      onConversationSearchChange={setConversationSearch}
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
