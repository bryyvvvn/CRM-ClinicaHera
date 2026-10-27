import { Injectable } from '@nestjs/common';
import {
  ChatStatus,
  MessageRole,
  type ChatSession,
  type Message,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  ChatMessageDto,
  ConversationDto,
  ConversationPage,
  HandoffSource,
  SessionActionResult,
} from './chat.types.js';

const SESSION_NOT_FOUND = 'Sesión no encontrada';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async listConversations(): Promise<ConversationDto[]> {
    const sessions = await this.prisma.chatSession.findMany({
      where: { status: ChatStatus.open },
      include: {
        patient: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return sessions.map((session) =>
      this.toConversation(
        session,
        session.patient,
        session.messages[0]?.content ?? '',
      ),
    );
  }

  async listResolvedConversations(input: {
    cursor?: string;
    limit: number;
  }): Promise<ConversationPage> {
    const sessions = await this.prisma.chatSession.findMany({
      where: { status: ChatStatus.resolved },
      include: {
        patient: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: [{ resolvedAt: 'desc' }, { id: 'desc' }],
      take: input.limit + 1,
      ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
    });

    const hasMore = sessions.length > input.limit;
    const page = hasMore ? sessions.slice(0, input.limit) : sessions;
    return {
      items: page.map((session) =>
        this.toConversation(
          session,
          session.patient,
          session.messages[0]?.content ?? '',
        ),
      ),
      nextCursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
    };
  }

  async getConversation(sessionId: string): Promise<ConversationDto | null> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        patient: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!session) {
      return null;
    }
    return this.toConversation(
      session,
      session.patient,
      session.messages[0]?.content ?? '',
    );
  }

  async resolveSession(
    sessionId: string,
  ): Promise<SessionActionResult<ChatSession>> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return { ok: false, error: SESSION_NOT_FOUND };
    }
    if (session.status === ChatStatus.resolved) {
      return { ok: true, session };
    }
    const updated = await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        status: ChatStatus.resolved,
        resolvedAt: new Date(),
        needsAttention: false,
        attentionReason: null,
        attentionAt: null,
        handoffSummary: null,
        handoffSummaryAt: null,
      },
    });
    return { ok: true, session: updated };
  }

  async reopenSession(
    sessionId: string,
    options: { porPaciente: boolean },
  ): Promise<SessionActionResult<ChatSession>> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return { ok: false, error: SESSION_NOT_FOUND };
    }
    if (session.status === ChatStatus.open) {
      return { ok: true, session };
    }
    const updated = await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        status: ChatStatus.open,
        ...(options.porPaciente
          ? { isAiActive: true, contextStartAt: session.resolvedAt }
          : {}),
      },
    });
    return { ok: true, session: updated };
  }

  async markAttention(
    sessionId: string,
    reason: string,
  ): Promise<SessionActionResult<ChatSession>> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return { ok: false, error: SESSION_NOT_FOUND };
    }
    const updated = await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        needsAttention: true,
        attentionReason: reason,
        attentionAt: new Date(),
      },
    });
    return { ok: true, session: updated };
  }

  async clearAttention(
    sessionId: string,
  ): Promise<SessionActionResult<ChatSession>> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return { ok: false, error: SESSION_NOT_FOUND };
    }
    if (
      !session.needsAttention &&
      !session.attentionReason &&
      !session.attentionAt &&
      !session.handoffSummary &&
      !session.handoffSummaryAt
    ) {
      return { ok: true, session };
    }
    const updated = await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        needsAttention: false,
        attentionReason: null,
        attentionAt: null,
        handoffSummary: null,
        handoffSummaryAt: null,
      },
    });
    return { ok: true, session: updated };
  }

  async getSessionStatus(sessionId: string): Promise<ChatStatus | null> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { status: true },
    });
    return session?.status ?? null;
  }

  async summarySource(sessionId: string): Promise<HandoffSource | null> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: {
        isAiActive: true,
        needsAttention: true,
        handoffSummary: true,
        handoffSummaryAt: true,
      },
    });
    if (!session) {
      return null;
    }
    const recent = await this.prisma.message.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { createdAt: 'desc' },
      take: 40,
    });
    const messages = recent.reverse().map((message) => ({
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    }));
    const latest = messages.at(-1);
    const fresh =
      Boolean(session.handoffSummary) &&
      session.handoffSummaryAt != null &&
      latest != null &&
      latest.createdAt.getTime() <= session.handoffSummaryAt.getTime();
    return {
      needsAttention: session.needsAttention,
      isAiActive: session.isAiActive,
      handoffSummary: session.handoffSummary,
      fresh,
      messages,
    };
  }

  saveHandoffSummary(sessionId: string, summary: string, through: Date) {
    return this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { handoffSummary: summary, handoffSummaryAt: through },
    });
  }

  findMessages(chatSessionId: string) {
    return this.prisma.message.findMany({
      where: { chatSessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findMessagesForAi(chatSessionId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: chatSessionId },
      select: { contextStartAt: true },
    });
    const contextStartAt = session?.contextStartAt;
    return this.prisma.message.findMany({
      where: {
        chatSessionId,
        ...(contextStartAt ? { createdAt: { gt: contextStartAt } } : {}),
      },
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

  async isAiActive(sessionId: string): Promise<boolean> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    return session?.isAiActive ?? false;
  }

  async latestInboundExternalId(sessionId: string): Promise<string | null> {
    const message = await this.prisma.message.findFirst({
      where: {
        chatSessionId: sessionId,
        role: MessageRole.user,
        externalId: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    });
    return message?.externalId ?? null;
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
    } else if (session.status === ChatStatus.resolved) {
      const reopened = await this.reopenSession(session.id, {
        porPaciente: true,
      });
      if (reopened.ok) {
        session = reopened.session;
      }
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
    session: ChatSession,
    patient: { name: string; phone: string },
    lastMessage: string,
  ): ConversationDto {
    return {
      id: session.id,
      patientName: patient.name,
      phone: patient.phone,
      lastMessage,
      isAiActive: session.isAiActive,
      status: session.status,
      resolvedAt: session.resolvedAt?.toISOString() ?? null,
      needsAttention: session.needsAttention,
      attentionReason: session.attentionReason,
      attentionAt: session.attentionAt?.toISOString() ?? null,
      handoffSummary: session.handoffSummary,
      handoffSummaryAt: session.handoffSummaryAt?.toISOString() ?? null,
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
