import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module.js';
import { WhatsappApiModule } from './whatsapp-api.module.js';
import { WhatsappController } from './whatsapp.controller.js';
import { WhatsappService } from './whatsapp.service.js';

@Module({
  imports: [ChatModule, WhatsappApiModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
