# Diretrizes de Geração de PDFs (PDF Guidance)

Este documento define os padrões visuais, estruturais e técnicos obrigatórios para a geração de relatórios, guias, dossiês e especificações em PDF no ecossistema **Info Vendas API (InfoAPI)**.

---

## 1. Princípios de Design & Identidade Visual

O design dos PDFs deve refletir o padrão corporativo da **Infobrasil Sistemas**: profissional, limpo, moderno e com alta densidade de informação sem poluição visual.

### 1.1 Paleta de Cores
```css
:root {
  /* Marca e Destaque Principal */
  --primary: #059669;        /* Esmeralda corporativo */
  --primary-dark: #047857;
  --primary-light: #d1fae5;
  --primary-bg: #ecfdf5;

  /* Neutros & Tipografia (Slate) */
  --slate-900: #0f172a;      /* Títulos principais e logos */
  --slate-800: #1e293b;      /* Texto padrão do corpo */
  --slate-700: #334155;      /* Subtítulos e cabeçalhos de tabela */
  --slate-600: #475569;      /* Textos secundários */
  --slate-500: #64748b;      /* Labels e legendas */
  --slate-400: #94a3b8;      /* Bordas secundárias */
  --slate-200: #e2e8f0;      /* Divisores */
  --slate-100: #f1f5f9;      /* Fundos suaves e zebra tables */
  --slate-50:  #f8fafc;      /* Fundo de cards e boxes */

  /* Estados e Badges */
  --blue-600:  #2563eb;
  --blue-100:  #dbeafe;
  --amber-600: #d97706;
  --amber-100: #fef3c7;
  --red-600:   #dc2626;
  --red-100:   #fee2e2;
}
```

### 1.2 Tipografia
- **Família de Fontes Principal:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- **Família de Fontes Monospaçada (Código/Endpoints):** `'Fira Code', 'JetBrains Mono', Consolas, 'Courier New', monospace`.
- **Hierarquia:**
  - `H1` (Título do Documento): 24px a 26px, peso 800, cor `--slate-900`.
  - `H2` (Seções Principais): 16px a 18px, peso 700, cor `--slate-900`, borda inferior sutil ou badge.
  - `H3` (Subseções): 13px a 14px, peso 600, cor `--slate-800`.
  - `Corpo de Texto`: 11px a 12px, altura de linha 1.5 a 1.6, cor `--slate-800`.
  - `Labels & Metadados`: 9px a 10px, peso 600, uppercase, letter-spacing 0.5px, cor `--slate-500`.

---

## 2. Estrutura e Grid do Documento

### 2.1 Formato e Margens (A4)
- **Formato:** A4 (`210mm x 297mm`).
- **Orientação:** Retrato (*Portrait*) por padrão. Paisagem (*Landscape*) apenas se tabelas ultrapassarem 8 colunas densas.
- **Margens do Puppeteer:**
  - `top: '25mm'`
  - `bottom: '25mm'`
  - `left: '15mm'`
  - `right: '15mm'`

### 2.2 Header e Footer Automáticos (Puppeteer Template)
Todo documento deve utilizar templates nativos de header e footer do Puppeteer para exibir a numeração contínua e cabeçalho de seção:
- **Header:** Logo `InfoAPI` (`Info` em `#0f172a`, `API` em `#059669`) à esquerda e título/período à direita, separado por borda inferior de 1px.
- **Footer:** `Infobrasil Sistemas © Ano - Gerado em DD/MM/AAAA` à esquerda e `Página <span class="pageNumber"></span> de <span class="totalPages"></span>` à direita.

### 2.3 Controle de Quebra de Página
- Classes utilitárias obrigatórias:
  ```css
  .page-break {
    page-break-before: always;
  }
  .avoid-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  table, tr, .card, .callout {
    page-break-inside: avoid;
  }
  ```

---

## 3. Componentes Visuais Padrão

### 3.1 Header Cover (Cabeçalho da Primeira Página)
```html
<div class="header-cover">
  <div>
    <div class="logo">Info<span>API</span></div>
    <div class="sublogo">Infobrasil Sistemas &bull; Documentação Técnica</div>
  </div>
  <div class="header-meta">
    <span class="badge badge-primary">Guia de Integração</span>
    <div class="doc-date">Data: 15/10/2026</div>
  </div>
</div>
```

### 3.2 Cards de Destaque e Métricas
Cards para sintetizar conceitos-chave, totais ou passos de integração:
- Fundo `--slate-50`, borda 1px `--slate-200`, cantos arredondados de 6px a 8px, padding de 12px a 15px.
- Grid responsivo de 2, 3 ou 4 colunas (`display: grid; gap: 12px;`).

### 3.3 Tabelas de Alta Densidade
- `table`: largura 100%, `border-collapse: collapse`.
- `th`: fundo `--slate-100`, cor `--slate-700`, texto uppercase, tamanho 9px a 10px, padding 8px 10px, alinhamento consistente.
- `td`: padding 7px 10px, tamanho 10px a 11px, borda inferior de 1px `--slate-100`.
- Linhas alternadas (*zebra*) com `--slate-50` quando a tabela contiver mais de 10 linhas.

### 3.4 Callouts & Caixas de Alerta
- Bordas esquerdas sólidas de 4px:
  - **Info/Dica:** borda `--primary`, fundo `--primary-bg`.
  - **Atenção:** borda `--amber-600`, fundo `--amber-100`.
  - **Código/HTTP:** borda `--blue-600`, fundo `--blue-100`.

### 3.5 Blocos de Requisição HTTP e JSON
Blocos com visual de terminal elegante:
- Fundo `--slate-900`, texto `--slate-100` ou verde esmeralda para métodos HTTP (`GET`, `POST`).
- Fonte mono, tamanho 10px, padding 10px 14px, cantos arredondados de 6px.

---

## 4. Motor de Renderização (Puppeteer)

A compilação do HTML para PDF deve ser executada através de script Node.js ou serviço NestJS utilizando **Puppeteer**:
- Opções do browser headless:
  - `--no-sandbox`
  - `--disable-setuid-sandbox`
  - `--disable-dev-shm-usage`
  - `--disable-gpu`
  - `--font-render-hinting=none`
- Opções do `page.pdf()`:
  - `format: 'A4'`
  - `printBackground: true`
  - `displayHeaderFooter: true`
  - `preferCSSPageSize: true`
  - `margin: { top: '25mm', bottom: '25mm', left: '15mm', right: '15mm' }`
- Aguardar o carregamento de fontes:
  ```javascript
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');
  ```
