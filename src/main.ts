import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';
import { GlobalLoggerService } from './common/logger/logger.service';

import { ZodValidationPipe } from './common/validation/zod-validation.pipe';

// Previne que bugs internos do node-firebird (como o erro de leitura de buffer na autenticação) derrubem o servidor
process.on('uncaughtException', (err: any, origin: string) => {
  if (
    err?.message?.includes('readUInt16LE') &&
    err?.stack?.includes('node-firebird')
  ) {
    console.error(
      `[Node-Firebird Bug Safecatch] Ignorando crash interno do driver: ${err.message}`,
    );
    return; // Não derruba o servidor
  }

  // Para qualquer outro erro não tratado, logamos e encerramos o processo
  console.error(`Uncaught Exception (${origin}):`, err);
  process.exit(1);
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
