import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import path from 'path';
import fs from 'fs';

export function setupSwagger(app: INestApplication) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageVersion = fs.existsSync(packageJsonPath)
    ? JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version
    : '1.0.0';

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
      Para verificar a disponibilidade da API acesse nossa <a href='https://stats.uptimerobot.com/zHdEriLG2n/'>Página de Status</a>
      <br><br>
      A API é organizada em módulos, cada um responsável por uma área específica do sistema, como produtos, clientes, vendas, etc.`,
    )
    .setContact('InfoBrasil Sistemas', 'https://www.infobrasilsistemas.com.br', 'suporte@infobrasilsistemas.com.br')
    .setVersion(packageVersion)
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
    .addTag('AccountReceivable', 'Endpoints relacionados à gestão de contas a receber');

  if (process.env.NODE_ENV === 'development') {
    builder.addServer(
      'http://localhost:3336',
      'Servidor local para desenvolvimento',
    );
  }

  builder.addServer(
    'https://info-api.infobrasilsistemas.com.br',
    'Servidor de produção',
  )

  const config = builder.build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'development') {
    const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  }

  const customJsCode = `
    (function() {
      var check = setInterval(function() {
        var topbar = document.querySelector('.topbar-wrapper');
        if (topbar && !document.getElementById('custom-admin-link')) {
          clearInterval(check);
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
        }
      }, 100);
    })();
  `;

  // Servir o JS customizado dinamicamente
  app.getHttpAdapter().get('/swagger-custom.js', (req, res) => {
    res.type('application/javascript');
    res.send(customJsCode);
  });

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
}
