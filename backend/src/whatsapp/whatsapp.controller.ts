import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { WhatsappService } from './whatsapp.service.js';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly configService: ConfigService,
  ) {}

  @Get('webhook')
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ): void {
    const verifyToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');

    if (mode === 'subscribe' && token === verifyToken) {
      res.status(200).send(challenge);
      return;
    }

    res.sendStatus(403);
  }

  @Post('webhook')
  @HttpCode(200)
  receive(
    @Body() body: unknown,
    @Headers('x-hub-signature-256') signature: string | undefined,
    @Req() req: RawBodyRequest<Request>,
  ): { status: string } {
    this.assertValidSignature(req.rawBody, signature);
    void this.whatsappService.handleIncomingWebhook(body);
    return { status: 'ok' };
  }

  private assertValidSignature(
    rawBody: Buffer | undefined,
    signatureHeader: string | undefined,
  ): void {
    const appSecret = this.configService.get<string>('WHATSAPP_APP_SECRET');
    if (!appSecret) {
      return;
    }

    const expectedPrefix = 'sha256=';
    if (!signatureHeader?.startsWith(expectedPrefix) || !rawBody) {
      throw new UnauthorizedException('Invalid WhatsApp signature');
    }

    const received = Buffer.from(signatureHeader.slice(expectedPrefix.length), 'hex');
    const computed = createHmac('sha256', appSecret).update(rawBody).digest();

    if (
      received.length !== computed.length ||
      !timingSafeEqual(received, computed)
    ) {
      throw new UnauthorizedException('Invalid WhatsApp signature');
    }
  }
}
