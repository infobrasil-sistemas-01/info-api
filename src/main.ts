import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';
import { GlobalLoggerService } from './common/logger/logger.service';

import { ZodValidationPipe } from './common/validation/zod-validation.pipe';

import * as Sentry from '@sentry/node';

// Previne que bugs internos do driver ou quedas de conexões de clientes derrubem o servidor
const isIgnorableDriverError = (err: any): boolean => {
  const msg = err?.message || '';
  const stack = err?.stack || '';
  const code = err?.code || '';

  // Bug conhecido de buffer no node-firebird
  if (msg.includes('readUInt16LE') && stack.includes('node-firebird')) {
    return true;
  }

  // Erros de rede de sockets remotos de clientes (VPN oscilando, NAT timeout)
  if (['ECONNRESET', 'EPIPE', 'ETIMEDOUT', 'ECONNREFUSED'].includes(code)) {
    return true;
  }

  // Sockets fechados abruptamente durante queries no node-firebird
  if (msg.includes('Connection is closed') || msg.includes('Socket closed')) {
    return true;
  }

  return false;
};

process.on('uncaughtException', async (err: any, origin: string) => {
  if (isIgnorableDriverError(err)) {
    console.warn(
      `[Driver/Network SafeCatch] Ignorando erro de socket/driver (${origin}): ${err.message}`,
    );
    return;
  }

  console.error(`Uncaught Exception (${origin}):`, err);
  Sentry.captureException(err);

  try {
    await Sentry.flush(2000);
  } finally {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  if (isIgnorableDriverError(reason)) {
    console.warn(
      `[UnhandledRejection SafeCatch] Ignorando rejeição não tratada de socket/driver: ${reason?.message || reason}`,
    );
    return;
  }

  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  Sentry.captureException(
    reason instanceof Error ? reason : new Error(String(reason)),
  );
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(GlobalLoggerService);
  app.useLogger(logger);

  app.useGlobalPipes(new ZodValidationPipe());

  // Confia no primeiro proxy (Nginx) para resolver o IP real do cliente
  // via X-Forwarded-For. Necessário para o IpBlocklistService funcionar corretamente.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.enableCors();
  app.setGlobalPrefix('api/v1', {
    exclude: [
      'integration',
      'integration/*path',
      'favicon.ico',
      'status',
      'status/*path',
    ],
  });

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(
    `Sentry/GlitchTip DSN: ${process.env.GLITCHTIP_DSN ? 'Configurado' : 'Não configurado'}`,
  );
}
bootstrap();
