import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';
import { GlobalLoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(GlobalLoggerService);
  app.useLogger(logger);

  // Confia no primeiro proxy (Nginx) para resolver o IP real do cliente
  // via X-Forwarded-For. Necessário para o IpBlocklistService funcionar corretamente.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.enableCors();
  app.setGlobalPrefix('api/v1');


  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Sentry/GlitchTip DSN: ${process.env.GLITCHTIP_DSN ? 'Configurado' : 'Não configurado'}`);
}
bootstrap();
