import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappApiClient {
  private readonly logger = new Logger(WhatsappApiClient.name);

  constructor(private readonly configService: ConfigService) {}

  async sendText(to: string, body: string): Promise<string | undefined> {
    const token = this.configService.get<string>('WHATSAPP_TOKEN');
    const phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID');

    if (!token || !phoneNumberId) {
      throw new HttpException(
        'Falta WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID en el .env',
        500,
      );
    }

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body },
        }),
      },
    );

    const payload = (await response.json()) as {
      messages?: Array<{ id?: string }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      const detail = payload.error?.message ?? response.statusText;
      this.logger.error(`WhatsApp send failed: ${detail}`);
      throw new HttpException(`WhatsApp no envió el mensaje: ${detail}`, 502);
    }

    this.logger.log(`WhatsApp outbound to=${to} wamid=${payload.messages?.[0]?.id ?? 'n/a'}`);
    return payload.messages?.[0]?.id;
  }
}
