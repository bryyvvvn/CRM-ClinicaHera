import { Injectable } from '@nestjs/common';
import { MessageRole, type Message } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ChatMessageDto, ConversationDto } from './chat.types.js';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async listConversations(): Promise<ConversationDto[]> {
    const sessions = await this.prisma.chatSession.findMany({
      include: {
        patient: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return sessions.map((session) => ({
      id: session.id,
      patientName: session.patient.name,
      phone: session.patient.phone,
      lastMessage: session.messages[0]?.content ?? '',
      isAiActive: session.isAiActive,
    }));
  }

  findMessages(chatSessionId: string) {
    return this.prisma.message.findMany({
      where: { chatSessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async listMessages(chatSessionId: string): Promise<ChatMessageDto[]> {
    const messages = await this.findMessages(chatSessionId);
    return messages.map((message) => this.toMessageDto(message));
  }

  async createMessage(
    chatSessionId: string,
    role: MessageRole,
    content: string,
    externalId?: string,
  ) {
    const message = await this.prisma.message.create({
      data: { chatSessionId, role, content, externalId },
    });
    await this.prisma.chatSession.update({
      where: { id: chatSessionId },
      data: { updatedAt: new Date() },
    });
    return message;
  }

  async getPatientPhone(sessionId: string): Promise<string | null> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { patient: true },
    });
    return session?.patient.phone ?? null;
  }

  toChatMessage(message: Message): ChatMessageDto {
    return this.toMessageDto(message);
  }

  toggleAi(chatSessionId: string, isAiActive: boolean) {
    return this.prisma.chatSession.update({
      where: { id: chatSessionId },
      data: { isAiActive },
    });
  }

  async ingestIncomingText(input: {
    phone: string;
    name?: string;
    content: string;
    externalId?: string;
  }): Promise<{
    conversation: ConversationDto;
    message: ChatMessageDto;
    isNew: boolean;
  }> {
    if (input.externalId) {
      const existing = await this.prisma.message.findUnique({
        where: { externalId: input.externalId },
        include: { chatSession: { include: { patient: true } } },
      });
      if (existing) {
        return {
          conversation: this.toConversation(
            existing.chatSession,
            existing.chatSession.patient,
            existing.content,
          ),
          message: this.toMessageDto(existing),
          isNew: false,
        };
      }
    }

    const patient = await this.prisma.patient.upsert({
      where: { phone: input.phone },
      create: { phone: input.phone, name: input.name?.trim() || input.phone },
      update: input.name?.trim() ? { name: input.name.trim() } : {},
    });

    let session = await this.prisma.chatSession.findFirst({
      where: { patientId: patient.id },
      orderBy: { updatedAt: 'desc' },
    });

    if (!session) {
      session = await this.prisma.chatSession.create({
        data: { patientId: patient.id },
      });
    }

    const message = await this.createMessage(
      session.id,
      MessageRole.user,
      input.content,
      input.externalId,
    );

    return {
      conversation: this.toConversation(session, patient, message.content),
      message: this.toMessageDto(message),
      isNew: true,
    };
  }

  private toConversation(
    session: { id: string; isAiActive: boolean },
    patient: { name: string; phone: string },
    lastMessage: string,
  ): ConversationDto {
    return {
      id: session.id,
      patientName: patient.name,
      phone: patient.phone,
      lastMessage,
      isAiActive: session.isAiActive,
    };
  }

  private toMessageDto(message: Message): ChatMessageDto {
    return {
      id: message.id,
      sessionId: message.chatSessionId,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    };
  }
}
