import { Module } from '@nestjs/common';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { DeepseekClient } from './deepseek.client.js';
import { ChatModule } from '../chat/chat.module.js';
import { MedilinkModule } from '../medilink/medilink.module.js';

@Module({
  imports: [MedilinkModule, ChatModule],
  controllers: [AiController],
  providers: [AiService, DeepseekClient],
  exports: [AiService],
})
export class AiModule {}
