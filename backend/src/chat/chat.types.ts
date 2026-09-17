export type ConversationDto = {
  id: string;
  patientName: string;
  phone: string;
  lastMessage: string;
  isAiActive: boolean;
};

export type ChatMessageDto = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
};
