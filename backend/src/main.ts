import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { HttpLoggingInterceptor } from './common/http-logging.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalInterceptors(new HttpLoggingInterceptor());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL?.split(',') ?? [
      'http://localhost:5174',
    ],
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  Logger.log(`API lista en http://localhost:${port}/api`, 'Bootstrap');
}

await bootstrap();
