import { Injectable } from '@nestjs/common';
import { MessageRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  findSessions() {
    return this.prisma.chatSession.findMany({
      include: { patient: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  findMessages(chatSessionId: string) {
    return this.prisma.message.findMany({
      where: { chatSessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  createMessage(chatSessionId: string, role: MessageRole, content: string) {
    return this.prisma.message.create({
      data: { chatSessionId, role, content },
    });
  }

  toggleAi(chatSessionId: string, isAiActive: boolean) {
    return this.prisma.chatSession.update({
      where: { id: chatSessionId },
      data: { isAiActive },
    });
  }
}
