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
    /* Ocultar topbar visualmente preservando o DOM para gatilhos nativos/extensões */
    .swagger-ui .topbar {
      height: 0 !important;
      min-height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden !important;
      opacity: 0 !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Outfit', sans-serif;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    html.dark-mode,
    body.dark-mode {
      background-color: #06110d !important;
      color: #f0fdf4 !important;
    }
    html:not(.dark-mode),
    body:not(.dark-mode) {
      background-color: #fafafa !important;
      color: #3b4151 !important;
    }
    .swagger-ui {
      max-width: 1440px;
      margin: 0 auto;
      padding: 16px 24px;
    }

    /* =========================================================================
       SWAGGER UI DARK THEME (Ativo apenas sob a classe nativa .dark-mode)
    ========================================================================= */
    .dark-mode.swagger-ui,
    .dark-mode .swagger-ui {
      color: #f0fdf4;
    }
    .dark-mode .swagger-ui .scheme-container {
      background: #0c1f18 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
      border-radius: 14px !important;
      padding: 16px 20px !important;
      margin-bottom: 24px !important;
    }
    .dark-mode .swagger-ui .scheme-container label {
      color: #f0fdf4 !important;
      font-weight: 600 !important;
    }
    .dark-mode .swagger-ui .scheme-container select {
      background-color: #06110d !important;
      color: #10b981 !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 8px !important;
      padding: 6px 12px !important;
      font-weight: 500 !important;
    }
    .dark-mode .swagger-ui .btn.authorize {
      background: #10b981 !important;
      color: #06110d !important;
      border-color: #10b981 !important;
      border-radius: 9px !important;
      font-weight: 700 !important;
      box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3) !important;
    }
    .dark-mode .swagger-ui .btn.authorize svg {
      fill: #06110d !important;
    }
    .dark-mode .swagger-ui .info {
      margin: 20px 0 28px !important;
    }
    .dark-mode .swagger-ui .info .title {
      color: #ffffff !important;
      font-size: 2rem !important;
      font-weight: 800 !important;
    }
    .dark-mode .swagger-ui .info p,
    .dark-mode .swagger-ui .info li,
    .dark-mode .swagger-ui .info table {
      color: #94a3b8 !important;
    }
    .dark-mode .swagger-ui .info a {
      color: #10b981 !important;
    }
    .dark-mode .swagger-ui .opblock-tag {
      color: #ffffff !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    }
    .dark-mode .swagger-ui .opblock-tag small {
      color: #94a3b8 !important;
    }
    .dark-mode .swagger-ui .opblock {
      background: #0c1f18 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 12px !important;
      box-shadow: none !important;
      margin: 0 0 12px !important;
    }
    .dark-mode .swagger-ui .opblock .opblock-summary {
      border-color: transparent !important;
    }
    .dark-mode .swagger-ui .opblock .opblock-summary-path,
    .dark-mode .swagger-ui .opblock .opblock-summary-operation-id {
      color: #f0fdf4 !important;
      font-family: 'JetBrains Mono', monospace !important;
    }
    .dark-mode .swagger-ui .opblock .opblock-summary-description {
      color: #94a3b8 !important;
    }
    .dark-mode .swagger-ui .opblock-body {
      background: #06110d !important;
      border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    }
    .dark-mode .swagger-ui .opblock-section-header {
      background: #0c1f18 !important;
    }
    .dark-mode .swagger-ui .opblock-section-header h4 {
      color: #f0fdf4 !important;
    }
    .dark-mode .swagger-ui table.parameters {
      color: #f0fdf4 !important;
    }
    .dark-mode .swagger-ui .parameter__name,
    .dark-mode .swagger-ui .parameter__type {
      color: #10b981 !important;
    }
    .dark-mode .swagger-ui .parameter__deprecated {
      color: #ef4444 !important;
    }
    .dark-mode .swagger-ui .tab li button.tablinks {
      color: #94a3b8 !important;
    }
    .dark-mode .swagger-ui .tab li button.tablinks.active {
      color: #10b981 !important;
      font-weight: 700 !important;
    }
    .dark-mode .swagger-ui select {
      background-color: #0c1f18 !important;
      color: #f0fdf4 !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 6px !important;
    }
    .dark-mode .swagger-ui input[type=text],
    .dark-mode .swagger-ui input[type=password],
    .dark-mode .swagger-ui textarea {
      background-color: #0c1f18 !important;
      color: #f0fdf4 !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 6px !important;
    }
    .dark-mode .swagger-ui .btn.execute {
      background-color: #10b981 !important;
      color: #06110d !important;
      border-color: #10b981 !important;
    }
    .dark-mode .swagger-ui .btn.btn-clear {
      background-color: rgba(255, 255, 255, 0.05) !important;
      color: #94a3b8 !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    .dark-mode .swagger-ui .responses-inner h4,
    .dark-mode .swagger-ui .responses-inner h5 {
      color: #f0fdf4 !important;
    }
    .dark-mode .swagger-ui .response-col_status {
      color: #10b981 !important;
    }
    .dark-mode .swagger-ui .response-col_description {
      color: #94a3b8 !important;
    }
    .dark-mode .swagger-ui .highlight-code,
    .dark-mode .swagger-ui .microlight {
      background: #06110d !important;
      color: #38bdf8 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 8px !important;
    }
    .dark-mode .swagger-ui section.models {
      background: #0c1f18 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 14px !important;
    }
    .dark-mode .swagger-ui section.models h4 {
      color: #ffffff !important;
    }
    .dark-mode .swagger-ui .model-box {
      background: #06110d !important;
      border-radius: 8px !important;
    }
    .dark-mode .swagger-ui .model-title,
    .dark-mode .swagger-ui .model {
      color: #f0fdf4 !important;
    }
    .dark-mode .swagger-ui table.model tbody tr td {
      color: #94a3b8 !important;
    }
    .dark-mode .swagger-ui .dialog-ux .backdrop-ux {
      background: rgba(0, 0, 0, 0.75) !important;
      backdrop-filter: blur(6px) !important;
    }
    .dark-mode .swagger-ui .dialog-ux .modal-ux {
      background: #0c1f18 !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8) !important;
      border-radius: 16px !important;
    }
    .dark-mode .swagger-ui .dialog-ux .modal-ux-header h3 {
      color: #ffffff !important;
    }
    .dark-mode .swagger-ui .dialog-ux .modal-ux-content h4,
    .dark-mode .swagger-ui .dialog-ux .modal-ux-content h5 {
      color: #f0fdf4 !important;
    }
    .dark-mode .swagger-ui .dialog-ux .modal-ux-content p {
      color: #94a3b8 !important;
    }
  `;

  const customJsCode = `
    ${INFO_HEADER_JS}

    (function() {
      // 1. Acionar gatilho nativo do Swagger UI sincronizado com o seletor paralelo do header
      function triggerSwaggerTheme(theme) {
        var isDark = theme === 'dark';

        // Atualizar classes nativas dark-mode e esquema de cores
        document.documentElement.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('dark-mode', isDark);
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

        var swaggerRoot = document.querySelector('.swagger-ui');
        if (swaggerRoot) {
          swaggerRoot.classList.toggle('dark-mode', isDark);
        }

        // Chamar gatilho do seletor nativo do swagger / extensões se presentes na topbar
        try {
          var nativeToggles = document.querySelectorAll(
            '.swagger-ui .topbar button, .topbar-wrapper button, [aria-label*="dark" i], [aria-label*="theme" i], [title*="dark" i], [title*="theme" i], .dark-mode-toggle'
          );
          nativeToggles.forEach(function(btn) {
            if (!btn.closest('info-api-header')) {
              btn.click();
            }
          });
        } catch(e) {}

        // Persistir nas chaves padrão do ecossistema Swagger e InfoAPI
        try {
          localStorage.setItem('infoapi-theme', theme);
          localStorage.setItem('swagger-ui-theme', theme);
          localStorage.setItem('dark-mode', isDark ? 'true' : 'false');
        } catch(e) {}
      }

      var savedTheme = 'light';
      try {
        savedTheme = localStorage.getItem('infoapi-theme') || 'light';
      } catch(e) {}
      triggerSwaggerTheme(savedTheme);

      // Ouvir evento do seletor paralelo no <info-api-header>
      window.addEventListener('theme-changed', function(e) {
        if (e && e.detail && e.detail.theme) {
          triggerSwaggerTheme(e.detail.theme);
        }
      });

      // 2. Injetar o header corporativo unificado
      function injectUnifiedHeader() {
        if (!document.querySelector('info-api-header')) {
          var headerEl = document.createElement('info-api-header');
          headerEl.setAttribute('active-doc', 'swagger');
          headerEl.setAttribute('current-version', '${packageVersion}');
          headerEl.setAttribute('versions', ${JSON.stringify(JSON.stringify(availableVersions))});
          headerEl.setAttribute('theme', savedTheme);
          document.body.prepend(headerEl);
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          var cur = 'light';
          try {
            cur = localStorage.getItem('infoapi-theme') || 'light';
          } catch(e) {}
          triggerSwaggerTheme(cur);
          injectUnifiedHeader();
        });
      } else {
        triggerSwaggerTheme(savedTheme);
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
