import { useEffect, useState } from 'react';
import { useChatWebsocket } from '../../hooks/useChatWebsocket.ts';
import type { Conversation } from '../../types/chat.ts';
import { ChatSidebar, type ConversationFilter } from './ChatSidebar.tsx';
import { ChatWindow } from './ChatWindow.tsx';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

type ChatLayoutProps = {
  searchQuery: string;
};

export function ChatLayout({ searchQuery }: ChatLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const [mobileChatVisible, setMobileChatVisible] = useState(false);
  const { connected, messages, incomingConversation, sendMessage, toggleAi } =
    useChatWebsocket(selectedId);

  useEffect(() => {
    void fetch(`${API_URL}/chat/sessions`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load sessions');
        }
        return response.json() as Promise<Conversation[]>;
      })
      .then((data) => {
        setConversations(data);
        setSelectedId((current) => current ?? data[0]?.id);
      })
      .catch(() => {
        setConversations([]);
      });
  }, []);

  useEffect(() => {
    if (!incomingConversation?.id) {
      return;
    }

    setConversations((current) => {
      const index = current.findIndex((item) => item.id === incomingConversation.id);
      if (index >= 0) {
        const next = [...current];
        next[index] = {
          ...next[index],
          ...incomingConversation,
          patientName: incomingConversation.patientName || next[index].patientName,
          phone: incomingConversation.phone || next[index].phone,
        };
        const [updated] = next.splice(index, 1);
        return [updated, ...next];
      }
      if (!incomingConversation.phone) {
        return current;
      }
      return [incomingConversation, ...current];
    });

    setSelectedId((current) => current ?? incomingConversation.id);
  }, [incomingConversation]);

  const selected = conversations.find((item) => item.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileChatVisible(true);
  };

  const handleToggleAi = (isAiActive: boolean) => {
    if (!selectedId) {
      return;
    }
    toggleAi(isAiActive);
    setConversations((current) =>
      current.map((item) => (item.id === selectedId ? { ...item, isAiActive } : item)),
    );
  };

  return (
    <div className="h-full min-h-0 min-w-0 overflow-hidden md:grid md:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[370px_minmax(0,1fr)]">
      <div
        className={`${mobileChatVisible ? 'hidden' : 'flex'} h-full min-h-0 min-w-0 w-full md:flex`}
      >
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedId}
          searchQuery={searchQuery}
          filter={filter}
          onFilterChange={setFilter}
          onSelect={handleSelect}
        />
      </div>
      <div
        className={`${mobileChatVisible ? 'flex' : 'hidden'} h-full min-h-0 min-w-0 w-full overflow-hidden md:flex`}
      >
        <ChatWindow
          conversation={selected}
          messages={messages}
          connected={connected}
          onBack={() => setMobileChatVisible(false)}
          onToggleAi={handleToggleAi}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}
