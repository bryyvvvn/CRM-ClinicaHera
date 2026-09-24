import { useEffect, useState } from 'react';
import { useChatWebsocket } from '../../hooks/useChatWebsocket.ts';
import type { Conversation } from '../../types/chat.ts';
import { ChatSidebar } from './ChatSidebar.tsx';
import { ChatWindow } from './ChatWindow.tsx';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export function ChatLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
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
          patientName:
            incomingConversation.patientName || next[index].patientName,
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
        messages={messages}
        connected={connected}
        onToggleAi={handleToggleAi}
        onSend={sendMessage}
      />
    </div>
  );
}
