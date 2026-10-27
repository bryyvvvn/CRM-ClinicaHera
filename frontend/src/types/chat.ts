export type MessageRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  id: string;
  sessionId?: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type ConversationStatus = 'open' | 'resolved';

export type Conversation = {
  id: string;
  patientName: string;
  phone: string;
  lastMessage: string;
  isAiActive: boolean;
  status?: ConversationStatus;
  resolvedAt?: string | null;
  needsAttention?: boolean;
  attentionReason?: string | null;
  attentionAt?: string | null;
  handoffSummary?: string | null;
  handoffSummaryAt?: string | null;
};

export type ResolvedListStatus = 'idle' | 'loading' | 'loaded' | 'error';

export type ResolvedPage = {
  items: Conversation[];
  nextCursor: string | null;
};

export type SessionActionResult =
  | { ok: true; conversation: Conversation }
  | { ok: false; error: string };

/** Un backend sin estado (anterior a la fase A) se trata como conversación abierta. */
export function conversationStatus(conversation: Pick<Conversation, 'status'>): ConversationStatus {
  return conversation.status ?? 'open';
}
