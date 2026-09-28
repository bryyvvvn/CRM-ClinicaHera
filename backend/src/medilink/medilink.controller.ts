import { Controller, Get, Query } from '@nestjs/common';
import { MedilinkService } from './medilink.service.js';

@Controller('medilink')
export class MedilinkController {
  constructor(private readonly medilinkService: MedilinkService) {}

  @Get('citas')
  listCitas() {
    return this.medilinkService.listCitas();
  }

  @Get('pacientes')
  findPacientes(
    @Query('celular') celular?: string,
    @Query('rut') rut?: string,
    @Query('nombre') nombre?: string,
  ) {
    return this.medilinkService.findPacientes({ celular, rut, nombre });
  }
}
