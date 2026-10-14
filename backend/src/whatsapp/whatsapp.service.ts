import { Injectable, Logger } from '@nestjs/common';
import { MessageRole } from '@prisma/client';
import { AiService } from '../ai/ai.service.js';
import { ChatGateway } from '../chat/chat.gateway.js';
import { ChatService } from '../chat/chat.service.js';
import { WhatsappApiClient } from './whatsapp-api.client.js';
import type { WhatsappWebhookPayload } from './whatsapp.types.js';

const REPLY_QUIET_MS = 10_000;

type PendingReply = {
  timer: ReturnType<typeof setTimeout>;
  conversation: {
    id: string;
    phone: string;
    patientName: string;
    isAiActive: boolean;
  };
  messageId: string;
  generation: number;
};

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly pendingReplies = new Map<string, PendingReply>();
  private readonly replyGeneration = new Map<string, number>();

  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
    private readonly aiService: AiService,
    private readonly whatsappApi: WhatsappApiClient,
  ) {}

  async handleIncomingWebhook(payload: unknown): Promise<void> {
    const body = payload as WhatsappWebhookPayload;

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        for (const status of value?.statuses ?? []) {
          const error = status.errors?.[0];
          const detail = error
            ? ` error=${error.code ?? ''} ${error.title ?? error.message ?? ''}`.trimEnd()
            : '';
          this.logger.log(
            `WhatsApp status to=${status.recipient_id ?? '?'} status=${status.status ?? '?'} id=${status.id ?? '?'}${detail}`,
          );
        }
        if (!value?.messages?.length) {
          continue;
        }

        const nameByWaId = new Map(
          (value.contacts ?? [])
            .filter((contact) => contact.wa_id)
            .map((contact) => [contact.wa_id as string, contact.profile?.name]),
        );

        for (const incoming of value.messages) {
          if (incoming.type !== 'text' || !incoming.from || !incoming.text?.body) {
            this.logger.debug(
              `Skipping WhatsApp message type=${incoming.type ?? 'unknown'}`,
            );
            continue;
          }

          this.logger.log(
            `WhatsApp inbound from=${incoming.from} text="${incoming.text.body}"`,
          );

          const result = await this.chatService.ingestIncomingText({
            phone: incoming.from,
            name: nameByWaId.get(incoming.from),
            content: incoming.text.body,
            externalId: incoming.id,
          });

          this.chatGateway.notifyIncoming(result.conversation, result.message);

          if (result.isNew && result.conversation.isAiActive && incoming.id) {
            this.scheduleReply(result.conversation, incoming.id);
          }
        }
      }
    }
  }

  private scheduleReply(
    conversation: PendingReply['conversation'],
    messageId: string,
  ): void {
    const current = this.pendingReplies.get(conversation.id);
    if (current) {
      clearTimeout(current.timer);
    }

    const generation = (this.replyGeneration.get(conversation.id) ?? 0) + 1;
    this.replyGeneration.set(conversation.id, generation);
    this.chatGateway.notifyTyping(conversation.id, true);
    void this.whatsappApi.showTyping(messageId);

    const timer = setTimeout(() => {
      this.pendingReplies.delete(conversation.id);
      void this.replyWithAi(conversation, messageId, generation);
    }, REPLY_QUIET_MS);

    this.pendingReplies.set(conversation.id, {
      timer,
      conversation,
      messageId,
      generation,
    });
    this.logger.log(
      `WhatsApp reply queued session=${conversation.id} quiet=${REPLY_QUIET_MS}ms`,
    );
  }

  private async replyWithAi(
    conversation: {
      id: string;
      phone: string;
      patientName: string;
      isAiActive: boolean;
    },
    messageId: string,
    generation: number,
  ): Promise<void> {
    if (this.replyGeneration.get(conversation.id) !== generation) {
      return;
    }
    if (!(await this.chatService.isAiActive(conversation.id))) {
      this.chatGateway.notifyTyping(conversation.id, false);
      return;
    }

    await this.whatsappApi.showTyping(messageId);
    try {
      const reply = await this.aiService.replyToConversation({
        ...conversation,
        lastMessage: '',
      });
      if (this.replyGeneration.get(conversation.id) !== generation) {
        return;
      }
      const wamid = await this.whatsappApi.sendText(conversation.phone, reply);
      const saved = await this.chatService.createMessage(
        conversation.id,
        MessageRole.assistant,
        reply,
        wamid,
      );
      this.chatGateway.notifyIncoming(
        { ...conversation, lastMessage: reply },
        this.chatService.toChatMessage(saved),
      );
      this.chatGateway.notifyTyping(conversation.id, false);
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`AI reply failed: ${detail}`);
      const failed = await this.chatService.createMessage(
        conversation.id,
        MessageRole.system,
        `La IA no pudo responder. ${detail}`,
      );
      this.chatGateway.notifyIncoming(
        { ...conversation, lastMessage: failed.content },
        this.chatService.toChatMessage(failed),
      );
      if (this.replyGeneration.get(conversation.id) === generation) {
        this.chatGateway.notifyTyping(conversation.id, false);
      }
    }
  }
}
