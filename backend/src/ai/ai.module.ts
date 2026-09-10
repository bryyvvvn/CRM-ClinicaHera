import { Module } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { MedilinkModule } from '../medilink/medilink.module.js';

@Module({
  imports: [MedilinkModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
