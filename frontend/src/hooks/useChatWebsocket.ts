import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { ChatMessage, Conversation } from '../types/chat.ts';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:3000';
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

function readMessages(payload: unknown): ChatMessage[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }
  const body = payload as { messages?: ChatMessage[]; data?: { messages?: ChatMessage[] } };
  return body.messages ?? body.data?.messages ?? [];
}

export function useChatWebsocket(sessionId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const sessionIdRef = useRef(sessionId);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [incomingConversation, setIncomingConversation] =
    useState<Conversation | null>(null);

  sessionIdRef.current = sessionId;

  useEffect(() => {
    const socket = io(WS_URL);
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('newMessage', (message: ChatMessage) => {
      if (message.sessionId && message.sessionId !== sessionIdRef.current) {
        return;
      }
      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) {
          return current;
        }
        return [...current, message];
      });
    });
    socket.on('sessionJoined', (payload: { sessionId?: string; messages?: ChatMessage[] }) => {
      if (payload.sessionId && payload.sessionId !== sessionIdRef.current) {
        return;
      }
      setMessages(payload.messages ?? []);
    });
    socket.on('conversationUpserted', (conversation: Conversation) => {
      setIncomingConversation(conversation);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!sessionId) {
      setMessages([]);
      return;
    }

    void fetch(`${API_URL}/chat/sessions/${sessionId}/messages`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load messages');
        }
        return response.json() as Promise<ChatMessage[]>;
      })
      .then((data) => {
        if (sessionIdRef.current === sessionId) {
          setMessages(data);
        }
      })
      .catch(() => {
        if (sessionIdRef.current === sessionId) {
          setMessages([]);
        }
      });

    if (socket) {
      socket.emit('joinSession', sessionId, (response: unknown) => {
        const list = readMessages(response);
        if (list.length > 0 && sessionIdRef.current === sessionId) {
          setMessages(list);
        }
      });
    }
  }, [sessionId, connected]);

  const sendMessage = (content: string, role: ChatMessage['role'] = 'assistant') => {
    if (!sessionId || !socketRef.current) {
      return;
    }

    socketRef.current.emit('newMessage', { sessionId, role, content });
  };

  const toggleAi = (isAiActive: boolean) => {
    if (!sessionId || !socketRef.current) {
      return;
    }

    socketRef.current.emit('toggleAi', { sessionId, isAiActive });
  };

  return {
    connected,
    messages,
    incomingConversation,
    sendMessage,
    toggleAi,
  };
}
