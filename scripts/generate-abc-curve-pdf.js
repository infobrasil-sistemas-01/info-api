const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePdf() {
  console.log('Iniciando geração do Guia PDF: Curva ABC Dimensional de Vendas...');

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Guia de Integração - Curva ABC Dimensional de Vendas</title>
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
      font-size: 10px;
      line-height: 1.45;
    }

    .header-cover {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 10px;
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
      font-size: 8.5px;
      color: var(--slate-500);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    .header-meta {
      text-align: right;
    }

    .badge {
      display: inline-block;
      font-size: 8.5px;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-primary {
      background-color: var(--primary-light);
      color: var(--primary-dark);
    }

    .doc-date {
      font-size: 8.5px;
      color: var(--slate-500);
      margin-top: 3px;
    }

    h1 {
      font-size: 16px;
      color: var(--slate-900);
      margin: 0 0 4px 0;
      font-weight: 800;
      letter-spacing: -0.3px;
    }

    .lead {
      font-size: 10px;
      color: var(--slate-600);
      margin-bottom: 10px;
      line-height: 1.35;
    }

    h2 {
      font-size: 11.5px;
      color: var(--slate-900);
      margin: 12px 0 6px 0;
      font-weight: 700;
      border-bottom: 1px solid var(--slate-200);
      padding-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .section-num {
      background: var(--slate-100);
      color: var(--primary-dark);
      font-size: 9px;
      padding: 1px 5px;
      border-radius: 3px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 10px;
    }

    .card {
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-radius: 5px;
      padding: 8px 10px;
    }

    .card-title {
      font-size: 9.5px;
      font-weight: 700;
      color: var(--slate-900);
      margin-bottom: 3px;
    }

    .card-desc {
      font-size: 8.5px;
      color: var(--slate-600);
      line-height: 1.3;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0 10px 0;
      page-break-inside: avoid;
    }

    th {
      background: var(--slate-100);
      color: var(--slate-700);
      font-size: 8px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 5px 6px;
      border-bottom: 1px solid var(--slate-200);
      text-align: left;
    }

    td {
      padding: 4px 6px;
      font-size: 8.5px;
      border-bottom: 1px solid var(--slate-100);
      color: var(--slate-800);
    }

    tr:nth-child(even) td {
      background: #fafafa;
    }

    .code-tag {
      font-family: 'Fira Code', Consolas, monospace;
      font-size: 8px;
      background: #e2e8f0;
      color: #0f172a;
      padding: 1px 3px;
      border-radius: 3px;
      font-weight: 600;
    }

    .callout {
      border-left: 3px solid var(--primary);
      background: var(--primary-bg);
      padding: 6px 10px;
      border-radius: 0 4px 4px 0;
      margin: 8px 0;
      font-size: 8.5px;
      color: #064e3b;
      line-height: 1.35;
      page-break-inside: avoid;
    }

    .callout-blue {
      border-left-color: var(--blue-600);
      background: var(--blue-100);
      color: #1e3a8a;
    }

    .callout-amber {
      border-left-color: var(--amber-600);
      background: var(--amber-100);
      color: #78350f;
    }

    .terminal {
      background: var(--slate-900);
      color: #f8fafc;
      font-family: 'Fira Code', Consolas, monospace;
      padding: 7px 11px;
      border-radius: 5px;
      font-size: 8px;
      line-height: 1.4;
      margin: 4px 0 8px 0;
      page-break-inside: avoid;
      overflow-x: hidden;
    }

    .terminal .method {
      color: #34d399;
      font-weight: 700;
    }

    .terminal .url {
      color: #93c5fd;
    }

    .terminal .comment {
      color: #64748b;
    }

    .page-break {
      page-break-before: always;
    }

    .class-badge {
      display: inline-block;
      font-weight: 800;
      font-size: 7.5px;
      padding: 1px 4px;
      border-radius: 3px;
    }
    .class-a { background: #dcfce7; color: #166534; }
    .class-b { background: #fef3c7; color: #854d0e; }
    .class-c { background: #fee2e2; color: #991b1b; }
  </style>
</head>
<body>

  <!-- HEADER COVER -->
  <div class="header-cover">
    <div>
      <div class="logo">Info<span>API</span></div>
      <div class="sublogo">Infobrasil Sistemas &bull; Manual de Soluções e Integrações</div>
    </div>
    <div class="header-meta">
      <span class="badge badge-primary">Guia de Integração Analítica</span>
      <div class="doc-date">Emissão: 22/10/2026 &bull; Versão 1.20</div>
    </div>
  </div>

  <h1>Curva ABC Dimensional de Vendas (Princípio de Pareto)</h1>
  <div class="lead">
    Instruções técnicas para consumo do endpoint analítico de alta performance <strong>GET /api/v1/orders/abc-curve</strong>, permitindo estratificar vendas por múltiplos eixos (Vendedores, Lojas, Grupos, Marcas, Clientes e Produtos) com cálculo automático de participação, faturamento acumulado e classes A, B e C.
  </div>

  <!-- SEÇÃO 1: OBJETIVO E PRINCÍPIO DE PARETO -->
  <h2><span class="section-num">1</span> O que é a Curva ABC e seu Objetivo de Negócio</h2>
  <div class="card-desc" style="margin-bottom: 8px;">
    A <strong>Curva ABC</strong> baseia-se no <strong>Princípio de Pareto (Regra 80/20)</strong>, identificando que uma parcela concentrada de itens é responsável pela grande maioria do faturamento de um negócio. Na InfoAPI, ela organiza o desempenho comercial em três categorias estratégicas:
  </div>

  <div class="grid-3">
    <div class="card">
      <div class="card-title"><span class="class-badge class-a">CLASSE A</span> &bull; Alto Impacto</div>
      <div class="card-desc">
        Concentra até <strong>70% do faturamento acumulado</strong>. Representa o núcleo essencial de receita (ex: vendedores líderes, produtos de altíssimo giro e marcas âncora).
      </div>
    </div>
    <div class="card">
      <div class="card-title"><span class="class-badge class-b">CLASSE B</span> &bull; Impacto Intermediário</div>
      <div class="card-desc">
        Compreende a faixa entre <strong>70% e 90% do faturamento acumulado</strong>. Entidades com desempenho comercial equilibrado e potencial de expansão.
      </div>
    </div>
    <div class="card">
      <div class="card-title"><span class="class-badge class-c">CLASSE C</span> &bull; Cauda Longa</div>
      <div class="card-desc">
        Engloba os <strong>10% finais do faturamento acumulado</strong> (90% a 100%). Itens e contas de menor volume financeiro relativo.
      </div>
    </div>
  </div>

  <!-- SEÇÃO 2: PERMISSÕES E ACESSO -->
  <h2><span class="section-num">2</span> Governança de Acesso e Autenticação</h2>
  <div class="callout callout-blue">
    <strong>Acesso Imediato:</strong> Este endpoint utiliza o escopo padrão de <strong>Visualização de Vendas / Pedidos</strong> da API. Qualquer token de integração ou credencial autenticada que já possua permissão de leitura sobre pedidos tem autorização imediata para consumir a Curva ABC, sem necessidade de liberação de novos privilégios ou configurações adicionais.
  </div>

  <!-- SEÇÃO 3: PARÂMETROS E DIMENSÕES -->
  <h2><span class="section-num">3</span> Especificação dos Parâmetros de Consulta</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 17%;">Parâmetro</th>
        <th style="width: 13%;">Tipo</th>
        <th style="width: 12%;">Padrão</th>
        <th style="width: 58%;">Descrição e Regras de Negócio</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>startDate</code></td>
        <td><span class="code-tag">YYYY-MM-DD</span></td>
        <td><em>Obrigatório</em></td>
        <td>Data inicial da janela de apuração de vendas.</td>
      </tr>
      <tr>
        <td><code>endDate</code></td>
        <td><span class="code-tag">YYYY-MM-DD</span></td>
        <td><em>Obrigatório</em></td>
        <td>Data final da janela de apuração de vendas (deve ser &ge; <code>startDate</code>).</td>
      </tr>
      <tr>
        <td><code>groupBy</code></td>
        <td><span class="code-tag">enum</span></td>
        <td><code>SELLER</code></td>
        <td>Dimensão de agrupamento: <code>SELLER</code>, <code>STORE</code>, <code>GROUP</code>, <code>BRAND</code>, <code>CUSTOMER</code> ou <code>PRODUCT</code>.</td>
      </tr>
      <tr>
        <td><code>system</code></td>
        <td><span class="code-tag">enum</span></td>
        <td><code>PED</code></td>
        <td>Origem das vendas: <code>PED</code> (Vendas de Retaguarda / Pedidos), <code>PDV</code> (Frente de Caixa) ou <code>ALL</code> (Ambos).</td>
      </tr>
      <tr>
        <td><code>situation</code></td>
        <td><span class="code-tag">number</span></td>
        <td><code>2</code></td>
        <td>Código da situação da venda no ERP (<code>2</code> = Fechada / Faturada).</td>
      </tr>
      <tr>
        <td><code>orderBy</code></td>
        <td><span class="code-tag">enum</span></td>
        <td><code>NAME</code></td>
        <td>Critério de ordenação: <code>NAME</code> (Alfabético A-Z), <code>VALUE</code> (Financeiro) ou <code>QUANTITY</code> (Volume).</td>
      </tr>
      <tr>
        <td><code>page</code> / <code>pageSize</code></td>
        <td><span class="code-tag">number</span></td>
        <td><code>1</code> / <code>50</code></td>
        <td>Controle de paginação. <strong>Obrigatório para CUSTOMER e PRODUCT</strong> (máximo de 100 por página).</td>
      </tr>
    </tbody>
  </table>

  <!-- QUEBRA DE PÁGINA PARA SEGUNDA FOLHA -->
  <div class="page-break"></div>

  <!-- SEÇÃO 4: SALVAGUARDAS ARQUITETURAIS -->
  <h2><span class="section-num">4</span> Diretrizes Técnicas & Salvaguardas de Consumo</h2>

  <div class="grid-3">
    <div class="card">
      <div class="card-title">1. Controle de Volumetria</div>
      <div class="card-desc">
        Para entidades com milhares de registros (<code>CUSTOMER</code> e <code>PRODUCT</code>), a API exige os parâmetros de paginação <code>page</code> e <code>pageSize</code> (máximo de 100 itens por página), prevenindo sobrecarga de tráfego e garantindo respostas ágeis.
      </div>
    </div>
    <div class="card">
      <div class="card-title">2. Integridade dos Dados</div>
      <div class="card-desc">
        Vendas ou produtos sem identificadores vinculados no ERP são desconsiderados automaticamente da consolidação, garantindo 100% de consistência nas somatórias e percentuais calculados.
      </div>
    </div>
    <div class="card">
      <div class="card-title">3. Consultas de Longo Período</div>
      <div class="card-desc">
        O endpoint é otimizado para apurações com janelas temporais extensas, permitindo que relatórios semestrais, anuais ou históricos sejam gerados sem restrição de teto de dias.
      </div>
    </div>
  </div>

  <div class="callout callout-amber">
    <strong>Precisão Global em Consultas Paginadas:</strong> Mesmo ao paginar clientes ou produtos (ex: Página 1 com 50 registros), as colunas <code>quantityPercent</code> (% Qtd) e <code>valuePercent</code> (% Valor) refletem a participação real daquele registro frente ao <strong>universo total faturado no período</strong>, e não apenas frente à página corrente.
  </div>

  <!-- SEÇÃO 5: EXEMPLO PRÁTICO DE CONSUMO -->
  <h2><span class="section-num">5</span> Exemplo Prático de Requisição e Resposta JSON</h2>

  <div class="card-desc" style="margin-bottom: 4px;">
    Exemplo de consulta da Curva ABC por Vendedor (reproduzindo os dados da Listagem L2.5.2 do ERP Retaguarda):
  </div>

  <div class="terminal">
    <span class="method">GET</span> <span class="url">/api/v1/orders/abc-curve?groupBy=SELLER&startDate=2026-01-22&endDate=2026-10-22&orderBy=NAME</span><br>
    <span class="comment">Authorization: Bearer &lt;token_jwt&gt;</span>
  </div>

  <div class="terminal" style="font-size: 7.5px; line-height: 1.3;">
{<br>
&nbsp;&nbsp;<span class="url">"dimension"</span>: <span class="method">"SELLER"</span>,<br>
&nbsp;&nbsp;<span class="url">"period"</span>: { <span class="url">"startDate"</span>: "2026-01-22", <span class="url">"endDate"</span>: "2026-10-22" },<br>
&nbsp;&nbsp;<span class="url">"summary"</span>: {<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"totalQuantity"</span>: 57.00,<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"totalValue"</span>: 27275.88,<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"entityCount"</span>: 6<br>
&nbsp;&nbsp;},<br>
&nbsp;&nbsp;<span class="url">"items"</span>: [<br>
&nbsp;&nbsp;&nbsp;&nbsp;{<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"position"</span>: 1, <span class="url">"code"</span>: 41, <span class="url">"name"</span>: "ALISSON - HOMOBR",<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"soldQuantity"</span>: 1.00, <span class="url">"soldValue"</span>: 100.00,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"quantityPercent"</span>: 1.75, <span class="url">"valuePercent"</span>: 0.37, <span class="url">"cumulativePercent"</span>: 0.37,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"classification"</span>: <span class="method">"A"</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;},<br>
&nbsp;&nbsp;&nbsp;&nbsp;{<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"position"</span>: 2, <span class="url">"code"</span>: 49, <span class="url">"name"</span>: "CARLOS CESAR - DAVI",<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"soldQuantity"</span>: 8.00, <span class="url">"soldValue"</span>: 6632.00,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"quantityPercent"</span>: 14.04, <span class="url">"valuePercent"</span>: 24.31, <span class="url">"cumulativePercent"</span>: 24.68,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"classification"</span>: <span class="method">"A"</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;},<br>
&nbsp;&nbsp;&nbsp;&nbsp;{<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"position"</span>: 6, <span class="url">"code"</span>: 18, <span class="url">"name"</span>: "THIAGO - HOMOBR",<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"soldQuantity"</span>: 30.00, <span class="url">"soldValue"</span>: 8583.33,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"quantityPercent"</span>: 52.63, <span class="url">"valuePercent"</span>: 31.47, <span class="url">"cumulativePercent"</span>: 100.00,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="url">"classification"</span>: <span class="method">"C"</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;]<br>
}
  </div>

</body>
</html>
`;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    await page.evaluateHandle('document.fonts.ready');

    const targetDir = path.join(__dirname, '..', 'docs', 'guides');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPdfPath = path.join(targetDir, 'L2.5.2_guia_curva_abc_vendas.pdf');

    await page.pdf({
      path: targetPdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-family: 'Inter', sans-serif; font-size: 8px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 10px;">
          <span style="font-weight: 700; color: #0f172a;">Info<span style="color: #059669;">API</span> &bull; Guia de Integração - Curva ABC Dimensional de Vendas</span>
          <span>Infobrasil Sistemas</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-family: 'Inter', sans-serif; font-size: 8px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px; margin-bottom: 10px;">
          <span>Infobrasil Sistemas &copy; 2026 &bull; Suporte: https://info-api.infobrasilsistemas.com.br</span>
          <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>
      `,
      margin: {
        top: '25mm',
        bottom: '25mm',
        left: '15mm',
        right: '15mm',
      },
    });

    console.log(`PDF do Guia da Curva ABC gerado com sucesso em: ${targetPdfPath}`);

    const artifactDir = 'C:\\Users\\gabriel.bezerra\\.gemini\\antigravity-ide\\brain\\61f68b6b-5a99-4502-91e4-a39384188650';
    if (!fs.existsSync(artifactDir)) {
      fs.mkdirSync(artifactDir, { recursive: true });
    }
    const artifactPdfPath = path.join(artifactDir, 'L2.5.2_guia_curva_abc_vendas.pdf');
    fs.copyFileSync(targetPdfPath, artifactPdfPath);
    console.log(`PDF copiado para o diretório de artefatos em: ${artifactPdfPath}`);

  } finally {
    await browser.close();
  }
}

generatePdf().catch((err) => {
  console.error('Erro ao gerar Guia PDF:', err);
  process.exit(1);
});
