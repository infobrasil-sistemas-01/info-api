import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

const args = process.argv.slice(2);
const swaggerFileArg = args.find(arg => arg.startsWith('--swaggerFile='));

let swaggerPath = '';
if (swaggerFileArg) {
  swaggerPath = path.resolve(process.cwd(), swaggerFileArg.split('=')[1]);
} else {
  // Default to the latest swagger json in docs/swagger/
  const docsDir = path.join(process.cwd(), 'docs', 'swagger');
  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir).filter(f => f.startsWith('swagger-') && f.endsWith('.json'));
    if (files.length > 0) {
      files.sort((a, b) => b.localeCompare(a));
      swaggerPath = path.join(docsDir, files[0]);
    } else {
      swaggerPath = path.join(process.cwd(), 'swagger-spec.json');
    }
  } else {
    swaggerPath = path.join(process.cwd(), 'swagger-spec.json');
  }
}

function getRefName(ref: string): string {
  if (!ref) return '';
  return ref.split('/').pop() || '';
}

function resolveSchemaTable(schema: any, components: any, indent = 0): string {
  if (!schema) return '<p style="color: #64748b; font-size: 0.85rem; margin: 0;">Nenhum detalhe de campos definido.</p>';
  
  if (schema.$ref) {
    const refName = getRefName(schema.$ref);
    const resolved = components.schemas?.[refName];
    if (resolved) {
      // DTO name omitted as irrelevant for external manual documentation, resolving table directly
      return resolveSchemaTable(resolved, components, indent);
    }
    return `<p style="color: #ef4444; font-size: 0.85rem; margin: 0;">Referência não encontrada</p>`;
  }

  if (schema.type === 'array') {
    if (schema.items) {
      return `
        <div style="font-weight: 600; font-size: 0.85rem; color: #3b82f6; margin-bottom: 6px;">Lista contendo objetos com a estrutura:</div>
        <div style="border-left: 2px solid #3b82f6; padding-left: 12px; margin-left: 4px;">
          ${resolveSchemaTable(schema.items, components, indent + 1)}
        </div>
      `;
    }
    return '<span style="color: #64748b; font-size: 0.85rem;">Array de itens desconhecido</span>';
  }

  if (schema.properties) {
    const requiredFields = schema.required || [];
    let rows = '';
    
    for (const [propName, propVal] of Object.entries<any>(schema.properties)) {
      const isRequired = requiredFields.includes(propName);
      let typeStr = propVal.type || 'object';
      
      // Use language-agnostic types (object / Array<object>) instead of internal DTO class names
      if (propVal.$ref) {
        typeStr = 'object';
      } else if (propVal.type === 'array' && propVal.items) {
        if (propVal.items.$ref) {
          typeStr = 'Array&lt;object&gt;';
        } else {
          typeStr = `Array&lt;${propVal.items.type || 'any'}&gt;`;
        }
      }

      if (propVal.nullable) {
        typeStr += ' | null';
      }

      const desc = propVal.description || '-';
      const constraints: string[] = [];
      if (propVal.maxLength !== undefined) constraints.push(`tamanho máx: ${propVal.maxLength}`);
      if (propVal.minLength !== undefined) constraints.push(`tamanho mín: ${propVal.minLength}`);
      if (propVal.minimum !== undefined) constraints.push(`valor mín: ${propVal.minimum}`);
      if (propVal.maximum !== undefined) constraints.push(`valor máx: ${propVal.maximum}`);
      if (propVal.enum) constraints.push(`valores: [${propVal.enum.join(', ')}]`);
      if (propVal.default !== undefined) constraints.push(`padrão: ${JSON.stringify(propVal.default)}`);
      
      const constraintStr = constraints.length > 0 
        ? `<div style="font-size: 0.75rem; color: #f59e0b; margin-top: 2px; font-weight: 600;">(${constraints.join(', ')})</div>` 
        : '';

      rows += `
        <tr>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 0.8rem; font-weight: 600; color: #0f172a; white-space: nowrap;">
            ${propName}${isRequired ? '<span style="color: #ef4444; margin-left: 2px;">*</span>' : ''}
          </td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 0.75rem; color: #2563eb; font-weight: 600;">
            ${typeStr}
          </td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 0.8rem; color: #334155; line-height: 1.4;">
            ${desc}
            ${constraintStr}
          </td>
        </tr>
      `;
    }

    return `
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; font-size: 0.75rem; color: #475569; text-transform: uppercase; font-weight: 700; width: 30%;">Campo</th>
            <th style="text-align: left; padding: 10px; font-size: 0.75rem; color: #475569; text-transform: uppercase; font-weight: 700; width: 25%;">Tipo</th>
            <th style="text-align: left; padding: 10px; font-size: 0.75rem; color: #475569; text-transform: uppercase; font-weight: 700; width: 45%;">Descrição / Restrições</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  let primitiveDesc = schema.description || '';
  if (schema.enum) {
    primitiveDesc += ` (Opções: ${schema.enum.join(', ')})`;
  }
  return `
    <div style="font-family: monospace; font-size: 0.8rem; color: #334155; padding: 6px 10px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0; display: inline-block;">
      Tipo: <strong style="color: #2563eb;">${schema.type}</strong> ${primitiveDesc ? `- ${primitiveDesc}` : ''}
    </div>
  `;
}

function generateMockJson(schema: any, components: any, depth = 0): any {
  if (depth > 4) return {};
  if (!schema) return null;

  if (schema.$ref) {
    const refName = getRefName(schema.$ref);
    const resolved = components.schemas?.[refName];
    if (resolved) {
      return generateMockJson(resolved, components, depth + 1);
    }
    return `[Ref: ${refName}]`;
  }

  if (schema.type === 'array') {
    return [generateMockJson(schema.items, components, depth + 1)];
  }

  if (schema.properties) {
    const mockObj: any = {};
    for (const [propName, propVal] of Object.entries<any>(schema.properties)) {
      if (propVal.default !== undefined) {
        mockObj[propName] = propVal.default;
      } else if (propVal.example !== undefined) {
        mockObj[propName] = propVal.example;
      } else if (propVal.$ref) {
        mockObj[propName] = generateMockJson(propVal, components, depth + 1);
      } else {
        switch (propVal.type) {
          case 'string':
            if (propVal.format === 'date-time') mockObj[propName] = new Date().toISOString();
            else if (propVal.format === 'email') mockObj[propName] = 'suporte@infobrasilsistemas.com.br';
            else if (propVal.format === 'uuid') mockObj[propName] = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
            else mockObj[propName] = 'exemplo_texto';
            break;
          case 'number':
          case 'integer':
            mockObj[propName] = 123;
            break;
          case 'boolean':
            mockObj[propName] = true;
            break;
          case 'array':
            mockObj[propName] = [];
            break;
          default:
            mockObj[propName] = {};
        }
      }
    }
    return mockObj;
  }

  return schema.default !== undefined ? schema.default : (schema.example !== undefined ? schema.example : schema.type);
}

async function main() {
  console.log(`📖 Loading Swagger specification from: ${swaggerPath}`);
  if (!fs.existsSync(swaggerPath)) {
    console.error(`❌ Swagger JSON file not found at: ${swaggerPath}`);
    process.exit(1);
  }

  const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  const version = swagger.info?.version || '1.0.0';
  const apiTitle = swagger.info?.title || 'Info Vendas API';
  const components = swagger.components || {};

  // Build Tag to Path mappings
  const tags: Record<string, { name: string; description: string; paths: any[] }> = {};
  
  // Register default tags from swagger
  if (swagger.tags) {
    swagger.tags.forEach((t: any) => {
      tags[t.name] = { name: t.name, description: t.description || '', paths: [] };
    });
  }

  // Iterate paths
  for (const [routePath, methods] of Object.entries<any>(swagger.paths)) {
    for (const [method, detail] of Object.entries<any>(methods)) {
      const routeTags = detail.tags || ['Geral'];
      routeTags.forEach((tagName: string) => {
        if (!tags[tagName]) {
          tags[tagName] = { name: tagName, description: '', paths: [] };
        }
        tags[tagName].paths.push({
          path: routePath,
          method: method.toUpperCase(),
          ...detail
        });
      });
    }
  }

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Base64 Logo lookup
  let logoBase64 = '';
  try {
    const logoPath = path.resolve(process.cwd(), 'src/modules/integration-request/templates/assets/logo-infoapi-white.png');
    if (fs.existsSync(logoPath)) {
      logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
    }
  } catch (e) {
    // Keep empty
  }

  console.log('✏️ Compiling HTML Template...');

  let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${apiTitle} - Manual de Integração</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* CSS Page Print Boundaries - Perfect margins for layout & cover */
    @page {
      size: A4;
      margin-top: 25mm;
      margin-bottom: 20mm;
      margin-left: 20mm;
      margin-right: 20mm;
    }
    @page:first {
      margin: 0; /* Cover page spans full A4 bleed area */
    }

    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    /* Print Break Rules */
    .page-break {
      page-break-after: always;
    }
    .avoid-break {
      page-break-inside: avoid;
    }

    /* Cover Page (Takes full width and height with no clipping borders) */
    .cover-container {
      width: 100%;
      height: 100vh;
      min-height: 297mm; /* Full A4 Height */
      background-color: #0f172a;
      color: #ffffff;
      padding: 80px 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      page-break-after: always;
    }
    .cover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cover-middle {
      margin-top: 140px;
    }
    .cover-title {
      font-family: 'Outfit', sans-serif;
      font-size: 3.8rem;
      font-weight: 800;
      line-height: 1.1;
      margin: 0;
    }
    .cover-title span {
      color: #10b981;
    }
    .cover-subtitle {
      font-family: 'Outfit', sans-serif;
      font-size: 1.5rem;
      font-weight: 500;
      color: #94a3b8;
      margin-top: 20px;
      margin-bottom: 0;
      line-height: 1.3;
    }
    .cover-divider {
      width: 90px;
      height: 5px;
      background: #10b981;
      margin-top: 35px;
      border-radius: 99px;
    }
    .cover-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #1e293b;
      padding-top: 30px;
      font-size: 0.9rem;
      color: #64748b;
    }

    /* Standard Layout */
    .content-section {
      padding: 20px 0;
      page-break-before: always;
    }
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .section-desc {
      color: #475569;
      font-size: 0.95rem;
      margin-bottom: 25px;
    }

    /* Endpoint Cards */
    .endpoint-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 25px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      page-break-inside: avoid;
    }
    .endpoint-header {
      background: #f8fafc;
      padding: 12px 15px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      font-family: 'Outfit', sans-serif;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 4px;
      color: white;
      text-transform: uppercase;
    }
    .badge-get { background: #10b981; }
    .badge-post { background: #3b82f6; }
    .badge-put, .badge-patch { background: #f59e0b; }
    .badge-delete { background: #ef4444; }

    .endpoint-path {
      font-family: monospace;
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
    }
    .endpoint-summary {
      font-size: 0.85rem;
      color: #64748b;
      margin-left: auto;
      font-weight: 500;
    }
    .endpoint-body {
      padding: 15px;
    }
    .endpoint-desc {
      color: #334155;
      font-size: 0.9rem;
      margin-top: 0;
      margin-bottom: 15px;
    }

    .subsection-title {
      font-family: 'Outfit', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
      margin-top: 15px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Terminal Blocks for Mock Json */
    .terminal-block {
      background: #0f172a;
      color: #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      font-family: monospace;
      font-size: 0.75rem;
      overflow-x: auto;
      margin-top: 6px;
      margin-bottom: 15px;
      border: 1px solid #1e293b;
      line-height: 1.4;
    }

    /* Status tables */
    .status-badge {
      font-family: monospace;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .status-2xx { background: rgba(16, 185, 129, 0.12); color: #10b981; }
    .status-4xx { background: rgba(245, 158, 11, 0.12); color: #d97706; }
    .status-5xx { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-container">
    <div class="cover-header">
      ${
        logoBase64
          ? `<img src="${logoBase64}" alt="InfoAPI" style="height: 38px; display: block;" />`
          : `<span style="font-family: 'Outfit', sans-serif; font-size: 1.8rem; font-weight: 800; color: #ffffff;">Info<span style="color: #10b981;">API</span></span>`
      }
      <span style="background-color: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.8rem; font-weight: bold; padding: 4px 12px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.25);">Versão v${version}</span>
    </div>
    
    <div class="cover-middle">
      <h1 class="cover-title">Manual de<br><span>Integração Técnica</span></h1>
      <p class="cover-subtitle">Documentação Completa de Endpoints, Payloads e DTOs de Dados</p>
      <div class="cover-divider"></div>
    </div>

    <div class="cover-footer">
      <div>
        <div style="font-weight: 600; color: #ffffff; font-family: 'Outfit', sans-serif; font-size: 1rem;">Suporte Técnico InfoAPI</div>
        <div style="margin-top: 4px;">suporte@infobrasilsistemas.com.br</div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 500;">Gerado em</div>
        <div style="color: #ffffff; font-weight: 600; margin-top: 4px;">${currentDate}</div>
      </div>
    </div>
  </div>

  <!-- Intro page (Dummy break to push next page properly) -->
  <div class="page-break"></div>

  <!-- Introduction Document -->
  <div style="padding: 20px 0;">
    <h2 style="font-family: 'Outfit', sans-serif; font-size: 2rem; color: #0f172a; margin-top: 0;">Introdução ao Sistema</h2>
    <p style="font-size: 1rem; color: #334155; line-height: 1.6;">
      Este documento serve como o manual técnico definitivo para a equipe de suporte e parceiros de integração da <strong>InfoAPI</strong>. 
      Aqui são descritos todos os caminhos (endpoints), cabeçalhos, parâmetros de busca, regras de negócio e payloads que compõem o ecossistema da versão <strong>v${version}</strong>.
    </p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 15px; border-radius: 0 6px 6px 0; margin: 25px 0;">
      <h4 style="margin: 0 0 5px 0; font-family: 'Outfit', sans-serif; font-size: 0.95rem; color: #0f172a;">💡 Padrão de Requisições da API</h4>
      <p style="margin: 0; font-size: 0.85rem; color: #475569; line-height: 1.5;">
        Todos os endpoints expostos pelo sistema são prefixados estritamente com <code>api/v1</code> e requerem autenticação por meio do cabeçalho HTTP 
        <code>Authorization: Bearer &lt;Token_JWT&gt;</code> (com exceção dos fluxos de Login e Setup de senha).
      </p>
    </div>

    <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: #0f172a; margin-top: 30px;">Especificação dos Módulos</h3>
    <p style="color: #334155; line-height: 1.6;">
      Os tópicos a seguir estão agrupados por controladores de escopo do sistema de vendas, integradores de retaguarda (PostgreSQL) e bancos de filiais (Firebird).
    </p>
  </div>
`;

  // Render Routes by Tag
  for (const tag of Object.values(tags)) {
    if (tag.paths.length === 0) continue;

    htmlContent += `
      <div class="content-section">
        <h2 class="section-title">${tag.name}</h2>
        ${tag.description ? `<p class="section-desc">${tag.description}</p>` : ''}
    `;

    for (const r of tag.paths) {
      const methodClass = r.method.toLowerCase();

      // Intercept and document HTTP Security requirements (Basic / Bearer Auth)
      let securityHtml = '';
      if (r.security && r.security.length > 0) {
        const isBasic = r.security.some((s: any) => 'basic' in s);
        const isBearer = r.security.some((s: any) => 'bearer' in s);

        if (isBasic) {
          securityHtml = `
            <div style="background-color: rgba(59, 130, 246, 0.08); border-left: 4px solid #3b82f6; padding: 12px 15px; border-radius: 6px; margin-bottom: 20px; font-size: 0.85rem; color: #1e3a8a; line-height: 1.5; font-weight: 500;">
              <span style="font-size: 1rem; margin-right: 4px;">🔒</span> <strong>Autenticação Obrigatória:</strong> HTTP Basic Authentication.
              <div style="margin-top: 6px; font-size: 0.8rem; color: #475569;">
                Envie suas credenciais codificadas em Base64 no cabeçalho HTTP de requisição:
              </div>
              <code style="display: block; background: rgba(59, 130, 246, 0.12); padding: 6px 10px; border-radius: 4px; margin-top: 6px; font-family: monospace; font-size: 0.8rem; color: #1d4ed8; word-break: break-all;">
                Authorization: Basic &lt;Base64(usuario:senha)&gt;
              </code>
            </div>
          `;
        } else if (isBearer) {
          securityHtml = `
            <div style="background-color: rgba(16, 185, 129, 0.08); border-left: 4px solid #10b981; padding: 12px 15px; border-radius: 6px; margin-bottom: 20px; font-size: 0.85rem; color: #065f46; line-height: 1.5; font-weight: 500;">
              <span style="font-size: 1rem; margin-right: 4px;">🔒</span> <strong>Autenticação Obrigatória:</strong> JWT Bearer Token.
              <div style="margin-top: 6px; font-size: 0.8rem; color: #475569;">
                Envie o token de acesso obtido no login no cabeçalho HTTP de cada requisição subsequente:
              </div>
              <code style="display: block; background: rgba(16, 185, 129, 0.12); padding: 6px 10px; border-radius: 4px; margin-top: 6px; font-family: monospace; font-size: 0.8rem; color: #047857; word-break: break-all;">
                Authorization: Bearer &lt;Token_JWT&gt;
              </code>
            </div>
          `;
        }
      }
      
      // Request Body
      let requestBodyHtml = '';
      if (r.requestBody && r.requestBody.content && r.requestBody.content['application/json']) {
        const schema = r.requestBody.content['application/json'].schema;
        const mockJsonObj = generateMockJson(schema, components);
        const mockJsonStr = JSON.stringify(mockJsonObj, null, 2);
        
        requestBodyHtml = `
          <div class="subsection-title">Corpo da Requisição (Payload)</div>
          ${resolveSchemaTable(schema, components)}
          <div class="subsection-title">Exemplo de Payload (JSON)</div>
          <pre class="terminal-block">${mockJsonStr}</pre>
        `;
      }

      // Query/Path/Header Parameters
      let paramsHtml = '';
      if (r.parameters && r.parameters.length > 0) {
        let rows = '';
        r.parameters.forEach((p: any) => {
          const isRequired = p.required ? '<span style="color: #ef4444; margin-left: 2px;">*</span>' : '';
          const typeStr = p.schema?.type || 'string';
          const enumStr = p.schema?.enum ? `<div style="font-size: 0.75rem; color: #f59e0b; font-weight: 600;">Valores: [${p.schema.enum.join(', ')}]</div>` : '';
          const defaultStr = p.schema?.default !== undefined ? `<div style="font-size: 0.75rem; color: #64748b;">Padrão: ${p.schema.default}</div>` : '';

          rows += `
            <tr>
              <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 0.8rem; font-weight: 600; color: #0f172a;">
                ${p.name}${isRequired}
              </td>
              <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 0.75rem; color: #64748b;">
                ${p.in} (${typeStr})
              </td>
              <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 0.8rem; color: #334155; line-height: 1.4;">
                ${p.description || '-'}
                ${enumStr}
                ${defaultStr}
              </td>
            </tr>
          `;
        });

        paramsHtml = `
          <div class="subsection-title">Parâmetros (Query, Path ou Headers)</div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="text-align: left; padding: 10px; font-size: 0.75rem; color: #475569; text-transform: uppercase; font-weight: 700; width: 30%;">Parâmetro</th>
                <th style="text-align: left; padding: 10px; font-size: 0.75rem; color: #475569; text-transform: uppercase; font-weight: 700; width: 25%;">Local / Tipo</th>
                <th style="text-align: left; padding: 10px; font-size: 0.75rem; color: #475569; text-transform: uppercase; font-weight: 700; width: 45%;">Descrição</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        `;
      }

      // Responses
      let responsesHtml = '';
      if (r.responses) {
        let rows = '';
        for (const [statusCode, respDetail] of Object.entries<any>(r.responses)) {
          const badgeClass = statusCode.startsWith('2') ? 'status-2xx' : (statusCode.startsWith('4') ? 'status-4xx' : 'status-5xx');
          let schemaDetails = '';
          let jsonExample = '';

          if (respDetail.content && respDetail.content['application/json']) {
            const schema = respDetail.content['application/json'].schema;
            schemaDetails = resolveSchemaTable(schema, components);
            const mockJsonObj = generateMockJson(schema, components);
            jsonExample = `<pre class="terminal-block" style="margin-top: 8px;">${JSON.stringify(mockJsonObj, null, 2)}</pre>`;
          }

          rows += `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; vertical-align: top; width: 15%;">
                <span class="status-badge ${badgeClass}">${statusCode}</span>
              </td>
              <td style="padding: 10px; vertical-align: top; width: 85%;">
                <div style="font-weight: 600; color: #334155; font-size: 0.85rem;">${respDetail.description || ''}</div>
                ${schemaDetails ? `<div style="margin-top: 8px;">${schemaDetails}</div>` : ''}
                ${jsonExample}
              </td>
            </tr>
          `;
        }

        responsesHtml = `
          <div class="subsection-title">Respostas Esperadas (HTTP Responses)</div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="text-align: left; padding: 10px; font-size: 0.75rem; color: #475569; text-transform: uppercase; font-weight: 700; width: 15%;">Código</th>
                <th style="text-align: left; padding: 10px; font-size: 0.75rem; color: #475569; text-transform: uppercase; font-weight: 700; width: 85%;">Descrição / Estrutura do Retorno</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        `;
      }

      htmlContent += `
        <div class="endpoint-card">
          <div class="endpoint-header">
            <span class="badge badge-${methodClass}">${r.method}</span>
            <span class="endpoint-path">${r.path}</span>
            ${r.summary ? `<span class="endpoint-summary">${r.summary}</span>` : ''}
          </div>
          <div class="endpoint-body">
            ${r.description ? `<p class="endpoint-desc">${r.description}</p>` : ''}
            ${securityHtml}
            ${paramsHtml}
            ${requestBodyHtml}
            ${responsesHtml}
          </div>
        </div>
      `;
    }

    htmlContent += `</div>`; // Close content-section
  }

  htmlContent += `
</body>
</html>
  `;

  // Create .tmp directory if it doesn't exist
  const tmpDir = path.resolve(process.cwd(), '.tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
    console.log(`📁 Created temporary directory at: ${tmpDir}`);
  }

  // Write temporary HTML file inside .tmp
  const tempHtmlPath = path.resolve(tmpDir, 'temp-swagger-export.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');
  console.log(`📝 Generated intermediate HTML file at: ${tempHtmlPath}`);

  // Determine Output PDF path inside .tmp
  const baseName = path.basename(swaggerPath, '.json');
  const outputPdfName = `${baseName}.pdf`;
  const outputPdfPath = path.resolve(tmpDir, outputPdfName);

  console.log('🚀 Launching Puppeteer headless browser with premium font rendering flags...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none', // Remove hinting to prevent serration
      '--enable-font-antialiasing',  // Enable font antialiasing in PDF compilation
      '--enable-subpixel-positioning' // High precision subpixel spacing
    ]
  });

  try {
    const page = await browser.newPage();
    console.log('📄 Loading HTML content...');
    await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });

    console.log('⏳ Waiting for web fonts to load...');
    await page.evaluateHandle('document.fonts.ready');

    console.log('🖨️ Printing PDF to file...');
    await page.pdf({
      path: outputPdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 8px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          <span style="font-weight: 700; color: #0f172a;">Info<span style="color: #10b981;">API</span> - Manual de Integração</span>
          <span>Versão <span style="font-weight: 700; color: #10b981;">v${version}</span></span>
        </div>
      `,
      footerTemplate: `
        <div style="font-family: 'Inter', sans-serif; font-size: 8px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px;">
          <span>Infobrasil Sistemas &copy; ${new Date().getFullYear()}</span>
          <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>
      `
      // NO STATIC MARGINS IN JS OPTIONS!
      // This is crucial to let Chromium respect CSS @page & @page:first margins and prevent cover cuts!
    });

    console.log(`✅ Success! PDF created at: ${outputPdfPath}`);
  } catch (error) {
    console.error('❌ Failed during PDF compilation:', error);
  } finally {
    await browser.close();
    // Clean up temporary HTML
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

main();
