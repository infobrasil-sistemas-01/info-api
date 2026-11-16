import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('WebhookWorkerRunner');
  logger.log('Iniciando contexto do Webhook Worker...');

  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();

  logger.log('Webhook Worker inicializado com sucesso e operando em segundo plano.');

  const shutdown = async (signal: string) => {
    logger.log(`Recebido sinal ${signal}. Encerrando worker...`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();
