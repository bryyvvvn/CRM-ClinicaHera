import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AiToolDefinition } from './ai.tools.js';

export type DeepseekChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string | null;
  tool_call_id?: string;
  tool_calls?: DeepseekToolCall[];
};

export type DeepseekToolCall = {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
};

type DeepseekCompletion = {
  choices?: Array<{
    finish_reason?: string;
    message?: {
      content?: string | null;
      tool_calls?: DeepseekToolCall[];
    };
  }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string };
};

export type DeepseekTurn = {
  content: string;
  toolCalls: DeepseekToolCall[];
  assistantMessage: DeepseekChatMessage;
};

@Injectable()
export class DeepseekClient {
  private readonly logger = new Logger(DeepseekClient.name);

  constructor(private readonly configService: ConfigService) {}

  async chat(messages: DeepseekChatMessage[]): Promise<string> {
    const turn = await this.completeTurn(messages);
    if (!turn.content) {
      throw new HttpException('DeepSeek devolvió una respuesta vacía', 502);
    }
    return turn.content;
  }

  async completeTurn(
    messages: DeepseekChatMessage[],
    tools?: AiToolDefinition[],
  ): Promise<DeepseekTurn> {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY')?.trim();
    const baseUrl = (
      this.configService.get<string>('DEEPSEEK_BASE_URL') ??
      'https://api.deepseek.com'
    ).replace(/\/$/, '');
    const model =
      this.configService.get<string>('DEEPSEEK_MODEL')?.trim() || 'deepseek-flash';

    if (!apiKey) {
      throw new HttpException('Falta DEEPSEEK_API_KEY en el .env', 500);
    }

    const payload = await this.requestCompletion(
      baseUrl,
      apiKey,
      model,
      messages,
      tools,
      true,
    );
    const message = payload.choices?.[0]?.message;
    const toolCalls = message?.tool_calls ?? [];
    const content = message?.content?.trim() ?? '';

    this.logger.log(
      `DeepSeek ok model=${model} tools=${toolCalls.length} in=${payload.usage?.prompt_tokens ?? '?'} out=${payload.usage?.completion_tokens ?? '?'}`,
    );

    return {
      content,
      toolCalls,
      assistantMessage: {
        role: 'assistant',
        content: message?.content ?? null,
        tool_calls: toolCalls.length ? toolCalls : undefined,
      },
    };
  }

  private async requestCompletion(
    baseUrl: string,
    apiKey: string,
    model: string,
    messages: DeepseekChatMessage[],
    tools: AiToolDefinition[] | undefined,
    disableThinking: boolean,
  ): Promise<DeepseekCompletion> {
    const body: Record<string, unknown> = {
      model,
      messages,
      stream: false,
    };
    if (tools?.length) {
      body.tools = tools;
      body.tool_choice = 'auto';
    }
    if (disableThinking) {
      body.thinking = { type: 'disabled' };
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const payload = (await response.json()) as DeepseekCompletion;

    if (!response.ok && disableThinking) {
      this.logger.warn(
        `DeepSeek rejected thinking=disabled (${payload.error?.message ?? response.statusText}); retrying`,
      );
      return this.requestCompletion(
        baseUrl,
        apiKey,
        model,
        messages,
        tools,
        false,
      );
    }

    if (!response.ok) {
      const detail = payload.error?.message ?? response.statusText;
      this.logger.error(`DeepSeek chat failed: ${detail}`);
      throw new HttpException(`DeepSeek no respondió: ${detail}`, 502);
    }

    return payload;
  }
}
