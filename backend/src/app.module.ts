import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AiModule } from './ai/ai.module.js';
import { ChatModule } from './chat/chat.module.js';
import { MedilinkModule } from './medilink/medilink.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { WhatsappModule } from './whatsapp/whatsapp.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WhatsappModule,
    ChatModule,
    AiModule,
    MedilinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
