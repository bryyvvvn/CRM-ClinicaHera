import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  handleIncomingWebhook(payload: unknown): void {
    this.logger.debug('Incoming WhatsApp webhook received');
    // TODO: persist patient/session/message and forward to ChatService / AiService
    void payload;
  }
}
