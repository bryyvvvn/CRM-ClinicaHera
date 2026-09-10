import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MedilinkService {
  constructor(private readonly httpService: HttpService) {}

  async getAvailability(_params: Record<string, unknown>): Promise<unknown> {
    // TODO: GET availability from the external MediLink reservations API
    void this.httpService;
    return [];
  }

  async createReservation(_payload: Record<string, unknown>): Promise<unknown> {
    // TODO: POST a reservation to the external MediLink API
    void this.httpService;
    return null;
  }
}
