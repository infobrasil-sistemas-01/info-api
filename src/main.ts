import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import path from 'path';
import fs from 'fs';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('InfoBrasil API')
    .setDescription(
      `API de integração do sistema Retaguarda (by InfoBrasil) com outros sistemas, como ERPs, e-commerce, etc. <br><br>
      O sistema conta com duas formas de autenticação:<br> 
      - Basic Auth para login e obtenção de token JWT<br>
      - JWT para acesso aos endpoints protegidos.
      <br><br>
      A API é organizada em módulos, cada um responsável por uma área específica do sistema, como produtos, clientes, vendas, etc.`,
    )
    .addServer(
      `http://localhost:${process.env.PORT ?? 3000}`,
      'Servidor local para desenvolvimento',
    )
    .setVersion('1.0')
    .addBasicAuth() // 👈 Basic Auth for login
    .addBearerAuth() // 👈 JWT
    .addTag(
      'Auth',
      'Endpoints relacionados à autenticação e obtenção de token JWT',
    )
    .addTag('Product', 'Endpoints relacionados à gestão de produtos')
    .addTag(
      'Product / Brand',
      'Endpoints relacionados à gestão de marcas e produtos vinculados a marcas',
    )
    .addTag(
      'Product / Group',
      'Endpoints relacionados à gestão de grupos e produtos vinculados a grupos',
    )
    .addTag(
      'PaymentMethod',
      'Endpoints relacionados à gestão de meios de pagamento',
    )
    .addTag('Order', 'Endpoints relacionados à gestão de pedidos')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'development') {
    const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  }

  SwaggerModule.setup('docs', app, document);

  app.use(
    '/scalar',
    apiReference({
      theme: 'purple',
      content: document,
      showDeveloperTools: 'localhost',
      pageTitle: 'InfoBrasil API Docs',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
