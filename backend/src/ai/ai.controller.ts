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
}
