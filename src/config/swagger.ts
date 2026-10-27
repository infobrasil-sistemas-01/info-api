import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import path from 'path';
import fs from 'fs';
import { INFO_HEADER_JS } from './info-header.component';

export function getSwaggerConfigBuilder(
  packageVersion: string,
): DocumentBuilder {
  const builder = new DocumentBuilder()
    .setTitle('InfoBrasil API')
    .setDescription(
      `API de integração do sistema Retaguarda (by InfoBrasil) com outros sistemas, como ERPs, e-commerce, etc. <br><br>
      Se deseja solicitar um acesso, preencha o formulário em: <a href='https://info-api.infobrasilsistemas.com.br/integration/form'>Solicitar Acesso</a>
      <br><br>
      **O sistema conta com duas formas de autenticação:**<br> 
      - Basic Auth para login e obtenção de token JWT<br>
      - JWT para acesso aos endpoints protegidos.
      <br><br>
      Para verificar a disponibilidade da API acesse nossa <a href='/status'>Página de Status</a> | Para novidades e histórico de versões acesse o <a href='/changelog'>Changelog Oficial</a>
      <br><br>
      A API é organizada em módulos, cada um responsável por uma área específica do sistema, como produtos, clientes, vendas, etc.`,
    )
    .setContact(
      'InfoBrasil Sistemas',
      'https://www.infobrasilsistemas.com.br',
      'suporte@infobrasilsistemas.com.br',
    )
    .setVersion(packageVersion)
    .addBasicAuth() // 👈 Basic Auth for login
    .addBearerAuth() // 👈 JWT
    // --- Autenticação ---
    .addTag(
      'Auth',
      'Endpoints relacionados à autenticação e obtenção de token JWT',
    )

    // --- Pessoas & Entidades ---
    .addTag('Client', 'Endpoints relacionados à gestão de clientes')
    .addTag('Employee', 'Endpoints relacionados à gestão de funcionários')
    .addTag('Supplier', 'Endpoints relacionados à gestão de fornecedores')
    .addTag(
      'Service Providers (Prestadores)',
      'Endpoints relacionados à gestão de prestadores de serviço',
    )

    // --- Catálogo ---
    .addTag('Product', 'Endpoints relacionados à gestão de produtos')
    .addTag(
      'Product / Brand',
      'Endpoints relacionados à gestão de marcas e produtos vinculados a marcas',
    )
    .addTag(
      'Product / Group',
      'Endpoints relacionados à gestão de grupos e produtos vinculados a grupos',
    )

    // --- Vendas ---
    .addTag('Order', 'Endpoints relacionados à gestão de pedidos')
    .addTag(
      'Order Items',
      'Endpoints relacionados à consulta de itens de pedido',
    )
    .addTag('Delivery', 'Endpoints relacionados à gestão de entregas')

    // --- Financeiro ---
    .addTag(
      'AccountReceivable',
      'Endpoints relacionados à gestão de contas a receber',
    )
    .addTag(
      'Account Payable',
      'Endpoints relacionados à gestão de contas a pagar',
    )
    .addTag(
      'PaymentMethod',
      'Endpoints relacionados à gestão de meios de pagamento',
    )
    .addTag(
      'Payment Plan',
      'Endpoints relacionados à gestão de planos de pagamento',
    )

    // --- Monitoramento & Saúde ---
    .addTag('Status', 'Endpoints de monitoramento de instâncias e telemetria')
    .addTag('Health', 'Endpoints de verificação de integridade dos serviços')
    .addTag('Changelog', 'Endpoints e histórico de versões da API')

    // --- Gestão do Plano ---
    .addTag(
      'Plans & Usage',
      'Endpoints relacionados aos planos comerciais da InfoAPI e métricas de uso',
    );

  if (process.env.NODE_ENV === 'development') {
    builder.addServer(
      'http://localhost:3339',
      'Servidor local para desenvolvimento',
    );
  }

  builder.addServer(
    'https://info-api.infobrasilsistemas.com.br',
    'Servidor de produção',
  );

  return builder;
}

export function setupSwagger(app: INestApplication) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageVersion = fs.existsSync(packageJsonPath)
    ? JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version
    : '1.0.0';

  const docsDir = path.join(process.cwd(), 'docs', 'swagger');

  // Lista todos os arquivos swagger-*.json para registrar as versões
  const files = fs.existsSync(docsDir)
    ? fs
        .readdirSync(docsDir)
        .filter((f) => f.startsWith('swagger-') && f.endsWith('.json'))
    : [];

  // Mapear versões encontradas
  const swaggerVersions = files.map((f) => {
    const version = f.replace('swagger-', '').replace('.json', '');
    const document = JSON.parse(fs.readFileSync(path.join(docsDir, f), 'utf8'));
    return { version, document };
  });

  const builder = getSwaggerConfigBuilder(packageVersion);
  const config = builder.build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'development') {
    const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  }

  const availableVersions = swaggerVersions
    .map((v) => v.version)
    .sort((a, b) => {
      return b.localeCompare(a, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });

  const customCss = `
    html, body {
      margin: 0;
      padding: 0;
      background: #1c2022 !important;
      background-color: #1c2022 !important;
      min-height: 100vh;
      color-scheme: dark;
    }
    .swagger-ui .topbar {
      display: none !important;
    }
    .swagger-ui {
      max-width: 1440px;
      margin: 0 auto;
      padding: 16px 24px;
      background-color: #1c2022 !important;
    }
  `;

  const customJsCode = `
    ${INFO_HEADER_JS}

    (function() {
      function injectUnifiedHeader() {
        if (!document.querySelector('info-api-header')) {
          var headerEl = document.createElement('info-api-header');
          headerEl.setAttribute('active-doc', 'swagger');
          headerEl.setAttribute('current-version', '${packageVersion}');
          headerEl.setAttribute('versions', ${JSON.stringify(JSON.stringify(availableVersions))});
          headerEl.setAttribute('theme', 'dark');
          document.body.prepend(headerEl);
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectUnifiedHeader);
      } else {
        injectUnifiedHeader();
      }
    })();
  `;

  // Servir o script do Web Component de forma dedicada e rápida com o JS embutido
  app.getHttpAdapter().get('/integration/assets/info-header.js', (req: any, res: any) => {
    res.type('application/javascript');
    res.send(INFO_HEADER_JS);
  });

  // Servir o JS customizado do Swagger dinamicamente
  app.getHttpAdapter().get('/swagger-custom.js', (req: any, res: any) => {
    res.type('application/javascript');
    res.send(customJsCode);
  });

  // Servir o arquivo da Postman Collection oficial
  const postmanFilePath = path.join(docsDir, 'infoapi-postman-collection.json');
  const rootPostmanFilePath = path.join(
    process.cwd(),
    'infoapi-postman-collection.json',
  );

  const sendPostmanCollection = (res: any, isAttachment = false) => {
    const targetFile = fs.existsSync(postmanFilePath)
      ? postmanFilePath
      : fs.existsSync(rootPostmanFilePath)
        ? rootPostmanFilePath
        : null;

    if (!targetFile) {
      return res.status(404).json({
        statusCode: 404,
        message:
          'Postman collection não encontrada. Execute `npm run postman:generate`.',
      });
    }

    if (isAttachment) {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="infoapi-postman-collection.json"',
      );
    }
    res.setHeader('Content-Type', 'application/json');
    const content = fs.readFileSync(targetFile, 'utf8');
    res.send(content);
  };

  app.getHttpAdapter().get('/docs/postman', (req: any, res: any) => {
    sendPostmanCollection(res, true);
  });

  app.getHttpAdapter().get('/docs/postman.json', (req: any, res: any) => {
    sendPostmanCollection(res, false);
  });

  // Função geradora de HTML do Scalar Standalone (com Shadow DOM InfoApiHeader)
  const getScalarHtml = ({
    specUrl,
    version,
  }: {
    specUrl: string;
    version?: string;
  }) => {
    const pageTitle = version
      ? `InfoBrasil API Docs v${version}`
      : 'InfoBrasil API Docs';

    return `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${pageTitle}</title>
    <meta name="description" content="Documentação interativa da API de Integração InfoBrasil ERP." />
    <link rel="icon" type="image/x-icon" href="/integration/assets/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      :root {
        --scalar-font: 'Outfit', sans-serif;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        padding: 0;
        background-color: #06110d;
        color: #f0fdf4;
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        min-height: 100vh;
      }
      #scalar-app {
        width: 100%;
        min-height: calc(100vh - 65px);
      }
    </style>
    <script>
      ${INFO_HEADER_JS}
    </script>
  </head>
  <body>
    <info-api-header
      active-doc="scalar"
      current-version="${packageVersion}"
      versions='${JSON.stringify(availableVersions)}'
    ></info-api-header>
    <div id="scalar-app"></div>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
      Scalar.createApiReference('#scalar-app', {
        url: '${specUrl}',
        theme: 'purple',
        layout: 'modern',
        showDeveloperTools: 'localhost',
        pageTitle: '${pageTitle}'
      });
    </script>
  </body>
</html>`;
  };

  // 1. Registro da versão principal (Swagger UI)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'InfoBrasil API Docs',
    customCss: customCss,
    customJs: '/swagger-custom.js',
  });

  // 1. Registro da versão principal (Scalar Standalone)
  app.getHttpAdapter().get('/scalar', (req: any, res: any) => {
    res.type('html');
    res.send(
      getScalarHtml({
        specUrl: '/docs-json',
      }),
    );
  });

  // 2. Registro das versões históricas encontradas em docs/swagger
  swaggerVersions.forEach(({ version, document: versionDoc }) => {
    // Swagger UI: /docs/v1.3.0
    SwaggerModule.setup(`docs/v${version}`, app, versionDoc, {
      customSiteTitle: `InfoBrasil API Docs v${version}`,
      customCss: customCss,
      customJs: '/swagger-custom.js',
    });

    // Scalar Standalone: /scalar/v1.3.0
    app.getHttpAdapter().get(`/scalar/v${version}`, (req: any, res: any) => {
      res.type('html');
      res.send(
        getScalarHtml({
          specUrl: `/docs/v${version}-json`,
          version,
        }),
      );
    });
  });
}
