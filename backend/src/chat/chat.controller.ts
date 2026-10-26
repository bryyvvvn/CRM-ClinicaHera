import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service.js';

const DEFAULT_RESOLVED_LIMIT = 50;
const MAX_RESOLVED_LIMIT = 100;

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  listSessions(
    @Query('status') status?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    if (!status || status === 'open') {
      return this.chatService.listConversations();
    }
    if (status !== 'resolved') {
      throw new BadRequestException('status debe ser open o resolved');
    }
    const parsed = Number.parseInt(limit ?? '', 10);
    const take = Number.isNaN(parsed)
      ? DEFAULT_RESOLVED_LIMIT
      : Math.min(Math.max(parsed, 1), MAX_RESOLVED_LIMIT);
    return this.chatService.listResolvedConversations({
      cursor: cursor || undefined,
      limit: take,
    });
  }

  @Get('sessions/:id/messages')
  listMessages(@Param('id') id: string) {
    return this.chatService.listMessages(id);
  }
}
