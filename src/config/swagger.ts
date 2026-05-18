import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import path from 'path';
import fs from 'fs';

export function getSwaggerConfigBuilder(packageVersion: string): DocumentBuilder {
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
      Para verificar a disponibilidade da API acesse nossa <a href='/status'>Página de Status</a>
      <br><br>
      A API é organizada em módulos, cada um responsável por uma área específica do sistema, como produtos, clientes, vendas, etc.`,
    )
    .setContact('InfoBrasil Sistemas', 'https://www.infobrasilsistemas.com.br', 'suporte@infobrasilsistemas.com.br')
    .setVersion(packageVersion)
    .addBasicAuth() // 👈 Basic Auth for login
    .addBearerAuth() // 👈 JWT
    // --- Autenticação ---
    .addTag('Auth', 'Endpoints relacionados à autenticação e obtenção de token JWT')

    // --- Pessoas & Entidades ---
    .addTag('Client', 'Endpoints relacionados à gestão de clientes')
    .addTag('Employee', 'Endpoints relacionados à gestão de funcionários')
    .addTag('Supplier', 'Endpoints relacionados à gestão de fornecedores')
    .addTag('Service Providers (Prestadores)', 'Endpoints relacionados à gestão de prestadores de serviço')

    // --- Catálogo ---
    .addTag('Product', 'Endpoints relacionados à gestão de produtos')
    .addTag('Product / Brand', 'Endpoints relacionados à gestão de marcas e produtos vinculados a marcas')
    .addTag('Product / Group', 'Endpoints relacionados à gestão de grupos e produtos vinculados a grupos')

    // --- Vendas ---
    .addTag('Order', 'Endpoints relacionados à gestão de pedidos')
    .addTag('Order Items', 'Endpoints relacionados à consulta de itens de pedido')
    .addTag('Delivery', 'Endpoints relacionados à gestão de entregas')

    // --- Financeiro ---
    .addTag('AccountReceivable', 'Endpoints relacionados à gestão de contas a receber')
    .addTag('Account Payable', 'Endpoints relacionados à gestão de contas a pagar')
    .addTag('PaymentMethod', 'Endpoints relacionados à gestão de meios de pagamento')
    .addTag('Payment Plan', 'Endpoints relacionados à gestão de planos de pagamento')

    // --- Monitoramento & Saúde ---
    .addTag('Status', 'Endpoints de monitoramento de instâncias e telemetria')
    .addTag('Health', 'Endpoints de verificação de integridade dos serviços')

    // --- Gestão do Plano ---
    .addTag('Plans & Usage', 'Endpoints relacionados aos planos comerciais da InfoAPI e métricas de uso');

  if (process.env.NODE_ENV === 'development') {
    builder.addServer(
      'http://localhost:3336',
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
    ? fs.readdirSync(docsDir).filter(f => f.startsWith('swagger-') && f.endsWith('.json'))
    : [];

  // Mapear versões encontradas
  const swaggerVersions = files.map(f => {
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

  const availableVersions = swaggerVersions.map(v => v.version).sort((a, b) => {
    return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
  });

  const customJsCode = `
    (function() {
      var availableVersions = ${JSON.stringify(availableVersions)};
      var check = setInterval(function() {
        var topbar = document.querySelector('.topbar-wrapper');
        if (topbar && !document.getElementById('custom-admin-link')) {
          clearInterval(check);
          
          // 1. Botão Admin (Existente)
          var a = document.createElement('a');
          a.id = 'custom-admin-link';
          a.href = '/integration/admin';
          a.style.marginLeft = 'auto';
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

          // 2. Seletor de Versões
          var selectContainer = document.createElement('div');
          selectContainer.style.marginLeft = '15px';
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

          // Opção para a versão atual (Principal)
          var currentOpt = document.createElement('option');
          currentOpt.value = '';
          currentOpt.text = 'Versão Atual (${packageVersion})';
          select.appendChild(currentOpt);

          availableVersions.forEach(function(v) {
            if (v === '${packageVersion}') return;
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

  // Servir o JS customizado dinamicamente
  app.getHttpAdapter().get('/swagger-custom.js', (req, res) => {
    res.type('application/javascript');
    res.send(customJsCode);
  });

  // 1. Registro da versão principal (Atual)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'InfoBrasil API Docs',
    customCssUrl: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    customJs: '/swagger-custom.js',
  });

  app.use(
    '/scalar',
    apiReference({
      theme: 'purple',
      content: document,
      showDeveloperTools: 'localhost',
      pageTitle: 'InfoBrasil API Docs',
    }),
  );

  // 2. Registro das versões históricas encontradas em docs/swagger
  swaggerVersions.forEach(({ version, document: versionDoc }) => {
    // Swagger UI: /docs/v1.3.0
    SwaggerModule.setup(`docs/v${version}`, app, versionDoc, {
      customSiteTitle: `InfoBrasil API Docs v${version}`,
      customCssUrl: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      customJs: '/swagger-custom.js',
    });

    // Scalar: /scalar/v1.3.0
    app.use(
      `/scalar/v${version}`,
      apiReference({
        theme: 'purple',
        content: versionDoc,
        showDeveloperTools: 'localhost',
        pageTitle: `InfoBrasil API Docs v${version}`,
      }),
    );
  });
}
