const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePdf() {
  console.log('Iniciando geração do PDF otimizado (2 páginas perfeitas)...');

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Guia de Integração - Giro de Estoque Físico</title>
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

    .callout-amber {
      border-left-color: var(--amber-600);
      background: var(--amber-100);
      color: #78350f;
    }

    .terminal {
      background: var(--slate-900);
      color: #f8fafc;
      font-family: 'Fira Code', Consolas, monospace;
      padding: 6px 10px;
      border-radius: 5px;
      font-size: 8.5px;
      line-height: 1.35;
      margin: 4px 0 6px 0;
      page-break-inside: avoid;
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

    .step-box {
      border: 1px solid var(--slate-200);
      border-radius: 5px;
      padding: 8px 10px;
      margin-bottom: 8px;
      background: #ffffff;
      page-break-inside: avoid;
    }

    .step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
    }

    .step-title {
      font-weight: 700;
      color: var(--slate-900);
      font-size: 9.5px;
    }

    .step-pill {
      background: var(--slate-100);
      font-size: 7.5px;
      padding: 1px 5px;
      border-radius: 3px;
      color: var(--slate-600);
      font-weight: 600;
    }
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
      <span class="badge badge-primary">Guia Prático de Implementação</span>
      <div class="doc-date">Emissão: 15/10/2026 &bull; Versão 1.20</div>
    </div>
  </div>

  <h1>Giro de Estoque Físico: Entradas, Saídas e Saldos</h1>
  <div class="lead">
    Instruções técnicas para recriar com 100% de fidelidade o relatório gerencial <strong>L2.11.1 (Listagem de Giro de Estoque Físico)</strong> do ERP através da InfoAPI, agregando compras, vendas e variantes de grade.
  </div>

  <!-- SEÇÃO 1: OS 3 PILARES -->
  <h2><span class="section-num">1</span> Arquitetura dos Endpoints</h2>
  <div class="grid-3">
    <div class="card">
      <div class="card-title">1. Cadastro & Saldo</div>
      <div class="card-desc">
        <span class="code-tag">GET /products</span><br>
        Lista produtos, marcas, grupos e o saldo em estoque físico atual da filial (<strong>EST_ATUAL</strong>).
      </div>
    </div>
    <div class="card">
      <div class="card-title">2. Entradas (Compras)</div>
      <div class="card-desc">
        <span class="code-tag">GET /purchase-items</span><br>
        Itens de compras no período: data de entrada (<strong>COM_DATA</strong>), quantidades (<strong>ICP_QTDE</strong>) e valores totais.
      </div>
    </div>
    <div class="card">
      <div class="card-title">3. Saídas (Vendas)</div>
      <div class="card-desc">
        <span class="code-tag">GET /order-items</span><br>
        Itens de vendas faturadas no período: quantidades (<strong>IVD_QTDE</strong>), valores líquidos e totais.
      </div>
    </div>
  </div>

  <div class="callout">
    <strong>Enriquecimento Recente na API:</strong> Os endpoints <code>/order-items</code> e <code>/purchase-items</code> agora trazem nativamente as descrições textuais <strong>TAM_DESCRICAO</strong> (tabela TAMANHOS) e <strong>COR_DESCRICAO</strong> (tabela CORES), permitindo preenchimento direto das colunas de grade sem necessidade de de-para no integrador.
  </div>

  <!-- SEÇÃO 2: TABELA DE MAPEAMENTO -->
  <h2><span class="section-num">2</span> Mapeamento das Colunas do Relatório Físico</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 17%;">Coluna no Relatório</th>
        <th style="width: 25%;">Campo na InfoAPI</th>
        <th style="width: 20%;">Endpoint Fornecedor</th>
        <th style="width: 38%;">Regra de Cálculo / Agregação</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>SEÇÃO (GRUPO)</strong></td>
        <td><span class="code-tag">GRU_DESCRICAO</span></td>
        <td><code>/products</code> ou itens</td>
        <td>Agrupador primário das linhas (ex: "COMIDAS", "CORAL").</td>
      </tr>
      <tr>
        <td><strong>CÓDIGO</strong></td>
        <td><span class="code-tag">PRO_CODIGO</span> / <span class="code-tag">PRO_CODIGOBAR</span></td>
        <td><code>/products</code></td>
        <td>Código identificador ou EAN do produto no ERP.</td>
      </tr>
      <tr>
        <td><strong>NOME</strong></td>
        <td><span class="code-tag">PRO_DESCRICAO</span></td>
        <td><code>/products</code></td>
        <td>Descrição cadastral do item.</td>
      </tr>
      <tr>
        <td><strong>TAM</strong></td>
        <td><span class="code-tag">TAM_DESCRICAO</span> (ou <span class="code-tag">TAM_CODIGO</span>)</td>
        <td><code>/purchase-items</code> e <code>/order-items</code></td>
        <td>Tamanho da grade do item (ex: "P", "2M", "4m").</td>
      </tr>
      <tr>
        <td><strong>COR</strong></td>
        <td><span class="code-tag">COR_DESCRICAO</span></td>
        <td><code>/purchase-items</code> e <code>/order-items</code></td>
        <td>Nome da cor da grade (ex: "AMARELO", "LARANJA", "VERMELHO").</td>
      </tr>
      <tr>
        <td><strong>MARCA</strong></td>
        <td><span class="code-tag">MAR_DESCRICAO</span></td>
        <td><code>/products</code></td>
        <td>Nome da marca fabricante (ex: "DIVERSAS", "CLIMBA").</td>
      </tr>
      <tr>
        <td><strong>QTD.EST</strong></td>
        <td><span class="code-tag">EST_ATUAL</span></td>
        <td><code>/products?storeId=1</code></td>
        <td>Estoque físico na filial selecionada no momento da consulta.</td>
      </tr>
      <tr>
        <td><strong>COMPRA &bull; ULT. DATA</strong></td>
        <td><span class="code-tag">COM_DATA</span></td>
        <td><code>/purchase-items</code></td>
        <td>Data mais recente (<span class="code-tag">MAX(COM_DATA)</span>) de entrada no período.</td>
      </tr>
      <tr>
        <td><strong>COMPRA &bull; QTD.</strong></td>
        <td><span class="code-tag">ICP_QTDE</span></td>
        <td><code>/purchase-items</code></td>
        <td>Soma acumulada (<span class="code-tag">&Sigma; ICP_QTDE</span>) comprada no período.</td>
      </tr>
      <tr>
        <td><strong>COMPRA &bull; TOTAL</strong></td>
        <td><span class="code-tag">ICP_TOTAL</span> (ou <span class="code-tag">ICP_LIQUIDO</span>)</td>
        <td><code>/purchase-items</code></td>
        <td>Soma do valor financeiro das notas de entrada no período.</td>
      </tr>
      <tr>
        <td><strong>VENDA &bull; QTD.</strong></td>
        <td><span class="code-tag">IVD_QTDE</span></td>
        <td><code>/order-items</code></td>
        <td>Soma acumulada (<span class="code-tag">&Sigma; IVD_QTDE</span>) vendida no período.</td>
      </tr>
      <tr>
        <td><strong>VENDA &bull; TOTAL</strong></td>
        <td><span class="code-tag">IVD_TOTAL</span> (ou <span class="code-tag">IVD_LIQUIDO</span>)</td>
        <td><code>/order-items</code></td>
        <td>Soma do valor financeiro das vendas faturadas no período.</td>
      </tr>
    </tbody>
  </table>

  <!-- QUEBRA DE PÁGINA PARA O ALGORITMO -->
  <div class="page-break"></div>

  <!-- SEÇÃO 3: PASSO A PASSO TÉCNICO -->
  <h2><span class="section-num">3</span> Roteiro de Consumo e Agregação</h2>

  <div class="step-box">
    <div class="step-header">
      <span class="step-title">Passo 1: Carregar Base de Produtos e Estoque Atual</span>
      <span class="step-pill">1ª Requisição</span>
    </div>
    <div class="terminal">
      <span class="method">GET</span> <span class="url">/api/v1/products?storeId=1&page=1&pageSize=100</span> &bull; <span class="comment">Header: X-Request-Count: true</span>
    </div>
    <div class="card-desc">
      Indexe os produtos em memória por uma chave única (ex: <code>PRO_CODIGO</code>). Armazene o <code>EST_ATUAL</code>, <code>GRU_DESCRICAO</code> e <code>MAR_DESCRICAO</code>. Se houver mais de uma página, utilize o header <code>X-Total-Pages</code> para iterar até o fim.
    </div>
  </div>

  <div class="step-box">
    <div class="step-header">
      <span class="step-title">Passo 2: Consultar Entradas (Período de Compras)</span>
      <span class="step-pill">2ª Requisição</span>
    </div>
    <div class="terminal">
      <span class="method">GET</span> <span class="url">/api/v1/purchase-items?storeId=1&startDate=2021-03-04&endDate=2026-10-15&pageSize=100</span>
    </div>
    <div class="card-desc">
      Para cada item retornado na lista:
      <ul>
        <li>Localize o produto pelo <code>PRO_CODIGO</code> (ou chave composta <code>PRO_CODIGO + TAM_CODIGO + COR_CODIGO</code> para variantes).</li>
        <li>Acumule: <code>comprasQtd += ICP_QTDE</code> e <code>comprasTotal += ICP_TOTAL</code>.</li>
        <li>Atualize a data da última compra: <code>ultDataCompra = max(ultDataCompra, COM_DATA)</code>.</li>
        <li>Capture as descrições <code>TAM_DESCRICAO</code> e <code>COR_DESCRICAO</code> para exibição.</li>
      </ul>
    </div>
  </div>

  <div class="step-box">
    <div class="step-header">
      <span class="step-title">Passo 3: Consultar Saídas (Período de Vendas)</span>
      <span class="step-pill">3ª Requisição</span>
    </div>
    <div class="terminal">
      <span class="method">GET</span> <span class="url">/api/v1/order-items?storeId=1&startDate=2026-10-15&endDate=2026-10-15&pageSize=100</span>
    </div>
    <div class="card-desc">
      Para cada item de venda retornado: localize o produto correspondente e acumule <code>vendasQtd += IVD_QTDE</code> e <code>vendasTotal += IVD_TOTAL</code>.
    </div>
  </div>

  <!-- SEÇÃO 4: CONSOLIDAÇÃO E SUBTOTAIS -->
  <h2><span class="section-num">4</span> Regras de Renderização e Subtotais</h2>
  <div class="grid-3">
    <div class="card">
      <div class="card-title">1. Quebra por Grupo</div>
      <div class="card-desc">
        Ordene os produtos por <code>GRU_DESCRICAO</code>. Imprima o nome do grupo como cabeçalho de seção (ex: <strong>COMIDAS</strong>, <strong>CORAL</strong>).
      </div>
    </div>
    <div class="card">
      <div class="card-title">2. Cálculo de Subtotal</div>
      <div class="card-desc">
        Ao final de cada grupo, gere a linha <strong>SUB-TOTAL</strong> somando <code>COMPRA QTD</code>, <code>COMPRA TOTAL</code>, <code>VENDA QTD</code> e <code>VENDA TOTAL</code> daquele grupo.
      </div>
    </div>
    <div class="card">
      <div class="card-title">3. Total Geral</div>
      <div class="card-desc">
        No rodapé final do relatório, exiba a linha <strong>TOTAL</strong> consolidando a soma de todos os subtotais de todas as categorias.
      </div>
    </div>
  </div>

  <div class="callout callout-amber">
    <strong>Atenção a Registros Sem Movimento:</strong> Se um produto com saldo em estoque físico não teve compras ou vendas no período filtrado, exiba <code>0,00</code> nas respectivas colunas de quantidade e valor, deixando a data da última compra com hífen ou em branco.
  </div>

  <!-- SEÇÃO 5: PERFORMANCE COM HEADERS -->
  <h2><span class="section-num">5</span> Otimização de Performance com X-Request-Count</h2>
  <div class="card-desc" style="margin-bottom: 4px;">
    Ao montar relatórios em lotes que exigem paginação sequencial completa, envie o cabeçalho <code>X-Request-Count: true</code> para receber metadados nos headers de resposta:
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Header HTTP</th>
        <th style="width: 20%;">Exemplo</th>
        <th style="width: 55%;">Significado na Paginação</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>X-Total-Count</code></td>
        <td><code>145</code></td>
        <td>Quantidade total de registros existentes considerando os filtros.</td>
      </tr>
      <tr>
        <td><code>X-Total-Pages</code></td>
        <td><code>3</code></td>
        <td>Número total de páginas que sua aplicação precisará percorrer.</td>
      </tr>
      <tr>
        <td><code>X-Current-Page</code></td>
        <td><code>1</code></td>
        <td>Página atualmente recebida.</td>
      </tr>
      <tr>
        <td><code>X-Per-Page</code></td>
        <td><code>50</code></td>
        <td>Quantidade de registros retornada nesta página.</td>
      </tr>
    </tbody>
  </table>

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

    const targetPdfPath = path.join(targetDir, 'L2.11.1_guia_relatorio_giro_estoque.pdf');

    await page.pdf({
      path: targetPdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-family: 'Inter', sans-serif; font-size: 8px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 10px;">
          <span style="font-weight: 700; color: #0f172a;">Info<span style="color: #059669;">API</span> &bull; Guia de Integração - Giro de Estoque Físico</span>
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

    console.log(`PDF otimizado gerado com sucesso em: ${targetPdfPath}`);

    const artifactDir = 'C:\\Users\\gabriel.bezerra\\.gemini\\antigravity-ide\\brain\\31a25935-a39f-4e6d-b636-46c435167cbd';
    const artifactPdfPath = path.join(artifactDir, 'L2.11.1_guia_relatorio_giro_estoque.pdf');
    fs.copyFileSync(targetPdfPath, artifactPdfPath);
    console.log(`PDF copiado para artefatos em: ${artifactPdfPath}`);

  } finally {
    await browser.close();
  }
}

generatePdf().catch((err) => {
  console.error('Erro ao gerar PDF:', err);
  process.exit(1);
});
