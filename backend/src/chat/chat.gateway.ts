import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service.js';

type SocketClient = {
  join: (room: string) => Promise<void> | void;
};

type SocketServer = {
  to: (room: string) => { emit: (event: string, payload: unknown) => void };
};

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: SocketServer;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinSession')
  async joinSession(
    @ConnectedSocket() client: SocketClient,
    @MessageBody() sessionId: string,
  ) {
    await client.join(sessionId);
    const messages = await this.chatService.findMessages(sessionId);
    return { event: 'sessionJoined', data: { sessionId, messages } };
  }

  @SubscribeMessage('newMessage')
  async newMessage(
    @MessageBody()
    payload: { sessionId: string; role: 'user' | 'assistant' | 'system'; content: string },
  ) {
    const message = await this.chatService.createMessage(
      payload.sessionId,
      payload.role,
      payload.content,
    );
    this.server.to(payload.sessionId).emit('newMessage', message);
    return message;
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
    return session;
  }
}
