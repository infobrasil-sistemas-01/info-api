const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePdf() {
  console.log('Iniciando geração do Guia de Solicitação de Acesso - Ordens de Produção...');

  // Caminhos das imagens fornecidas pelo usuário
  const img1Path = 'C:/Users/gabriel.bezerra/.gemini/antigravity/brain/307eb63c-771a-4415-8de8-ba59cab029fc/.user_uploaded/media_1793976246877_0e78e721.png';
  const img2Path = 'C:/Users/gabriel.bezerra/.gemini/antigravity/brain/307eb63c-771a-4415-8de8-ba59cab029fc/.user_uploaded/media_1793976256972_a5f24648.png';

  const img1Base64 = fs.existsSync(img1Path)
    ? `data:image/png;base64,${fs.readFileSync(img1Path).toString('base64')}`
    : '';

  const img2Base64 = fs.existsSync(img2Path)
    ? `data:image/png;base64,${fs.readFileSync(img2Path).toString('base64')}`
    : '';

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Guia de Solicitação de Acesso - Integração de Ordens de Produção</title>
  <style>
    :root {
      --primary: #059669;
      --primary-dark: #047857;
      --primary-light: #d1fae5;
      --primary-bg: #ecfdf5;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-500: #64748b;
      --slate-400: #94a3b8;
      --slate-200: #e2e8f0;
      --slate-100: #f1f5f9;
      --slate-50:  #f8fafc;
      --blue-600:  #2563eb;
      --blue-100:  #dbeafe;
      --blue-50:   #eff6ff;
      --amber-600: #d97706;
      --amber-100: #fef3c7;
      --red-600:   #dc2626;
      --red-100:   #fee2e2;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--slate-800);
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 9.5px;
      line-height: 1.45;
    }

    .page-break {
      page-break-before: always;
    }

    .avoid-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Header Cover */
    .header-cover {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 8px;
      margin-bottom: 12px;
    }

    .logo {
      font-size: 20px;
      font-weight: 800;
      color: var(--slate-900);
      letter-spacing: -0.5px;
    }

    .logo span {
      color: var(--primary);
    }

    .sublogo {
      font-size: 8px;
      color: var(--slate-500);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-top: 1px;
    }

    .header-meta {
      text-align: right;
    }

    .badge {
      display: inline-block;
      font-size: 8px;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-primary {
      background-color: var(--primary-light);
      color: var(--primary-dark);
    }

    .badge-blue {
      background-color: var(--blue-100);
      color: var(--blue-600);
    }

    .doc-date {
      font-size: 8px;
      color: var(--slate-500);
      margin-top: 2px;
    }

    h1 {
      font-size: 15px;
      color: var(--slate-900);
      margin: 0 0 3px 0;
      font-weight: 800;
      letter-spacing: -0.3px;
    }

    .lead {
      font-size: 9.5px;
      color: var(--slate-600);
      margin-bottom: 10px;
      line-height: 1.4;
    }

    h2 {
      font-size: 11px;
      color: var(--slate-900);
      margin: 12px 0 6px 0;
      font-weight: 700;
      border-left: 3px solid var(--primary);
      padding-left: 6px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    h3 {
      font-size: 10px;
      color: var(--slate-800);
      margin: 8px 0 4px 0;
      font-weight: 700;
    }

    p {
      margin: 0 0 6px 0;
    }

    /* Callout & Cards */
    .callout {
      border-left: 4px solid var(--primary);
      background-color: var(--primary-bg);
      padding: 8px 12px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 10px;
      font-size: 9px;
    }

    .callout-title {
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 2px;
      font-size: 9.5px;
    }

    .callout-blue {
      border-left: 4px solid var(--blue-600);
      background-color: var(--blue-50);
    }

    .callout-blue .callout-title {
      color: var(--blue-600);
    }

    .portal-link {
      color: var(--blue-600);
      font-weight: 700;
      text-decoration: underline;
      font-family: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
      font-size: 9px;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }

    .grid-card {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      padding: 8px 10px;
    }

    .card-title {
      font-size: 9.5px;
      font-weight: 700;
      color: var(--slate-900);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Prints Section */
    .screenshot-box {
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      background: #0d1614;
      padding: 6px;
      text-align: center;
      margin: 6px 0 8px 0;
    }

    .screenshot-img {
      max-width: 100%;
      height: auto;
      max-height: 88px;
      border-radius: 4px;
      display: block;
      margin: 0 auto;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      margin-bottom: 6px;
      font-size: 8.5px;
    }

    th {
      background-color: var(--slate-100);
      color: var(--slate-700);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5px;
      letter-spacing: 0.5px;
      padding: 4px 6px;
      text-align: left;
      border-bottom: 1px solid var(--slate-200);
    }

    td {
      padding: 4px 6px;
      border-bottom: 1px solid var(--slate-100);
      vertical-align: middle;
    }

    .code-tag {
      font-family: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
      background: #e2e8f0;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 7.5px;
      font-weight: 600;
    }

    .method-badge {
      display: inline-block;
      font-size: 7.5px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
      text-transform: uppercase;
    }

    .method-get {
      background-color: var(--blue-100);
      color: var(--blue-600);
    }

    .method-post {
      background-color: var(--primary-light);
      color: var(--primary-dark);
    }

    /* JSON Box */
    .json-box {
      background-color: var(--slate-900);
      color: #f8fafc;
      font-family: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
      font-size: 8px;
      padding: 8px 10px;
      border-radius: 5px;
      line-height: 1.35;
      margin: 4px 0 8px 0;
      overflow: hidden;
    }

    .json-key { color: #38bdf8; }
    .json-string { color: #34d399; }
    .json-number { color: #f472b6; }
    .json-comment { color: #94a3b8; font-style: italic; }

    /* Steps */
    .step-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 6px;
    }

    .step-num {
      background-color: var(--primary);
      color: #ffffff;
      font-weight: 800;
      font-size: 8.5px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .step-content {
      flex: 1;
    }

    .step-title {
      font-weight: 700;
      color: var(--slate-900);
      font-size: 9px;
      margin-bottom: 1px;
    }

    /* Signature Box */
    .signature-card {
      background-color: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 6px;
      padding: 10px 14px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .signature-info {
      display: flex;
      flex-direction: column;
    }

    .signature-name {
      font-size: 11px;
      font-weight: 800;
      color: var(--slate-900);
    }

    .signature-role {
      font-size: 9px;
      font-weight: 600;
      color: var(--primary);
      margin-top: 1px;
    }

    .signature-dept {
      font-size: 8px;
      color: var(--slate-500);
      margin-top: 1px;
    }

    .signature-badge {
      text-align: right;
    }
  </style>
</head>
<body>

  <!-- ==================== PÁGINA 1 ==================== -->
  <div class="header-cover">
    <div>
      <div class="logo">Info<span>API</span></div>
      <div class="sublogo">Infobrasil Sistemas &bull; Documentação Técnica &bull; Engenharia de Software</div>
    </div>
    <div class="header-meta">
      <span class="badge badge-primary">Guia de Credenciamento</span>
      <div class="doc-date">Emissão: Novembro / 2026</div>
    </div>
  </div>

  <h1>Solicitação de Acesso e Permissões: Ordens de Produção</h1>
  <div class="lead">
    Instruções obrigatórias para solicitação e habilitação dos escopos de integração do módulo de <strong>Ordens de Produção</strong> e <strong>Produtos</strong> no formulário oficial da InfoAPI.
  </div>

  <div class="callout callout-blue">
    <div class="callout-title">🌐 Formulário de Credenciamento Oficial</div>
    Para solicitar as credenciais de integração (Client ID e Secret / M2M), acesse o portal:<br>
    <a class="portal-link" href="https://info-api.infobrasilsistemas.com.br/integration/form">https://info-api.infobrasilsistemas.com.br/integration/form</a>
  </div>

  <h2>1. Contexto e Finalidade da Integração</h2>
  <p>
    A <strong>InfoAPI</strong> disponibiliza a suíte de endpoints para gestão de <strong>Ordens de Produção</strong> diretamente no ERP Infobrasil. Este recurso é padronizado e de <strong>uso geral</strong>, permitindo que qualquer sistema integrador (MES, PCP, WMS, e-commerce ou plataformas externas de planejamento industrial) emita e acompanhe ordens de fabricação de forma automatizada, rastreável e em conformidade contábil.
  </p>
  <p>
    Para que a aplicação integradora consiga emitir ordens de produção e correlacionar produtos e insumos, é <strong>estritamente necessário</strong> marcar os módulos e ações corretas na seção <strong>"Escopo e Permissões"</strong> do formulário de credenciamento.
  </p>

  <h2>2. Escopos e Permissões Necessárias no Formulário</h2>
  <p>
    Ao preencher o formulário, na seção <strong>Escopo e Permissões</strong>, adicione exatamente os dois módulos a seguir:
  </p>

  <!-- MÓDULO 1: PRODUTOS -->
  <div class="grid-card avoid-break" style="margin-bottom: 12px;">
    <div class="card-title">
      <span>Módulo 1: Produtos</span>
      <span class="badge badge-primary">Ação: Ver</span>
    </div>

    <div class="screenshot-box">
      ${img1Base64 ? `<img src="${img1Base64}" class="screenshot-img" alt="Print Módulo Produtos - Ação Ver">` : '<div style="color: #94a3b8; font-size: 8px;">Print: Módulo Produtos [x] Ver</div>'}
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Permissão RBAC</th>
          <th style="width: 20%;">Endpoint Autorizado</th>
          <th style="width: 55%;">Por que solicitar e qual a finalidade?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="code-tag">tenant.products.read</span></td>
          <td><span class="method-badge method-get">GET</span> <span class="code-tag">/api/v1/products</span></td>
          <td>
            <strong>Mapeamento de Insumos e Produtos Finais:</strong> Antes de criar uma Ordem de Produção, o integrador precisa conhecer os códigos internos (<span class="code-tag">product_id</span> / <span class="code-tag">PRO_CODIGO</span>) cadastrados no catálogo do ERP, conferindo descrições, estoques e referências dos insumos e produtos acabados.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PÁGINA 2: QUEBRA CONTROLADA -->
  <div class="page-break"></div>

  <!-- ==================== PÁGINA 2 ==================== -->
  <div class="header-cover">
    <div>
      <div class="logo">Info<span>API</span></div>
      <div class="sublogo">Infobrasil Sistemas &bull; Guia de Credenciamento &bull; Ordens de Produção</div>
    </div>
    <div class="header-meta">
      <span class="badge badge-blue">Especificação de Escopos</span>
      <div class="doc-date">Novembro / 2026</div>
    </div>
  </div>

  <!-- MÓDULO 2: ORDENS DE PRODUÇÃO -->
  <div class="grid-card avoid-break" style="margin-bottom: 12px;">
    <div class="card-title">
      <span>Módulo 2: Ordens de Produção</span>
      <span class="badge badge-primary">Ações: Ver &bull; Criar</span>
    </div>

    <div class="screenshot-box">
      ${img2Base64 ? `<img src="${img2Base64}" class="screenshot-img" alt="Print Módulo Ordens de Produção - Ações Ver e Criar">` : '<div style="color: #94a3b8; font-size: 8px;">Print: Módulo Ordens de Produção [x] Ver [x] Criar</div>'}
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Permissão RBAC</th>
          <th style="width: 20%;">Endpoint Autorizado</th>
          <th style="width: 55%;">Por que solicitar e qual a finalidade?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="code-tag">tenant.production-orders.create</span></td>
          <td><span class="method-badge method-post">POST</span> <span class="code-tag">/api/v1/production-order</span></td>
          <td>
            <strong>Emissão Atômica da Ordem:</strong> Permite gravar novas ordens de fabricação no ERP com o produto acabado e os insumos declarados (<span class="code-tag">items</span>). A InfoAPI valida os produtos, apura os custos fiscais unitários (<span class="code-tag">PRO_PRCCOMPRAFISCAL</span>) e consolida <span class="code-tag">ORDENSPRODUCAO</span> e <span class="code-tag">ORDENSPRODUCAOITENS</span> em transação atômica.
          </td>
        </tr>
        <tr>
          <td><span class="code-tag">tenant.production-orders.read</span></td>
          <td><span class="method-badge method-get">GET</span> <span class="code-tag">/api/v1/production-order</span><br><span class="method-badge method-get">GET</span> <span class="code-tag">/api/v1/production-order/:id</span></td>
          <td>
            <strong>Consulta e Reconciliação:</strong> Permite listar ordens de produção emitidas com paginação e filtros (loja, datas, situação e produto) e consultar o espelho detalhado da ordem com seus itens, custos rateados e número oficial (<span class="code-tag">ORP_NUMERO</span>).
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2>3. Fluxo Recomendado de Integração</h2>
  <div class="grid-2">
    <div class="grid-card">
      <div class="step-item">
        <div class="step-num">1</div>
        <div class="step-content">
          <div class="step-title">Credenciamento & Token</div>
          Submeter o formulário solicitando <strong>Produtos (Ver)</strong> e <strong>Ordens de Produção (Ver + Criar)</strong> para receber as credenciais e gerar o token JWT via autenticação M2M.
        </div>
      </div>
      <div class="step-item" style="margin-bottom: 0;">
        <div class="step-num">2</div>
        <div class="step-content">
          <div class="step-title">Consulta de Insumos</div>
          Utilizar <span class="code-tag">GET /api/v1/products</span> para obter os identificadores (<span class="code-tag">product_id</span>) dos insumos e do produto acabado que serão utilizados na ordem.
        </div>
      </div>
    </div>

    <div class="grid-card">
      <div class="step-item">
        <div class="step-num">3</div>
        <div class="step-content">
          <div class="step-title">Emissão da Ordem (POST)</div>
          Enviar <span class="code-tag">POST /api/v1/production-order</span> com o produto final, quantidade planejada e a lista de insumos consumidos (<span class="code-tag">items: [{ product_id, quantity }]</span>).
        </div>
      </div>
      <div class="step-item" style="margin-bottom: 0;">
        <div class="step-num">4</div>
        <div class="step-content">
          <div class="step-title">Auditoria e Espelho (GET)</div>
          Acompanhar o status da produção e consultar os detalhes completos da ordem emitida através de <span class="code-tag">GET /api/v1/production-order/:id</span>.
        </div>
      </div>
    </div>
  </div>

  <h2>4. Exemplo de Payload para Emissão (<span class="code-tag">POST /api/v1/production-order</span>)</h2>
  <div class="json-box">
{
  <span class="json-key">"product_id"</span>: <span class="json-number">45</span>, <span class="json-comment">// ID ou código do produto acabado a produzir</span>
  <span class="json-key">"quantity"</span>: <span class="json-number">50.0</span>, <span class="json-comment">// Quantidade a produzir (maior que zero)</span>
  <span class="json-key">"store_id"</span>: <span class="json-number">1</span>, <span class="json-comment">// Loja/filial emitente (em M2M pode ser herdado do token)</span>
  <span class="json-key">"user_id"</span>: <span class="json-number">10</span>, <span class="json-comment">// Código do operador no ERP</span>
  <span class="json-key">"start_date"</span>: <span class="json-string">"2026-11-10"</span>, <span class="json-comment">// Previsão de início (YYYY-MM-DD)</span>
  <span class="json-key">"end_date"</span>: <span class="json-string">"2026-11-15"</span>, <span class="json-comment">// Previsão de entrega (YYYY-MM-DD)</span>
  <span class="json-key">"store_note"</span>: <span class="json-string">"Lote especial fabricação integração"</span>,
  <span class="json-key">"items"</span>: [ <span class="json-comment">// Lista obrigatória de insumos consumidos</span>
    { <span class="json-key">"product_id"</span>: <span class="json-number">101</span>, <span class="json-key">"quantity"</span>: <span class="json-number">25.0</span> },
    { <span class="json-key">"product_id"</span>: <span class="json-number">102</span>, <span class="json-key">"quantity"</span>: <span class="json-number">12.5</span> }
  ]
}
  </div>

  <!-- ASSINATURA -->
  <div class="signature-card avoid-break">
    <div class="signature-info">
      <div class="signature-name">Gabriel Camurça</div>
      <div class="signature-role">Desenvolvimento Infobrasil</div>
      <div class="signature-dept">Engenharia de Software &bull; Infobrasil Sistemas &bull; Suporte à Integração</div>
    </div>
    <div class="signature-badge">
      <span class="badge badge-primary">InfoAPI v1.20</span>
      <div style="font-size: 7.5px; color: var(--slate-500); margin-top: 2px;">Documento Oficial</div>
    </div>
  </div>

</body>
</html>`;

  const outputDir = path.resolve(process.cwd(), 'docs', 'guides');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfFileName = 'guia_solicitacao_integracao_ordens_producao.pdf';
  const targetPdfPath = path.join(outputDir, pdfFileName);

  console.log('Iniciando Puppeteer headless...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
      '--enable-font-antialiasing',
      '--enable-subpixel-positioning',
    ],
  });

  try {
    const page = await browser.newPage();
    console.log('Carregando conteúdo HTML...');
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    console.log('Aguardando fontes...');
    await page.evaluateHandle('document.fonts.ready');

    console.log('Compilando PDF em formato A4...');
    await page.pdf({
      path: targetPdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-family: 'Inter', -apple-system, sans-serif; font-size: 7.5px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 35px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-top: 8px;">
          <span style="font-weight: 700; color: #0f172a;">Info<span style="color: #059669;">API</span> &bull; Guia de Solicitação de Acesso e Permissões</span>
          <span>Infobrasil Sistemas</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-family: 'Inter', -apple-system, sans-serif; font-size: 7.5px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 35px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 3px; margin-bottom: 8px;">
          <span>Infobrasil Sistemas &copy; 2026 &bull; Portal: https://info-api.infobrasilsistemas.com.br</span>
          <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>
      `,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '12mm',
        right: '12mm',
      },
    });

    console.log(`✅ Sucesso! PDF gerado em: ${targetPdfPath}`);

    // Copiar também para o diretório de artefatos da conversa
    const artifactDir = 'C:\\Users\\gabriel.bezerra\\.gemini\\antigravity\\brain\\307eb63c-771a-4415-8de8-ba59cab029fc';
    if (fs.existsSync(artifactDir)) {
      const artifactPdfPath = path.join(artifactDir, pdfFileName);
      fs.copyFileSync(targetPdfPath, artifactPdfPath);
      console.log(`✅ PDF copiado para artefatos em: ${artifactPdfPath}`);
    }

  } finally {
    await browser.close();
  }
}

generatePdf().catch((err) => {
  console.error('❌ Erro na geração do Guia PDF:', err);
  process.exit(1);
});
