import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { ChatMessage, Conversation, SessionActionResult } from '../types/chat.ts';

const WS_URL = import.meta.env.VITE_WS_URL || window.location.origin;
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

function readMessages(payload: unknown): ChatMessage[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }
  const body = payload as { messages?: ChatMessage[]; data?: { messages?: ChatMessage[] } };
  return body.messages ?? body.data?.messages ?? [];
}

const ACK_TIMEOUT_MS = 8000;

type SessionAction = 'resolveSession' | 'reopenSession' | 'clearAttention';

type ChatWebsocketOptions = {
  onConversationUpserted?: (conversation: Partial<Conversation> & { id: string }) => void;
};

function readActionResult(payload: unknown): SessionActionResult {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Respuesta inválida del servidor' };
  }
  const body = payload as { ok?: boolean; error?: string; id?: string };
  if (body.ok === false) {
    return { ok: false, error: body.error || 'No se pudo completar la acción' };
  }
  if (!body.id) {
    return { ok: false, error: 'Respuesta inválida del servidor' };
  }
  return { ok: true, conversation: payload as Conversation };
}

export function useChatWebsocket(sessionId?: string, options: ChatWebsocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const sessionIdRef = useRef(sessionId);
  const onUpsertedRef = useRef(options.onConversationUpserted);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [assistantTyping, setAssistantTyping] = useState(false);

  sessionIdRef.current = sessionId;

  useEffect(() => {
    onUpsertedRef.current = options.onConversationUpserted;
  });

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
    socket.on('conversationUpserted', (conversation: Partial<Conversation> & { id: string }) => {
      if (conversation?.id) {
        onUpsertedRef.current?.(conversation);
      }
    });
    socket.on('assistantTyping', (payload: { sessionId?: string; active?: boolean }) => {
      if (payload.sessionId && payload.sessionId !== sessionIdRef.current) {
        return;
      }
      setAssistantTyping(Boolean(payload.active));
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
      setAssistantTyping(false);
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

  const notifyTyping = () => {
    if (!sessionId || !socketRef.current) {
      return;
    }
    socketRef.current.emit('typing', { sessionId });
  };

  const toggleAi = (isAiActive: boolean) => {
    if (!sessionId || !socketRef.current) {
      return;
    }

    socketRef.current.emit('toggleAi', { sessionId, isAiActive });
  };

  const emitSessionAction = async (event: SessionAction): Promise<SessionActionResult> => {
    const socket = socketRef.current;
    if (!sessionId || !socket?.connected) {
      return { ok: false, error: 'Sin conexión con el servidor' };
    }
    try {
      const response: unknown = await socket
        .timeout(ACK_TIMEOUT_MS)
        .emitWithAck(event, { sessionId });
      return readActionResult(response);
    } catch {
      return { ok: false, error: 'Sin conexión con el servidor' };
    }
  };

  const resolveSession = () => emitSessionAction('resolveSession');
  const reopenSession = () => emitSessionAction('reopenSession');
  const clearAttention = () => emitSessionAction('clearAttention');

  return {
    connected,
    messages,
    assistantTyping,
    sendMessage,
    notifyTyping,
    toggleAi,
    resolveSession,
    reopenSession,
    clearAttention,
  };
}
