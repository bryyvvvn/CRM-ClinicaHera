import { Injectable, Logger } from '@nestjs/common';
import { ChatStatus, MessageRole } from '@prisma/client';
import { AI_FALLBACK_REPLY, AiService } from '../ai/ai.service.js';
import { ChatGateway } from '../chat/chat.gateway.js';
import { ChatService } from '../chat/chat.service.js';
import type { ConversationDto } from '../chat/chat.types.js';
import { WhatsappApiClient } from './whatsapp-api.client.js';
import type { WhatsappWebhookPayload } from './whatsapp.types.js';

const REPLY_QUIET_MS = 6_000;
const HUMAN_HANDOFF_REPLY =
  'Te dejo con el equipo de la clínica. Una persona te va a escribir por aquí.';

type PendingReply = {
  timer: ReturnType<typeof setTimeout>;
  conversation: ConversationDto;
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

          if (
            result.isNew &&
            result.conversation.isAiActive &&
            wantsHuman(incoming.text.body)
          ) {
            await this.handOffToHuman(result.conversation);
            continue;
          }

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
    conversation: ConversationDto,
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
    if ((await this.chatService.getSessionStatus(conversation.id)) === ChatStatus.resolved) {
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
      if ((await this.chatService.getSessionStatus(conversation.id)) === ChatStatus.resolved) {
        this.chatGateway.notifyTyping(conversation.id, false);
        return;
      }
      const wamid = await this.whatsappApi.sendText(conversation.phone, reply);
      const saved = await this.chatService.createMessage(
        conversation.id,
        MessageRole.assistant,
        reply,
        wamid,
      );
      if (
        reply === AI_FALLBACK_REPLY &&
        (await this.chatService.getSessionStatus(conversation.id)) === ChatStatus.open
      ) {
        await this.chatService.markAttention(conversation.id, 'El bot no pudo completar una acción');
        await this.publishSummary(conversation.id);
      }
      this.chatGateway.notifyIncoming(
        (await this.chatService.getConversation(conversation.id)) ??
          conversation,
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
      if ((await this.chatService.getSessionStatus(conversation.id)) === ChatStatus.open) {
        await this.chatService.markAttention(conversation.id, 'La IA no pudo responder');
        await this.publishSummary(conversation.id);
      }
      this.chatGateway.notifyIncoming(
        (await this.chatService.getConversation(conversation.id)) ??
          conversation,
        this.chatService.toChatMessage(failed),
      );
      if (this.replyGeneration.get(conversation.id) === generation) {
        this.chatGateway.notifyTyping(conversation.id, false);
      }
    }
  }

  private async handOffToHuman(conversation: ConversationDto): Promise<void> {
    this.cancelPendingReply(conversation.id);
    await this.chatService.toggleAi(conversation.id, false);
    if ((await this.chatService.getSessionStatus(conversation.id)) === ChatStatus.open) {
      await this.chatService.markAttention(conversation.id, 'Pidió hablar con una persona');
    }
    try {
      const wamid = await this.whatsappApi.sendText(conversation.phone, HUMAN_HANDOFF_REPLY);
      const saved = await this.chatService.createMessage(
        conversation.id,
        MessageRole.assistant,
        HUMAN_HANDOFF_REPLY,
        wamid,
      );
      await this.publishSummary(conversation.id);
      this.chatGateway.notifyIncoming(
        (await this.chatService.getConversation(conversation.id)) ?? conversation,
        this.chatService.toChatMessage(saved),
      );
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Human handoff reply failed: ${detail}`);
      const failed = await this.chatService.createMessage(
        conversation.id,
        MessageRole.system,
        `No se pudo avisar por WhatsApp que la conversación pasó a una persona. ${detail}`,
      );
      await this.publishSummary(conversation.id);
      this.chatGateway.notifyIncoming(
        (await this.chatService.getConversation(conversation.id)) ?? conversation,
        this.chatService.toChatMessage(failed),
      );
    }
    this.chatGateway.notifyTyping(conversation.id, false);
  }

  private cancelPendingReply(sessionId: string): void {
    const pending = this.pendingReplies.get(sessionId);
    if (pending) {
      clearTimeout(pending.timer);
      this.pendingReplies.delete(sessionId);
    }
    const generation = (this.replyGeneration.get(sessionId) ?? 0) + 1;
    this.replyGeneration.set(sessionId, generation);
  }

  private async publishSummary(sessionId: string): Promise<void> {
    try {
      await this.aiService.ensureHandoffSummary(sessionId);
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`Handoff summary failed session=${sessionId}: ${detail}`);
    }
  }
}

function wantsHuman(text: string): boolean {
  const folded = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (/\botra persona\b/.test(folded) && !/\b(hablar con|pasame con|derivame|secretaria|recepcion)\b/.test(folded)) {
    return false;
  }
  return [
    /\bhablar con (una |un )?(persona|alguien|secretaria|recepcion|humano|humana|ejecutiv\w*|operador\w*)\b/,
    /\b(quiero|necesito|prefiero|ocupo) (una |un )?(persona|humano|humana|secretaria|recepcion)\b/,
    /\b(pasame|comunicame|derivame) con (una |un )?(persona|alguien|secretaria|recepcion|humano|humana|ejecutiv\w*|operador\w*)\b/,
    /\b(derivame|derivenme)\b/,
    /\batencion humana\b/,
    /\b(persona|alguien) (real|de verdad)\b/,
    /\bno (quiero|ocupo) (hablar con )?(el |la |este |un )?(bot|robot|ia)\b/,
    /\b(que me atienda|me atienda|atenderme|atender) (una |un )?(persona|alguien|humano|secretaria|recepcion)\b/,
    /\bcon (una persona|alguien de la clinica|la secretaria|recepcion)\b/,
  ].some((pattern) => pattern.test(folded));
}
