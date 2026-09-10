import { useMemo, useState } from 'react';
import { useChatWebsocket } from '../../hooks/useChatWebsocket.ts';
import type { ChatMessage, Conversation } from '../../types/chat.ts';
import { ChatSidebar } from './ChatSidebar.tsx';
import { ChatWindow } from './ChatWindow.tsx';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'session-1',
    patientName: 'Ana Pérez',
    phone: '+56 9 1111 1111',
    lastMessage: 'Quisiera agendar una hora para control.',
    isAiActive: true,
  },
  {
    id: 'session-2',
    patientName: 'Luis Soto',
    phone: '+56 9 2222 2222',
    lastMessage: '¿Tienen disponibilidad el viernes?',
    isAiActive: false,
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'session-1': [
    {
      id: 'm1',
      role: 'user',
      content: 'Hola, quisiera agendar una hora para control.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'm2',
      role: 'assistant',
      content: 'Claro, ¿prefieres mañana o el viernes por la tarde?',
      createdAt: new Date().toISOString(),
    },
  ],
  'session-2': [
    {
      id: 'm3',
      role: 'system',
      content: 'IA pausada. Un agente humano asumió el control.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'm4',
      role: 'user',
      content: '¿Tienen disponibilidad el viernes?',
      createdAt: new Date().toISOString(),
    },
  ],
};

export function ChatLayout() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState(MOCK_CONVERSATIONS[0]?.id);
  const { connected, messages, sendMessage, toggleAi } =
    useChatWebsocket(selectedId);

  const selected = conversations.find((item) => item.id === selectedId);

  const visibleMessages = useMemo(() => {
    if (messages.length > 0) {
      return messages;
    }
    return selectedId ? (MOCK_MESSAGES[selectedId] ?? []) : [];
  }, [messages, selectedId]);

  const handleToggleAi = (isAiActive: boolean) => {
    if (!selectedId) {
      return;
    }
    toggleAi(isAiActive);
    setConversations((current) =>
      current.map((item) =>
        item.id === selectedId ? { ...item, isAiActive } : item,
      ),
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <ChatSidebar
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ChatWindow
        conversation={selected}
        messages={visibleMessages}
        connected={connected}
        onToggleAi={handleToggleAi}
        onSend={sendMessage}
      />
    </div>
  );
}
