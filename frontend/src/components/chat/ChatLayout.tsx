import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useChatWebsocket } from '../../hooks/useChatWebsocket.ts';
import {
  conversationStatus,
  type Conversation,
  type ResolvedListStatus,
  type ResolvedPage,
  type SessionActionResult,
} from '../../types/chat.ts';
import {
  notificationsSupported,
  notifyAttention,
  playAttentionTone,
  unlockAudio,
} from '../../utils/attention.ts';
import {
  ChatSidebar,
  type ChatTab,
  type ConversationFilter,
  type NotificationPermissionState,
} from './ChatSidebar.tsx';
import { ChatWindow, type PendingAction } from './ChatWindow.tsx';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const RESOLVED_PAGE_SIZE = 50;
const ACTION_ERROR_MS = 5000;

type ChatLayoutProps = {
  searchQuery: string;
};

type ConversationPatch = Partial<Conversation> & { id: string };

type ListState = {
  byId: Record<string, Conversation>;
  openIds: string[];
  resolvedIds: string[];
  resolvedStatus: ResolvedListStatus;
  nextCursor: string | null;
};

type ListAction =
  | { type: 'loadOpen'; items: Conversation[] }
  | { type: 'resolvedLoading' }
  | { type: 'resolvedError' }
  | { type: 'loadResolved'; items: Conversation[]; nextCursor: string | null; append: boolean }
  | { type: 'upsert'; conversation: ConversationPatch };

const initialListState: ListState = {
  byId: {},
  openIds: [],
  resolvedIds: [],
  resolvedStatus: 'idle',
  nextCursor: null,
};

function without(ids: string[], id: string) {
  return ids.filter((item) => item !== id);
}

function mergeConversation(previous: Conversation | undefined, patch: ConversationPatch): Conversation {
  return {
    ...previous,
    ...patch,
    patientName: patch.patientName || previous?.patientName || '',
    phone: patch.phone || previous?.phone || '',
    lastMessage: patch.lastMessage ?? previous?.lastMessage ?? '',
    isAiActive: patch.isAiActive ?? previous?.isAiActive ?? true,
  };
}

function listReducer(state: ListState, action: ListAction): ListState {
  switch (action.type) {
    case 'loadOpen': {
      const byId = { ...state.byId };
      const loadedIds: string[] = [];
      for (const item of action.items) {
        byId[item.id] = mergeConversation(state.byId[item.id], item);
        if (conversationStatus(item) === 'open') {
          loadedIds.push(item.id);
        }
      }
      const loaded = new Set(loadedIds);
      return {
        ...state,
        byId,
        openIds: [...state.openIds.filter((id) => !loaded.has(id)), ...loadedIds],
      };
    }
    case 'resolvedLoading':
      return { ...state, resolvedStatus: 'loading' };
    case 'resolvedError':
      return { ...state, resolvedStatus: 'error' };
    case 'loadResolved': {
      const byId = { ...state.byId };
      const base = action.append ? state.resolvedIds : [];
      const present = new Set(base);
      const added: string[] = [];
      for (const item of action.items) {
        const known = state.byId[item.id];
        // Una conversación que ya sabemos reabierta no vuelve a resueltas por datos de una página vieja.
        if (known?.status === 'open') {
          continue;
        }
        byId[item.id] = mergeConversation(known, item);
        if (!present.has(item.id)) {
          present.add(item.id);
          added.push(item.id);
        }
      }
      return {
        ...state,
        byId,
        resolvedIds: [...base, ...added],
        resolvedStatus: 'loaded',
        nextCursor: action.nextCursor,
      };
    }
    case 'upsert': {
      const patch = action.conversation;
      const previous = state.byId[patch.id];
      if (!previous && !patch.phone) {
        return state;
      }
      const merged = mergeConversation(previous, patch);
      const byId = { ...state.byId, [patch.id]: merged };
      const status = patch.status ?? (previous ? undefined : 'open');

      if (status === 'resolved') {
        return {
          ...state,
          byId,
          openIds: without(state.openIds, patch.id),
          resolvedIds:
            state.resolvedStatus === 'loaded'
              ? [patch.id, ...without(state.resolvedIds, patch.id)]
              : without(state.resolvedIds, patch.id),
        };
      }

      if (status === 'open') {
        const inOpen = state.openIds.includes(patch.id);
        const messageChanged = previous?.lastMessage !== merged.lastMessage;
        return {
          ...state,
          byId,
          resolvedIds: without(state.resolvedIds, patch.id),
          openIds:
            inOpen && !messageChanged
              ? state.openIds
              : [patch.id, ...without(state.openIds, patch.id)],
        };
      }

      return { ...state, byId };
    }
  }
}

function readResolvedPage(payload: unknown): ResolvedPage {
  if (Array.isArray(payload)) {
    // Backend sin soporte de ?status: devuelve todas en un array.
    return {
      items: (payload as Conversation[]).filter((item) => item.status === 'resolved'),
      nextCursor: null,
    };
  }
  const page = payload as Partial<ResolvedPage> | null;
  return { items: page?.items ?? [], nextCursor: page?.nextCursor ?? null };
}

function initialPermission(): NotificationPermissionState {
  return notificationsSupported() ? Notification.permission : 'unsupported';
}

export function ChatLayout({ searchQuery }: ChatLayoutProps) {
  const [lists, dispatch] = useReducer(listReducer, initialListState);
  const [selectedId, setSelectedId] = useState<string>();
  const [tab, setTab] = useState<ChatTab>('active');
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const [mobileChatVisible, setMobileChatVisible] = useState(false);
  const [pending, setPending] = useState<{ sessionId: string; action: PendingAction } | null>(null);
  const [actionError, setActionError] = useState<{ sessionId: string; message: string } | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(initialPermission);

  const byIdRef = useRef(lists.byId);
  useEffect(() => {
    byIdRef.current = lists.byId;
  }, [lists.byId]);
  const attentionRef = useRef(new Map<string, boolean>());

  const seedAttention = (items: Conversation[]) => {
    for (const item of items) {
      if (item.needsAttention !== undefined && !attentionRef.current.has(item.id)) {
        attentionRef.current.set(item.id, item.needsAttention);
      }
    }
  };

  const handleUpserted = (conversation: ConversationPatch) => {
    if (conversation.needsAttention !== undefined) {
      const wasFlagged = attentionRef.current.get(conversation.id) ?? false;
      attentionRef.current.set(conversation.id, conversation.needsAttention);
      if (!wasFlagged && conversation.needsAttention) {
        playAttentionTone();
        notifyAttention({
          sessionId: conversation.id,
          patientName:
            conversation.patientName || byIdRef.current[conversation.id]?.patientName || 'Paciente',
          reason: conversation.attentionReason,
        });
      }
    }
    dispatch({ type: 'upsert', conversation });
    setSelectedId((current) => current ?? conversation.id);
  };

  const {
    connected,
    messages,
    assistantTyping,
    sendMessage,
    notifyTyping,
    toggleAi,
    resolveSession,
    reopenSession,
    clearAttention,
  } = useChatWebsocket(selectedId, { onConversationUpserted: handleUpserted });

  useEffect(() => {
    void fetch(`${API_URL}/chat/sessions`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load sessions');
        }
        return response.json() as Promise<Conversation[]>;
      })
      .then((data) => {
        seedAttention(data);
        dispatch({ type: 'loadOpen', items: data });
        setSelectedId((current) => current ?? data[0]?.id);
      })
      .catch(() => {
        dispatch({ type: 'loadOpen', items: [] });
      });
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => window.removeEventListener('pointerdown', unlockAudio);
  }, []);

  useEffect(() => {
    if (!actionError) {
      return;
    }
    const timer = window.setTimeout(() => setActionError(null), ACTION_ERROR_MS);
    return () => window.clearTimeout(timer);
  }, [actionError]);

  const fetchResolved = useCallback(async (cursor: string | null) => {
    dispatch({ type: 'resolvedLoading' });
    try {
      const params = new URLSearchParams({ status: 'resolved', limit: String(RESOLVED_PAGE_SIZE) });
      if (cursor) {
        params.set('cursor', cursor);
      }
      const response = await fetch(`${API_URL}/chat/sessions?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load resolved sessions');
      }
      const page = readResolvedPage(await response.json());
      seedAttention(page.items);
      dispatch({
        type: 'loadResolved',
        items: page.items,
        nextCursor: page.nextCursor,
        append: Boolean(cursor),
      });
    } catch {
      dispatch({ type: 'resolvedError' });
    }
  }, []);

  const handleTabChange = (next: ChatTab) => {
    setTab(next);
    if (next === 'resolved' && lists.resolvedStatus === 'idle') {
      void fetchResolved(null);
    }
  };

  const handleRetryResolved = () => {
    void fetchResolved(lists.resolvedIds.length > 0 ? lists.nextCursor : null);
  };

  const handleLoadMoreResolved = () => {
    if (lists.nextCursor && lists.resolvedStatus !== 'loading') {
      void fetchResolved(lists.nextCursor);
    }
  };

  const handleEnableNotifications = () => {
    unlockAudio();
    if (!notificationsSupported()) {
      return;
    }
    void Notification.requestPermission().then(setNotificationPermission);
  };

  const selected = selectedId ? lists.byId[selectedId] : undefined;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileChatVisible(true);
  };

  const handleToggleAi = (isAiActive: boolean) => {
    if (!selectedId) {
      return;
    }
    toggleAi(isAiActive);
    dispatch({ type: 'upsert', conversation: { id: selectedId, isAiActive } });
  };

  const runAction = async (action: PendingAction, run: () => Promise<SessionActionResult>) => {
    if (!selectedId || pending) {
      return;
    }
    const sessionId = selectedId;
    setPending({ sessionId, action });
    setActionError(null);
    const result = await run();
    setPending(null);
    if (result.ok) {
      handleUpserted(result.conversation);
    } else {
      setActionError({ sessionId, message: result.error });
    }
  };

  return (
    <div className="h-full min-h-0 min-w-0 overflow-hidden md:grid md:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[370px_minmax(0,1fr)]">
      <div
        className={`${mobileChatVisible ? 'hidden' : 'flex'} h-full min-h-0 min-w-0 w-full md:flex`}
      >
        <ChatSidebar
          openConversations={lists.openIds.map((id) => lists.byId[id])}
          resolvedConversations={lists.resolvedIds.map((id) => lists.byId[id])}
          resolvedStatus={lists.resolvedStatus}
          hasMoreResolved={Boolean(lists.nextCursor)}
          onLoadMoreResolved={handleLoadMoreResolved}
          onRetryResolved={handleRetryResolved}
          selectedId={selectedId}
          searchQuery={searchQuery}
          tab={tab}
          onTabChange={handleTabChange}
          filter={filter}
          onFilterChange={setFilter}
          onSelect={handleSelect}
          notificationPermission={notificationPermission}
          onEnableNotifications={handleEnableNotifications}
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
          onResolve={() => void runAction('resolve', resolveSession)}
          onReopen={() => void runAction('reopen', reopenSession)}
          onClearAttention={() => void runAction('clearAttention', clearAttention)}
          pendingAction={pending && pending.sessionId === selectedId ? pending.action : null}
          actionError={actionError && actionError.sessionId === selectedId ? actionError.message : null}
          onSend={sendMessage}
          onTyping={notifyTyping}
          assistantTyping={assistantTyping}
        />
      </div>
    </div>
  );
}
