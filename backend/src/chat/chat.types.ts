export type ConversationDto = {
  id: string;
  patientName: string;
  phone: string;
  lastMessage: string;
  isAiActive: boolean;
  status: 'open' | 'resolved';
  resolvedAt: string | null;
  needsAttention: boolean;
  attentionReason: string | null;
  attentionAt: string | null;
};

export type ConversationPage = {
  items: ConversationDto[];
  nextCursor: string | null;
};

export type SessionActionResult<T> =
  { ok: true; session: T } | { ok: false; error: string };

export type ChatMessageDto = {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
};
