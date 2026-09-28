import { Module } from '@nestjs/common';
import { WhatsappApiClient } from './whatsapp-api.client.js';

@Module({
  providers: [WhatsappApiClient],
  exports: [WhatsappApiClient],
})
export class WhatsappApiModule {}
