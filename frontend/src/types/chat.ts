export type MessageRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  id: string;
  sessionId?: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  patientName: string;
  phone: string;
  lastMessage: string;
  isAiActive: boolean;
};
