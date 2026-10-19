import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageRole } from '@prisma/client';
import { WhatsappApiClient } from '../whatsapp/whatsapp-api.client.js';
import { ChatService } from './chat.service.js';
import type { ChatMessageDto, ConversationDto } from './chat.types.js';

type SocketClient = {
  id: string;
  rooms?: Set<string> | Iterable<string>;
  join: (room: string) => Promise<void> | void;
  leave: (room: string) => Promise<void> | void;
  emit: (event: string, payload: unknown) => void;
};

type SocketServer = {
  emit: (event: string, payload: unknown) => void;
  to: (room: string) => { emit: (event: string, payload: unknown) => void };
};

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL?.split(',') ?? [
      'http://localhost:5173',
      'http://localhost:5174',
    ],
  },
})
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: SocketServer;

  constructor(
    private readonly chatService: ChatService,
    private readonly whatsappApi: WhatsappApiClient,
  ) {}

  notifyIncoming(conversation: ConversationDto, message: ChatMessageDto): void {
    this.server.emit('conversationUpserted', conversation);
    this.server.to(conversation.id).emit('newMessage', message);
  }

  notifyTyping(sessionId: string, active: boolean): void {
    this.server.emit('assistantTyping', { sessionId, active });
  }

  @SubscribeMessage('joinSession')
  async joinSession(
    @ConnectedSocket() client: SocketClient,
    @MessageBody() sessionId: string,
  ) {
    for (const room of client.rooms ?? []) {
      if (room !== client.id && room !== sessionId) {
        await client.leave(room);
      }
    }
    await client.join(sessionId);
    const messages = await this.chatService.listMessages(sessionId);
    client.emit('sessionJoined', { sessionId, messages });
    return { sessionId, messages };
  }

  @SubscribeMessage('newMessage')
  async newMessage(
    @MessageBody()
    payload: { sessionId: string; role: 'user' | 'assistant' | 'system'; content: string },
  ) {
    if (payload.role === 'assistant') {
      try {
        const phone = await this.chatService.getPatientPhone(payload.sessionId);
        if (!phone) {
          throw new Error('La sesión no tiene un teléfono de paciente');
        }
        const wamid = await this.whatsappApi.sendText(phone, payload.content);
        const saved = await this.chatService.createMessage(
          payload.sessionId,
          MessageRole.assistant,
          payload.content,
          wamid,
        );
        const dto = this.chatService.toChatMessage(saved);
        this.server.to(payload.sessionId).emit('newMessage', dto);
        return dto;
      } catch (error) {
        const detail = error instanceof Error ? error.message : 'Error desconocido';
        this.logger.error(detail);
        const failed = await this.chatService.createMessage(
          payload.sessionId,
          MessageRole.system,
          `No se pudo enviar a WhatsApp. ${detail}`,
        );
        const dto = this.chatService.toChatMessage(failed);
        this.server.to(payload.sessionId).emit('newMessage', dto);
        return dto;
      }
    }

    const saved = await this.chatService.createMessage(
      payload.sessionId,
      payload.role,
      payload.content,
    );
    const dto = this.chatService.toChatMessage(saved);
    this.server.to(payload.sessionId).emit('newMessage', dto);
    return dto;
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody() payload: { sessionId: string }) {
    const messageId = await this.chatService.latestInboundExternalId(payload.sessionId);
    if (!messageId) {
      return { ok: false };
    }
    await this.whatsappApi.showTyping(messageId);
    return { ok: true };
  }

  @SubscribeMessage('toggleAi')
  async toggleAi(
    @MessageBody() payload: { sessionId: string; isAiActive: boolean },
  ) {
    const session = await this.chatService.toggleAi(
      payload.sessionId,
      payload.isAiActive,
    );
    this.server.to(payload.sessionId).emit('aiToggled', session);
    this.server.emit('conversationUpserted', {
      id: session.id,
      isAiActive: session.isAiActive,
    });
    return session;
  }
}
