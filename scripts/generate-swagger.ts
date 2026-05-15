import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { getSwaggerConfigBuilder } from '../src/config/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function generate() {
  console.log('🚀 Inicializando aplicação para gerar documentação...');

  // Inicializa o app NestJS para que o Swagger possa ler os metadados dos controllers
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const version = packageJson.version;

  const builder = getSwaggerConfigBuilder(version);
  const config = builder.build();

  const document = SwaggerModule.createDocument(app, config);

  // Garante que o diretório existe
  const docsDir = path.join(process.cwd(), 'docs', 'swagger');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const outputPath = path.join(docsDir, `swagger-${version}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  const rootOutputPath = path.join(process.cwd(), 'swagger-spec.json');
  fs.writeFileSync(rootOutputPath, JSON.stringify(document, null, 2));

  console.log(`✅ Swagger spec gerada com sucesso para a versão ${version} em: ${outputPath} e raiz`);

  await app.close();
  process.exit(0);
}

generate().catch(err => {
  console.error('❌ Erro ao gerar swagger spec:', err);
  process.exit(1);
});
