import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MedilinkController } from './medilink.controller.js';
import { MedilinkService } from './medilink.service.js';

@Module({
  imports: [HttpModule.register({ timeout: 20000 })],
  controllers: [MedilinkController],
  providers: [MedilinkService],
  exports: [MedilinkService],
})
export class MedilinkModule {}
