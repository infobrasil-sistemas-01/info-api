import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import path from 'path';
import fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('InfoBrasil API')
    .setDescription(
      'API de integração do sistema Retaguarda (by InfoBrasil) com outros sistemas, como ERPs, e-commerce, etc.',
    )
    .addServer('http://localhost:3000', 'Servidor local para desenvolvimento')
    .setVersion('1.0')
    .addBasicAuth() // 👈 Basic Auth for login
    .addBearerAuth() // 👈 JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'development') {
    const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  }

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
