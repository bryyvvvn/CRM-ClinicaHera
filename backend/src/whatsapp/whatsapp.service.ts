import { Injectable, Logger } from '@nestjs/common';
import { ChatGateway } from '../chat/chat.gateway.js';
import { ChatService } from '../chat/chat.service.js';
import type { WhatsappWebhookPayload } from './whatsapp.types.js';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  async handleIncomingWebhook(payload: unknown): Promise<void> {
    const body = payload as WhatsappWebhookPayload;

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
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
        }
      }
    }
  }
}
