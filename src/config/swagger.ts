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
    .swagger-ui {
      max-width: 1440px;
      margin: 0 auto;
      padding: 16px 24px;
    }
  `;

  const SWAGGER_DARK_CSS = `
    html, body {
      background-color: #06110d !important;
      color: #f0fdf4 !important;
    }
    .swagger-ui {
      color: #f0fdf4 !important;
    }
    .swagger-ui .scheme-container {
      background: #0c1f18 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
      border-radius: 14px !important;
      padding: 16px 20px !important;
      margin-bottom: 24px !important;
    }
    .swagger-ui .scheme-container label {
      color: #f0fdf4 !important;
      font-weight: 600 !important;
    }
    .swagger-ui .scheme-container select {
      background-color: #06110d !important;
      color: #10b981 !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 8px !important;
      padding: 6px 12px !important;
      font-weight: 500 !important;
    }
    .swagger-ui .btn.authorize {
      background: #10b981 !important;
      color: #06110d !important;
      border-color: #10b981 !important;
      border-radius: 9px !important;
      font-weight: 700 !important;
      box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3) !important;
    }
    .swagger-ui .btn.authorize svg {
      fill: #06110d !important;
    }
    .swagger-ui .info {
      margin: 20px 0 28px !important;
    }
    .swagger-ui .info .title {
      color: #ffffff !important;
      font-size: 2rem !important;
      font-weight: 800 !important;
    }
    .swagger-ui .info p,
    .swagger-ui .info li,
    .swagger-ui .info table {
      color: #94a3b8 !important;
    }
    .swagger-ui .info a {
      color: #10b981 !important;
    }
    .swagger-ui .opblock-tag {
      color: #ffffff !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    }
    .swagger-ui .opblock-tag small {
      color: #94a3b8 !important;
    }
    .swagger-ui .opblock {
      background: #0c1f18 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 12px !important;
      box-shadow: none !important;
      margin: 0 0 12px !important;
    }
    .swagger-ui .opblock .opblock-summary {
      border-color: transparent !important;
    }
    .swagger-ui .opblock .opblock-summary-path,
    .swagger-ui .opblock .opblock-summary-operation-id {
      color: #f0fdf4 !important;
      font-family: 'JetBrains Mono', monospace !important;
    }
    .swagger-ui .opblock .opblock-summary-description {
      color: #94a3b8 !important;
    }
    .swagger-ui .opblock-body {
      background: #06110d !important;
      border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    }
    .swagger-ui .opblock-section-header {
      background: #0c1f18 !important;
    }
    .swagger-ui .opblock-section-header h4 {
      color: #f0fdf4 !important;
    }
    .swagger-ui table.parameters {
      color: #f0fdf4 !important;
    }
    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type {
      color: #10b981 !important;
    }
    .swagger-ui .parameter__deprecated {
      color: #ef4444 !important;
    }
    .swagger-ui .tab li button.tablinks {
      color: #94a3b8 !important;
    }
    .swagger-ui .tab li button.tablinks.active {
      color: #10b981 !important;
      font-weight: 700 !important;
    }
    .swagger-ui select {
      background-color: #0c1f18 !important;
      color: #f0fdf4 !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 6px !important;
    }
    .swagger-ui input[type=text],
    .swagger-ui input[type=password],
    .swagger-ui textarea {
      background-color: #0c1f18 !important;
      color: #f0fdf4 !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 6px !important;
    }
    .swagger-ui .btn.execute {
      background-color: #10b981 !important;
      color: #06110d !important;
      border-color: #10b981 !important;
    }
    .swagger-ui .btn.btn-clear {
      background-color: rgba(255, 255, 255, 0.05) !important;
      color: #94a3b8 !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    .swagger-ui .responses-inner h4,
    .swagger-ui .responses-inner h5 {
      color: #f0fdf4 !important;
    }
    .swagger-ui .response-col_status {
      color: #10b981 !important;
    }
    .swagger-ui .response-col_description {
      color: #94a3b8 !important;
    }
    .swagger-ui .highlight-code,
    .swagger-ui .microlight {
      background: #06110d !important;
      color: #38bdf8 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 8px !important;
    }
    .swagger-ui section.models {
      background: #0c1f18 !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 14px !important;
    }
    .swagger-ui section.models h4 {
      color: #ffffff !important;
    }
    .swagger-ui .model-box {
      background: #06110d !important;
      border-radius: 8px !important;
    }
    .swagger-ui .model-title,
    .swagger-ui .model {
      color: #f0fdf4 !important;
    }
    .swagger-ui table.model tbody tr td {
      color: #94a3b8 !important;
    }
    .swagger-ui .dialog-ux .backdrop-ux {
      background: rgba(0, 0, 0, 0.75) !important;
      backdrop-filter: blur(6px) !important;
    }
    .swagger-ui .dialog-ux .modal-ux {
      background: #0c1f18 !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8) !important;
      border-radius: 16px !important;
    }
    .swagger-ui .dialog-ux .modal-ux-header h3 {
      color: #ffffff !important;
    }
    .swagger-ui .dialog-ux .modal-ux-content h4,
    .swagger-ui .dialog-ux .modal-ux-content h5 {
      color: #f0fdf4 !important;
    }
    .swagger-ui .dialog-ux .modal-ux-content p {
      color: #94a3b8 !important;
    }
  `;

  const customJsCode = `
    (function() {
      var availableVersions = ${JSON.stringify(availableVersions)};
      var currentVersion = '${packageVersion}';

      function applyTheme(theme) {
        var link = document.getElementById('swagger-dark-theme-link');
        if (theme === 'dark') {
          if (!link) {
            link = document.createElement('link');
            link.id = 'swagger-dark-theme-link';
            link.rel = 'stylesheet';
            link.href = '/swagger-dark.css';
            document.head.appendChild(link);
          } else {
            link.disabled = false;
          }
        } else {
          if (link) {
            link.disabled = true;
          }
        }
        try {
          localStorage.setItem('infoapi-theme', theme);
        } catch(e) {}
        updateThemeButton(theme);
      }

      function updateThemeButton(theme) {
        var btn = document.getElementById('custom-theme-toggle');
        if (btn) {
          var isDark = theme === 'dark';
          btn.title = isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro';
          btn.innerHTML = '<i class="material-icons" style="color: white; font-size: 22px;">' + (isDark ? 'light_mode' : 'dark_mode') + '</i>';
        }
      }

      var currentTheme = 'light';
      try {
        currentTheme = localStorage.getItem('infoapi-theme') || 'light';
      } catch(e) {}
      applyTheme(currentTheme);

      var check = setInterval(function() {
        var topbar = document.querySelector('.topbar-wrapper');
        if (topbar && !document.getElementById('custom-theme-toggle')) {
          clearInterval(check);

          // 1. Botão de Alternar Modo Claro / Escuro
          var themeBtn = document.createElement('a');
          themeBtn.id = 'custom-theme-toggle';
          themeBtn.href = 'javascript:void(0)';
          themeBtn.style.marginLeft = 'auto';
          themeBtn.style.marginRight = '8px';
          themeBtn.style.display = 'flex';
          themeBtn.style.alignItems = 'center';
          themeBtn.style.justifyContent = 'center';
          themeBtn.style.alignSelf = 'center';
          themeBtn.style.textDecoration = 'none';
          themeBtn.style.flex = '0 0 40px';
          themeBtn.style.width = '40px';
          themeBtn.style.height = '40px';
          themeBtn.style.borderRadius = '50%';
          themeBtn.style.background = 'rgba(255,255,255,0.1)';
          themeBtn.style.transition = 'background 0.3s';
          themeBtn.onmouseover = function() { this.style.background = 'rgba(16,185,129,0.3)'; };
          themeBtn.onmouseout = function() { this.style.background = 'rgba(255,255,255,0.1)'; };
          themeBtn.onclick = function() {
            var next = currentTheme === 'dark' ? 'light' : 'dark';
            currentTheme = next;
            applyTheme(next);
          };
          topbar.appendChild(themeBtn);
          updateThemeButton(currentTheme);

          // 2. Botão Changelog
          var cl = document.createElement('a');
          cl.id = 'custom-changelog-link';
          cl.href = '/changelog';
          cl.title = 'Notas de Atualização (Changelog)';
          cl.style.marginRight = '8px';
          cl.style.display = 'flex';
          cl.style.alignItems = 'center';
          cl.style.justifyContent = 'center';
          cl.style.alignSelf = 'center';
          cl.style.textDecoration = 'none';
          cl.style.flex = '0 0 40px';
          cl.style.width = '40px';
          cl.style.height = '40px';
          cl.style.borderRadius = '50%';
          cl.style.background = 'rgba(255,255,255,0.1)';
          cl.style.transition = 'background 0.3s';
          cl.onmouseover = function() { this.style.background = 'rgba(99,102,241,0.3)'; };
          cl.onmouseout = function() { this.style.background = 'rgba(255,255,255,0.1)'; };
          cl.innerHTML = '<i class="material-icons" style="color: white; font-size: 22px;">history</i>';
          topbar.appendChild(cl);

          // 3. Botão Admin
          var a = document.createElement('a');
          a.id = 'custom-admin-link';
          a.href = '/integration/admin';
          a.title = 'Painel Administrativo';
          a.style.marginRight = '8px';
          a.style.display = 'flex';
          a.style.alignItems = 'center';
          a.style.justifyContent = 'center';
          a.style.alignSelf = 'center';
          a.style.textDecoration = 'none';
          a.style.flex = '0 0 40px';
          a.style.width = '40px';
          a.style.height = '40px';
          a.style.borderRadius = '50%';
          a.style.background = 'rgba(255,255,255,0.1)';
          a.style.transition = 'background 0.3s';
          a.onmouseover = function() { this.style.background = 'rgba(255,255,255,0.2)'; };
          a.onmouseout = function() { this.style.background = 'rgba(255,255,255,0.1)'; };
          a.innerHTML = '<i class="material-icons" style="color: white; font-size: 24px;">support_agent</i>';
          topbar.appendChild(a);

          // 4. Seletor de Versões
          var selectContainer = document.createElement('div');
          selectContainer.style.display = 'flex';
          selectContainer.style.alignItems = 'center';

          var select = document.createElement('select');
          select.id = 'version-selector';
          select.style.padding = '5px 10px';
          select.style.borderRadius = '4px';
          select.style.border = '1px solid rgba(255,255,255,0.3)';
          select.style.background = '#3b4151';
          select.style.color = 'white';
          select.style.cursor = 'pointer';
          select.style.outline = 'none';

          var currentOpt = document.createElement('option');
          currentOpt.value = '';
          currentOpt.text = 'Versão Atual (' + currentVersion + ')';
          select.appendChild(currentOpt);

          availableVersions.forEach(function(v) {
            if (v === currentVersion) return;
            var opt = document.createElement('option');
            opt.value = 'v' + v;
            opt.text = 'v' + v;
            if (window.location.pathname.includes('/v' + v)) {
              opt.selected = true;
            }
            select.appendChild(opt);
          });

          select.onchange = function(e) {
            var val = e.target.value;
            if (val === '') {
              window.location.href = '/docs';
            } else {
              window.location.href = '/docs/' + val;
            }
          };

          selectContainer.appendChild(select);
          topbar.appendChild(selectContainer);
        }
      }, 100);
    })();
  `;

  // Servir o stylesheet do tema escuro sob demanda
  app.getHttpAdapter().get('/swagger-dark.css', (req: any, res: any) => {
    res.type('text/css');
    res.send(SWAGGER_DARK_CSS);
  });

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
    customCssUrl: 'https://fonts.googleapis.com/icon?family=Material+Icons',
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
      customCssUrl: 'https://fonts.googleapis.com/icon?family=Material+Icons',
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
