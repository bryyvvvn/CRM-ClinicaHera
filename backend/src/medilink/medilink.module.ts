import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MedilinkService } from './medilink.service.js';

@Module({
  imports: [HttpModule],
  providers: [MedilinkService],
  exports: [MedilinkService],
})
export class MedilinkModule {}
