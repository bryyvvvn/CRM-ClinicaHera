import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ChatGateway } from '../chat/chat.gateway.js';
import { ChatService } from '../chat/chat.service.js';
import { AiService } from './ai.service.js';

type ExecuteToolBody = {
  name: string;
  arguments?: Record<string, unknown>;
  celular?: string;
};

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(
    private readonly aiService: AiService,
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get('tools')
  listTools() {
    return this.aiService.listTools();
  }

  @Post('tools/execute')
  execute(@Body() body: ExecuteToolBody) {
    return this.aiService.executeTool(
      { name: body.name, arguments: body.arguments },
      { celular: body.celular },
    );
  }

  @Get('sessions/:id/summary')
  async summary(@Param('id') id: string) {
    try {
      const summary = await this.aiService.ensureHandoffSummary(id);
      const conversation = await this.chatService.getConversation(id);
      if (summary) {
        this.chatGateway.notifyConversation(id);
      }
      return {
        summary,
        handoffSummaryAt: conversation?.handoffSummaryAt ?? null,
      };
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`Handoff summary failed session=${id}: ${detail}`);
      return { summary: null, handoffSummaryAt: null };
    }
  }

  @Post('complete')
  complete(@Body() body: { message?: string; celular?: string }) {
    const message = body.message?.trim();
    if (!message) {
      return { error: 'Falta message' };
    }
    return this.aiService
      .complete(message, { celular: body.celular })
      .then((reply) => ({ reply }));
  }
}
