import { Body, Controller, Get, Post } from '@nestjs/common';
import { AiService } from './ai.service.js';

type ExecuteToolBody = {
  name: string;
  arguments?: Record<string, unknown>;
  celular?: string;
};

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

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
