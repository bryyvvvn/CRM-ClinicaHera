import { Injectable } from '@nestjs/common';
import { MedilinkService } from '../medilink/medilink.service.js';

@Injectable()
export class AiService {
  constructor(private readonly medilinkService: MedilinkService) {}

  async complete(_prompt: string): Promise<string> {
    // TODO: wire LLM + function calling (e.g. getAvailability / createReservation)
    void this.medilinkService;
    return '';
  }
}
