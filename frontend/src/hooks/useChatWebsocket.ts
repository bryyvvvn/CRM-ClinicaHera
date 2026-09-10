import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { ChatMessage } from '../types/chat.ts';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:3000';

export function useChatWebsocket(sessionId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = io(WS_URL);
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('newMessage', (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!sessionId || !socket) {
      return;
    }

    socket.emit(
      'joinSession',
      sessionId,
      (response: { data?: { messages?: ChatMessage[] } }) => {
        setMessages(response?.data?.messages ?? []);
      },
    );
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

  return { connected, messages, sendMessage, toggleAi };
}
