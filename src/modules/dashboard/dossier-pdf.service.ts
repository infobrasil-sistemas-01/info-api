import { Injectable, Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Injectable()
export class DossierPdfService {
  private readonly logger = new Logger(DossierPdfService.name);

  async generateDossierPdf(
    type: 'internal' | 'client',
    data: any,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    this.logger.log(`Iniciando geração de PDF para dossiê do tipo: ${type}`);

    const htmlContent = this.compileHtml(type, data, startDate, endDate);

    const puppeteer = await import('puppeteer');
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none',
        '--enable-font-antialiasing',
        '--enable-subpixel-positioning',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
      await page.evaluateHandle('document.fonts.ready');

      const dateStr = this.safeFormat(new Date(), 'dd/MM/yyyy HH:mm');
      const title =
        type === 'internal'
          ? 'Dossiê Executivo Interno'
          : `Dossiê de Uso - ${data.user?.username}`;

      const pdfBuffer = Buffer.from(
        await page.pdf({
          format: 'A4',
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: `
            <div style="font-family: 'Inter', sans-serif; font-size: 8px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 10px;">
              <span style="font-weight: 700; color: #0f172a;">Info<span style="color: #059669;">API</span> - ${title}</span>
              <span>Período: ${this.safeFormat(startDate, 'dd/MM/yyyy HH:mm')} a ${this.safeFormat(endDate, 'dd/MM/yyyy HH:mm')}</span>
            </div>
          `,
          footerTemplate: `
            <div style="font-family: 'Inter', sans-serif; font-size: 8px; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px; margin-bottom: 10px;">
              <span>Infobrasil Sistemas &copy; ${new Date().getFullYear()} - Gerado em ${dateStr}</span>
              <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
            </div>
          `,
          margin: {
            top: '25mm',
            bottom: '25mm',
            left: '15mm',
            right: '15mm',
          },
        }),
      );

      this.logger.log(`PDF gerado com sucesso (${pdfBuffer.length} bytes)`);
      return pdfBuffer;
    } catch (error) {
      this.logger.error(
        'Erro na compilação do PDF pelo Puppeteer',
        error.stack,
      );
      throw error;
    } finally {
      await browser.close();
    }
  }

  private compileHtml(
    type: 'internal' | 'client',
    data: any,
    startDate: Date,
    endDate: Date,
  ): string {
    const formattedStart = this.safeFormat(
      startDate,
      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
      { locale: ptBR },
    );
    const formattedEnd = this.safeFormat(
      endDate,
      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
      { locale: ptBR },
    );

    const brandingStyles = `
      :root {
        --primary: #059669;
        --primary-dark: #047857;
        --primary-light: #d1fae5;
        --slate-900: #0f172a;
        --slate-800: #1e293b;
        --slate-700: #334155;
        --slate-600: #475569;
        --slate-50: #f8fafc;
        --slate-100: #f1f5f9;
        --red-600: #dc2626;
        --red-100: #fee2e2;
        --amber-600: #d97706;
        --amber-100: #fef3c7;
      }
      body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        color: var(--slate-800);
        background: #ffffff;
        margin: 0;
        padding: 0;
        font-size: 13px;
        line-height: 1.5;
      }
      .container {
        padding: 0;
      }
      h1, h2, h3, h4 {
        color: var(--slate-900);
        margin-top: 0;
        font-weight: 700;
      }
      .page-break {
        page-break-before: always;
      }
      .header-cover {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid var(--primary);
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .logo {
        font-size: 24px;
        font-weight: 800;
        color: var(--slate-900);
      }
      .logo span {
        color: var(--primary);
      }
      .badge {
        font-size: 10px;
        padding: 3px 8px;
        border-radius: 4px;
        font-weight: 600;
        text-transform: uppercase;
      }
      .badge-primary {
        background-color: var(--primary-light);
        color: var(--primary-dark);
      }
      .badge-success {
        background-color: var(--primary-light);
        color: var(--primary-dark);
      }
      .badge-muted {
        background-color: var(--slate-100);
        color: var(--slate-500);
      }
      .grid-5 {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
        margin-bottom: 25px;
      }
      .grid-4 {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-bottom: 25px;
      }
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin-bottom: 25px;
      }
      .grid-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 25px;
      }
      .card {
        background: var(--slate-50);
        border: 1px solid var(--slate-100);
        border-radius: 8px;
        padding: 15px;
      }
      .card-stat {
        text-align: center;
      }
      .stat-val {
        font-size: 22px;
        font-weight: 700;
        color: var(--slate-900);
        margin: 5px 0;
      }
      .stat-label {
        font-size: 10px;
        color: var(--slate-500);
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        margin-bottom: 25px;
      }
      .table th {
        background: var(--slate-100);
        color: var(--slate-700);
        text-align: left;
        padding: 8px 10px;
        font-size: 10px;
        text-transform: uppercase;
        font-weight: 600;
        border-bottom: 2px solid var(--slate-100);
      }
      .table td {
        padding: 8px 10px;
        border-bottom: 1px solid var(--slate-100);
        font-size: 11px;
      }
      .table tr:last-child td {
        border-bottom: none;
      }
      .text-right {
        text-align: right;
      }
      .text-center {
        text-align: center;
      }
      .text-success {
        color: var(--primary);
      }
      .text-error {
        color: var(--red-600);
      }
      .chart-container {
        border: 1px solid var(--slate-100);
        border-radius: 8px;
        padding: 15px;
        background: #ffffff;
        margin-bottom: 25px;
      }
      .progress-bar-container {
        width: 100%;
        background-color: var(--slate-100);
        border-radius: 4px;
        height: 8px;
        overflow: hidden;
        margin-top: 5px;
      }
      .progress-bar {
        height: 100%;
        background-color: var(--primary);
      }
      .alert-box {
        padding: 10px 15px;
        border-radius: 6px;
        margin-bottom: 15px;
        font-size: 11px;
      }
      .alert-box-warning {
        background-color: var(--amber-100);
        color: var(--amber-600);
        border-left: 4px solid var(--amber-600);
      }
      .alert-box-danger {
        background-color: var(--red-100);
        color: var(--red-600);
        border-left: 4px solid var(--red-600);
      }
    `;

    if (type === 'client') {
      return this.renderClientHtml(
        data,
        formattedStart,
        formattedEnd,
        brandingStyles,
      );
    } else {
      return this.renderInternalHtml(
        data,
        formattedStart,
        formattedEnd,
        brandingStyles,
      );
    }
  }

  private renderClientHtml(
    data: any,
    start: string,
    end: string,
    styles: string,
  ): string {
    const successRateStr = data.summary.successRate.toFixed(2);
    const usagePercent =
      data.user.planReqMonth > 0
        ? (data.user.monthlyRequests / data.user.planReqMonth) * 100
        : 0;

    let alertBoxHtml = '';
    if (usagePercent >= 100) {
      alertBoxHtml = `
        <div class="alert-box alert-box-danger">
          <strong>Atenção:</strong> Esta empresa atingiu <strong>${usagePercent.toFixed(1)}%</strong> da franquia mensal do plano (${data.user.monthlyRequests.toLocaleString('pt-BR')} de ${data.user.planReqMonth.toLocaleString('pt-BR')} requisições). O acesso pode sofrer limitações de acordo com a política comercial.
        </div>
      `;
    } else if (usagePercent >= 80) {
      alertBoxHtml = `
        <div class="alert-box alert-box-warning">
          <strong>Atenção:</strong> Esta empresa atingiu <strong>${usagePercent.toFixed(1)}%</strong> da franquia mensal do plano (${data.user.monthlyRequests.toLocaleString('pt-BR')} de ${data.user.planReqMonth.toLocaleString('pt-BR')} requisições). Sugere-se iniciar negociações de upgrade.
        </div>
      `;
    }

    const timeSeriesSvg = this.generateTimeSeriesSvg(data.timeSeries);
    const statusRows = this.generateStatusRows(data.statusDistribution);
    const endpointRows = data.topEndpoints
      .map(
        (ep: any) => `
      <tr>
        <td style="font-family: monospace; font-weight: 600; color: var(--slate-900);">${ep.method}</td>
        <td style="font-family: monospace;">${ep.path}</td>
        <td class="text-right">${(ep.totalRequests ?? 0).toLocaleString('pt-BR')}</td>
        <td class="text-right ${(ep.successRate ?? 0) >= 95 ? 'text-success' : 'text-error'}">${(ep.successRate ?? 0).toFixed(1)}%</td>
        <td class="text-right">${(ep.avgLatency ?? 0).toFixed(0)} ms</td>
        <td class="text-right">${(ep.p95Latency ?? 0).toFixed(0)} ms</td>
      </tr>
    `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Dossiê de Uso da API</title>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Capa / Cabeçalho -->
          <div class="header-cover">
            <div>
              <div class="logo">Info<span>API</span></div>
              <div style="font-size: 11px; color: var(--slate-500); margin-top: 4px;">Relatório de Desempenho e Consumo</div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-primary">Cliente</span>
              <div style="font-size: 16px; font-weight: 700; color: var(--slate-900); margin-top: 5px;">${data.user.username}</div>
              <div style="font-size: 10px; color: var(--slate-500);">${data.user.email || ''}</div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <p style="margin: 0; color: var(--slate-600);">
              Este dossiê detalha a volumetria, comportamento e qualidade técnica do consumo das APIs da InfoBrasil pela empresa 
              <strong>${data.user.username}</strong> no período de <strong>${start}</strong> a <strong>${end}</strong>.
            </p>
          </div>

          ${alertBoxHtml}

          <!-- Quadro de Resumo de Uso -->
          <h3 style="border-left: 3px solid var(--primary); padding-left: 8px; margin-bottom: 12px; font-size: 14px;">Resumo Executivo</h3>
          <div class="grid-4">
            <div class="card card-stat">
              <div class="stat-label">Requisições no Período</div>
              <div class="stat-val">${data.summary.totalRequests.toLocaleString('pt-BR')}</div>
              <div style="font-size: 9px; color: var(--slate-500);">Período selecionado</div>
            </div>
            <div class="card card-stat">
              <div class="stat-label">Taxa de Sucesso</div>
              <div class="stat-val ${data.summary.successRate >= 98 ? 'text-success' : 'text-error'}">${successRateStr}%</div>
              <div style="font-size: 9px; color: var(--slate-500);">${data.summary.rateLimitHits.toLocaleString('pt-BR')} bloqueios de limite</div>
            </div>
            <div class="card card-stat">
              <div class="stat-label">Latência p95</div>
              <div class="stat-val">${data.summary.p95Latency.toLocaleString('pt-BR')} ms</div>
              <div style="font-size: 9px; color: var(--slate-500);">Tempo máximo para 95% das reqs</div>
            </div>
            <div class="card card-stat">
              <div class="stat-label">Requisições / Minuto (RPM)</div>
              <div class="stat-val">${(data.summary.currentRpm ?? 0).toLocaleString('pt-BR')} RPM</div>
              <div style="font-size: 9px; color: var(--slate-500);">Média no período: ${(data.summary.averageRpm ?? 0).toLocaleString('pt-BR')}</div>
            </div>
          </div>

          <!-- Informações de Plano e Contrato comercial -->
          <div class="card" style="margin-bottom: 25px; border-left: 4px solid var(--primary);">
            <h4 style="margin-bottom: 8px;">Dados de Contrato & Limite Mensal</h4>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
              <div>
                <div style="font-size: 9px; color: var(--slate-500); text-transform: uppercase;">Plano</div>
                <div style="font-weight: 700; font-size: 13px; color: var(--slate-900);">${data.user.planName}</div>
              </div>
              <div>
                <div style="font-size: 9px; color: var(--slate-500); text-transform: uppercase;">Franquia Mensal</div>
                <div style="font-weight: 700; font-size: 13px; color: var(--slate-900);">${data.user.planReqMonth.toLocaleString('pt-BR')} reqs</div>
              </div>
              <div>
                <div style="font-size: 9px; color: var(--slate-500); text-transform: uppercase;">Consumo Atual do Mês</div>
                <div style="font-weight: 700; font-size: 13px; color: var(--slate-900);">${data.user.monthlyRequests.toLocaleString('pt-BR')} reqs</div>
              </div>
              <div>
                <div style="font-size: 9px; color: var(--slate-500); text-transform: uppercase;">Utilização</div>
                <div style="font-weight: 700; font-size: 13px; color: ${usagePercent >= 80 ? 'var(--red-600)' : 'var(--primary)'};">${usagePercent.toFixed(1)}%</div>
              </div>
            </div>
            <div class="progress-bar-container" style="height: 6px; margin-top: 12px;">
              <div class="progress-bar" style="width: ${Math.min(usagePercent, 100)}%; background-color: ${usagePercent >= 80 ? 'var(--red-600)' : 'var(--primary)'};"></div>
            </div>
          </div>

          <!-- Histórico Temporal de Requisições -->
          <h3 style="border-left: 3px solid var(--primary); padding-left: 8px; margin-bottom: 12px; font-size: 14px;">Evolução Temporal do Consumo</h3>
          <div class="chart-container">
            ${timeSeriesSvg}
          </div>

          <div class="page-break"></div>

          <!-- Distribuição de Erros -->
          <h3 style="border-left: 3px solid var(--primary); padding-left: 8px; margin-bottom: 12px; font-size: 14px; margin-top: 15px;">Status das Respostas</h3>
          <div class="card" style="margin-bottom: 25px;">
            <div style="font-weight: 600; font-size: 11px; margin-bottom: 10px; color: var(--slate-600);">Distribuição das Classes de Status HTTP:</div>
            ${statusRows}
          </div>

          <!-- Top Endpoints mais Acessados -->
          <h3 style="border-left: 3px solid var(--primary); padding-left: 8px; margin-bottom: 12px; font-size: 14px;">Endpoints mais Utilizados</h3>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 60px;">Método</th>
                <th>Rota</th>
                <th class="text-right" style="width: 100px;">Total Acessos</th>
                <th class="text-right" style="width: 80px;">Sucesso</th>
                <th class="text-right" style="width: 80px;">Média Lat.</th>
                <th class="text-right" style="width: 80px;">Latência p95</th>
              </tr>
            </thead>
            <tbody>
              ${endpointRows || '<tr><td colspan="6" class="text-center">Nenhum endpoint acessado no período.</td></tr>'}
            </tbody>
          </table>

          <!-- Glossário -->
          <div class="page-break"></div>
          <h3 style="border-left: 3px solid var(--primary); padding-left: 8px; margin-bottom: 15px; font-size: 14px;">Glossário de Termos</h3>
          <p style="font-size: 11px; color: var(--slate-600); margin-bottom: 20px; line-height: 1.6;">
            Este glossário auxilia na interpretação técnica e comercial dos indicadores apresentados neste dossiê de uso.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Requisição (Request)</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Qualquer chamada de API realizada pelos sistemas do cliente para consultar ou enviar informações ao Info Vendas.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Taxa de Sucesso / Disponibilidade</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Percentual de requisições que retornaram resposta bem-sucedida (códigos HTTP da família 2xx/3xx), sem erros graves de sistema.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Latência Média</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Tempo médio que a API leva para processar uma requisição e enviar a resposta de volta ao cliente, medido em milissegundos (ms).</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Latência p95</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Métrica estatística que representa o tempo de resposta máximo observado em 95% das requisições mais rápidas. Indica a experiência de uso na maioria absoluta das chamadas, ignorando picos de tráfego atípicos.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Bloqueios de Limite (Rate Limit / Hit Limit)</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Ocorrências em que o cliente ultrapassa o limite acordado de requisições por segundo ou minuto, resultando em bloqueios temporários (HTTP 429) para preservar a estabilidade da infraestrutura.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Franquia Mensal (Limite de Contrato)</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Volume máximo de requisições mensais acordado no plano comercial do cliente. Consumos acima de 80% do limite sugerem a necessidade de upgrades.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Status HTTP (Códigos de Retorno)</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Respostas padronizadas do servidor que indicam o resultado do processamento de uma requisição:</p>
              <ul style="margin: 4px 0 0 15px; padding: 0; color: var(--slate-600); font-size: 11px; list-style-type: disc; line-height: 1.5;">
                <li><strong>2xx (Sucesso)</strong>: A operação foi realizada corretamente (ex: 200 OK).</li>
                <li><strong>4xx (Erro do Cliente)</strong>: A requisição contém dados incorretos, faltantes ou o recurso solicitado não existe (ex: 400 Bad Request, 404 Not Found).</li>
                <li><strong>429 (Too Many Requests)</strong>: Limite de taxa de requisições temporariamente excedido pelo cliente.</li>
                <li><strong>5xx (Erro do Servidor)</strong>: Ocorreu uma falha inesperada na infraestrutura ou no processamento interno da InfoAPI.</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private renderInternalHtml(
    data: any,
    start: string,
    end: string,
    styles: string,
  ): string {
    const successRateStr = data.summary.successRate.toFixed(2);

    const hbStatus = data.heartbeat?.status === 'ACTIVE' ? 'Ativo' : 'Inativo';
    const hbColor =
      data.heartbeat?.status === 'ACTIVE' ? 'var(--primary)' : 'var(--red-600)';
    const hbBg =
      data.heartbeat?.status === 'ACTIVE'
        ? 'var(--primary-light)'
        : 'var(--red-100)';
    const hbLastSeen = data.heartbeat?.lastSeen
      ? this.safeFormat(data.heartbeat.lastSeen, 'dd/MM/yyyy HH:mm:ss')
      : 'Nunca visto';

    const alertRows = data.proactiveAlerts
      .map(
        (user: any) => `
      <tr>
        <td style="font-weight: 600; color: var(--slate-900);">${user.username}</td>
        <td>${user.email || '-'}</td>
        <td>${user.planName}</td>
        <td class="text-right">${(user.monthlyRequests ?? 0).toLocaleString('pt-BR')} / ${(user.planReqMonth ?? 0).toLocaleString('pt-BR')}</td>
        <td class="text-right" style="font-weight: 700; color: var(--red-600);">${(user.usagePercentage ?? 0).toFixed(1)}%</td>
        <td class="text-center">
          ${
            user.notified
              ? `<span class="badge badge-success">Sim</span>`
              : `<span class="badge badge-muted">Não</span>`
          }
        </td>
      </tr>
    `,
      )
      .join('');

    const topUsersRows = data.topUsers
      .map(
        (user: any) => `
      <tr>
        <td style="font-weight: 600; color: var(--slate-900);">${user.username}</td>
        <td>${user.planName || 'Sem Plano'}</td>
        <td class="text-right">${(user.totalRequests ?? 0).toLocaleString('pt-BR')}</td>
        <td class="text-right ${(user.errorRate ?? 0) >= 5 ? 'text-error' : 'text-success'}">${(user.errorRate ?? 0).toFixed(1)}%</td>
        <td class="text-right">${(user.monthlyRequests ?? 0).toLocaleString('pt-BR')}</td>
      </tr>
    `,
      )
      .join('');

    const dbLoadRows = data.databaseLoad
      .map(
        (db: any) => `
      <tr>
        <td style="font-family: monospace; font-weight: 600;">${db.host}</td>
        <td>${db.database}</td>
        <td class="text-right" style="font-weight: 700; color: var(--slate-900);">${db.totalRequests.toLocaleString('pt-BR')}</td>
      </tr>
    `,
      )
      .join('');

    const planDistributionRows = (data.planDistribution || [])
      .map((plan: any) => {
        const pct =
          data.summary.totalRequests > 0
            ? (plan.totalRequests / data.summary.totalRequests) * 100
            : 0;
        return `
        <tr>
          <td style="font-weight: 600; color: var(--slate-900);">${plan.planName}</td>
          <td class="text-right">${(plan.totalRequests ?? 0).toLocaleString('pt-BR')}</td>
          <td class="text-right">${pct.toFixed(1)}%</td>
        </tr>
      `;
      })
      .join('');

    const endpointRows = data.topEndpoints
      .map(
        (ep: any) => `
      <tr>
        <td style="font-family: monospace; font-weight: 600; color: var(--slate-900);">${ep.method}</td>
        <td style="font-family: monospace;">${ep.path}</td>
        <td class="text-right">${(ep.totalRequests ?? 0).toLocaleString('pt-BR')}</td>
        <td class="text-right ${(ep.successRate ?? 0) >= 95 ? 'text-success' : 'text-error'}">${(ep.successRate ?? 0).toFixed(1)}%</td>
        <td class="text-right">${(ep.avgLatency ?? 0).toFixed(0)} ms</td>
        <td class="text-right">${(ep.p95Latency ?? 0).toFixed(0)} ms</td>
      </tr>
    `,
      )
      .join('');

    const statusRows = this.generateStatusRows(data.statusDistribution);

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Dossiê Geral Interno - InfoAPI</title>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Capa -->
          <div class="header-cover">
            <div>
              <div class="logo">Info<span>API</span></div>
              <div style="font-size: 11px; color: var(--slate-500); margin-top: 4px;">Dossiê Operacional & Comercial Global</div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-primary" style="background-color: var(--slate-900); color: #ffffff;">Interno</span>
              <div style="font-size: 16px; font-weight: 700; color: var(--slate-900); margin-top: 5px;">InfoBrasil Sistemas</div>
              <div style="font-size: 10px; color: var(--slate-500);">${format(new Date(), 'dd/MM/yyyy')}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; background: var(--slate-50); border: 1px solid var(--slate-100); padding: 12px 15px; border-radius: 8px;">
            <div style="max-width: 70%;">
              <p style="margin: 0; color: var(--slate-600); font-size: 12px; line-height: 1.6;">
                Este relatório apresenta a visão consolidada e global do uso de APIs corporativas integradas. Compila dados de tráfego, latência, erros, bancos de dados mais exigidos e os clientes que demandam maior suporte comercial.
                <strong>Período analisado:</strong> ${start} a ${end}.
              </p>
            </div>
            <div style="text-align: right; border-left: 1px solid var(--slate-200); padding-left: 15px;">
              <div style="font-size: 9px; color: var(--slate-500); text-transform: uppercase; font-weight: 600;">Status do Log Processor</div>
              <span class="badge" style="background-color: ${hbBg}; color: ${hbColor}; display: inline-block; margin-top: 4px; font-weight: 700;">
                ${hbStatus}
              </span>
              <div style="font-size: 8px; color: var(--slate-500); margin-top: 4px;">Último pulso: ${hbLastSeen}</div>
            </div>
          </div>

          <!-- Resumo Executivo Geral -->
          <h3 style="border-left: 3px solid var(--slate-900); padding-left: 8px; margin-bottom: 12px; font-size: 14px;">Resumo Operacional Global</h3>
          <div class="grid-5">
            <div class="card card-stat">
              <div class="stat-label">Volume Geral Reqs</div>
              <div class="stat-val">${data.summary.totalRequests.toLocaleString('pt-BR')}</div>
              <div style="font-size: 9px; color: var(--slate-500);">Todas as integrações</div>
            </div>
            <div class="card card-stat">
              <div class="stat-label">Clientes Ativos</div>
              <div class="stat-val">${(data.summary.activeUsers ?? 0).toLocaleString('pt-BR')}</div>
              <div style="font-size: 9px; color: var(--slate-500);">No período selecionado</div>
            </div>
            <div class="card card-stat">
              <div class="stat-label">Disponibilidade / Sucesso</div>
              <div class="stat-val text-success">${successRateStr}%</div>
              <div style="font-size: 9px; color: var(--slate-500);">${data.summary.rateLimitHits.toLocaleString('pt-BR')} hits de Rate Limit</div>
            </div>
            <div class="card card-stat">
              <div class="stat-label">Latência p95 Média</div>
              <div class="stat-val">${data.summary.p95Latency.toLocaleString('pt-BR')} ms</div>
              <div style="font-size: 9px; color: var(--slate-500);">Média p95 global</div>
            </div>
            <div class="card card-stat">
              <div class="stat-label">Requisições / Minuto (RPM)</div>
              <div class="stat-val">${(data.summary.currentRpm ?? 0).toLocaleString('pt-BR')} RPM</div>
              <div style="font-size: 9px; color: var(--slate-500);">Média no período: ${(data.summary.averageRpm ?? 0).toLocaleString('pt-BR')}</div>
            </div>
          </div>

          <!-- Histórico Temporal de Requisições -->
          <h3 style="border-left: 3px solid var(--slate-900); padding-left: 8px; margin-bottom: 12px; font-size: 14px;">Evolução Temporal do Consumo Global</h3>
          <div class="chart-container" style="margin-bottom: 25px;">
            ${this.generateTimeSeriesSvg(data.timeSeries)}
          </div>

          <!-- Alertas Comerciais Proativos (Clientes batendo 80%) -->
          <h3 style="border-left: 3px solid var(--red-600); padding-left: 8px; margin-bottom: 12px; font-size: 14px; color: var(--red-600);">Alertas Comerciais: Limites Próximos (Consumo Mensal >= 80%)</h3>
          <table class="table" style="margin-bottom: 25px;">
            <thead>
              <tr>
                <th>Usuário/Empresa</th>
                <th>E-mail</th>
                <th>Plano</th>
                <th class="text-right">Consumo / Limite Mensal</th>
                <th class="text-right">Utilização</th>
                <th class="text-center" style="width: 80px;">Notificado</th>
              </tr>
            </thead>
            <tbody>
              ${alertRows || '<tr><td colspan="6" class="text-center" style="color: var(--primary);">Nenhuma empresa atingiu mais de 80% do limite de franquia no mês atual.</td></tr>'}
            </tbody>
          </table>

          <div class="page-break"></div>

          <!-- Top Usuários por volume -->
          <h3 style="border-left: 3px solid var(--slate-900); padding-left: 8px; margin-bottom: 12px; font-size: 14px; margin-top: 15px;">Top 10 Clientes por Volume no Período</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Plano Contratado</th>
                <th class="text-right" style="width: 110px;">Reqs Período</th>
                <th class="text-right" style="width: 100px;">Taxa de Erro</th>
                <th class="text-right" style="width: 130px;">Reqs Acumuladas Mês</th>
              </tr>
            </thead>
            <tbody>
              ${topUsersRows || '<tr><td colspan="5" class="text-center">Nenhum log gravado.</td></tr>'}
            </tbody>
          </table>

          <!-- Carga Operacional e Distribuição por Planos -->
          <div class="grid-2" style="margin-top: 15px; margin-bottom: 25px;">
            <div>
              <h3 style="border-left: 3px solid var(--slate-900); padding-left: 8px; margin-bottom: 12px; font-size: 14px;">Carga Operacional nos Bancos de Dados (Clientes/Tenants)</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th>Servidor / Host</th>
                    <th>Banco de Dados</th>
                    <th class="text-right">Total Reqs</th>
                  </tr>
                </thead>
                <tbody>
                  ${dbLoadRows || '<tr><td colspan="3" class="text-center">Nenhum acesso computado.</td></tr>'}
                </tbody>
              </table>
            </div>
            <div>
              <h3 style="border-left: 3px solid var(--slate-900); padding-left: 8px; margin-bottom: 12px; font-size: 14px;">Consumo por Plano Comercial</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th>Plano</th>
                    <th class="text-right">Total Acessos</th>
                    <th class="text-right">Participação</th>
                  </tr>
                </thead>
                <tbody>
                  ${planDistributionRows || '<tr><td colspan="3" class="text-center">Nenhum plano computado.</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>

          <div class="page-break"></div>

          <!-- Distribuição Geral de Status -->
          <h3 style="border-left: 3px solid var(--slate-900); padding-left: 8px; margin-bottom: 12px; font-size: 14px; margin-top: 15px;">Distribuição Global de Retornos HTTP</h3>
          <div class="card" style="margin-bottom: 25px;">
            ${statusRows}
          </div>

          <!-- Endpoints mais Consumidos Globais -->
          <h3 style="border-left: 3px solid var(--slate-900); padding-left: 8px; margin-bottom: 12px; font-size: 14px;">Rotas mais Consumidas na API</h3>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 60px;">Método</th>
                <th>Rota de Integração</th>
                <th class="text-right" style="width: 100px;">Total Acessos</th>
                <th class="text-right" style="width: 80px;">Sucesso</th>
                <th class="text-right" style="width: 80px;">Média Lat.</th>
                <th class="text-right" style="width: 80px;">Latência p95</th>
              </tr>
            </thead>
            <tbody>
              ${endpointRows || '<tr><td colspan="6" class="text-center">Sem dados de acesso no período.</td></tr>'}
            </tbody>
          </table>

          <!-- Glossário -->
          <div class="page-break"></div>
          <h3 style="border-left: 3px solid var(--slate-900); padding-left: 8px; margin-bottom: 15px; font-size: 14px;">Glossário de Termos</h3>
          <p style="font-size: 11px; color: var(--slate-600); margin-bottom: 20px; line-height: 1.6;">
            Este glossário auxilia na interpretação técnica e comercial dos indicadores apresentados neste dossiê operacional global.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Volume Geral Reqs (Requisições Globais)</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">O volume acumulado de todas as chamadas de API realizadas por qualquer cliente ou integração ao ecossistema da InfoAPI.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Clientes Ativos</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Número total de empresas ou chaves de integração únicas que realizaram pelo menos uma requisição no período selecionado.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Disponibilidade / Sucesso</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Percentual de requisições que retornaram status HTTP de sucesso (família 2xx/3xx), refletindo a estabilidade global do sistema.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Latência p95 Média</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">A média ponderada da métrica p95 em todos os clientes. Representa o limite superior de tempo de resposta para 95% do volume global de requisições.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Log Processor</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Serviço assíncrono responsável por ler, estruturar e gravar os logs de acesso para gerar as métricas de faturamento e auditoria operacional.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Carga Operacional nos Bancos de Dados (Tenants)</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Volume de requisições roteadas para cada servidor/banco de dados individual dos clientes, útil para dimensionamento de infraestrutura.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Alertas Comerciais</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Monitoramento proativo que indica quais clientes já consumiram 80% ou mais da sua franquia de requisições contratada para o mês vigente.</p>
            </div>
            <div>
              <strong style="color: var(--slate-900); font-size: 12px;">Status HTTP (Códigos de Retorno)</strong>
              <p style="margin: 2px 0 0 0; color: var(--slate-600); font-size: 11px; line-height: 1.5;">Respostas padronizadas que indicam o resultado do processamento:</p>
              <ul style="margin: 4px 0 0 15px; padding: 0; color: var(--slate-600); font-size: 11px; list-style-type: disc; line-height: 1.5;">
                <li><strong>2xx (Sucesso)</strong>: A operação foi concluída com êxito.</li>
                <li><strong>4xx (Erro do Cliente)</strong>: Erros de requisição malformada ou recursos inexistentes.</li>
                <li><strong>429 (Too Many Requests)</strong>: Bloqueios de segurança aplicados quando um cliente ultrapassa a taxa de limite operacional.</li>
                <li><strong>5xx (Erro do Servidor)</strong>: Falhas internas imprevistas no processamento ou na comunicação da API.</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateStatusRows(statusDistribution: any[]): string {
    const total = statusDistribution.reduce((acc, curr) => acc + curr.count, 0);
    if (total === 0)
      return '<div class="text-center" style="font-size: 11px; color: var(--slate-500);">Nenhum log para distribuição.</div>';

    return statusDistribution
      .map((item) => {
        const pct = (item.count / total) * 100;
        let colorClass = 'var(--slate-500)';

        if (item.statusClass === '2xx') colorClass = 'var(--primary)';
        else if (item.statusClass === '429') colorClass = 'var(--amber-600)';
        else if (
          item.statusClass.startsWith('4') ||
          item.statusClass.startsWith('5')
        )
          colorClass = 'var(--red-600)';

        return `
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
            <span style="font-weight: 700; color: ${colorClass};">${item.statusClass}</span>
            <span><strong>${item.count.toLocaleString('pt-BR')}</strong> (${pct.toFixed(1)}%)</span>
          </div>
          <div class="progress-bar-container" style="height: 5px;">
            <div class="progress-bar" style="width: ${pct}%; background-color: ${colorClass};"></div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  private generateTimeSeriesSvg(timeSeries: any[]): string {
    if (!timeSeries || timeSeries.length < 2) {
      return '<div class="text-center" style="padding: 30px; color: var(--slate-500);">Histórico temporal insuficiente para plotar gráficos.</div>';
    }

    const width = 560;
    const height = 180;
    const padding = { top: 15, right: 15, bottom: 25, left: 40 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxCount = Math.max(...timeSeries.map((d) => d.count), 1);

    // Y Axis limits (round to readable values)
    const yMax = Math.ceil(maxCount / 10) * 10 || 10;

    // Helper mapping
    const getX = (index: number) =>
      padding.left + (index / (timeSeries.length - 1)) * chartWidth;
    const getY = (val: number) =>
      padding.top + chartHeight - (val / yMax) * chartHeight;

    // Generate path data
    let areaSuccessPoints = '';
    let successLinePoints = '';
    let errorLinePoints = '';

    timeSeries.forEach((d, i) => {
      const x = getX(i);
      const ySuccess = getY(d.success || 0);
      const yError = getY(d.error || 0);

      if (i === 0) {
        areaSuccessPoints = `M ${x},${padding.top + chartHeight} L ${x},${ySuccess}`;
        successLinePoints = `M ${x},${ySuccess}`;
        errorLinePoints = `M ${x},${yError}`;
      } else {
        areaSuccessPoints += ` L ${x},${ySuccess}`;
        successLinePoints += ` L ${x},${ySuccess}`;
        errorLinePoints += ` L ${x},${yError}`;
      }

      if (i === timeSeries.length - 1) {
        areaSuccessPoints += ` L ${x},${padding.top + chartHeight} Z`;
      }
    });

    // Generate ticks for Y Axis
    const yTicks = 4;
    let yGridHtml = '';
    for (let i = 0; i <= yTicks; i++) {
      const val = Math.round((i / yTicks) * yMax);
      const y = getY(val);
      yGridHtml += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#f1f5f9" stroke-width="1" ${i > 0 ? 'stroke-dasharray="3,3"' : ''} />
        <text x="${padding.left - 8}" y="${y + 4}" fill="#94a3b8" font-size="8" text-anchor="end" font-family="Inter">${val}</text>
      `;
    }

    // Generate labels for X Axis
    const xLabelStep = Math.ceil(timeSeries.length / 5);
    const xLabelsHtml = timeSeries
      .map((d, i) => {
        if (i % xLabelStep !== 0 && i !== timeSeries.length - 1) return '';
        const x = getX(i);
        const labelDate = this.safeFormat(d.timestamp, 'dd/MM');
        return `
        <text x="${x}" y="${height - 5}" fill="#94a3b8" font-size="8" text-anchor="middle" font-family="Inter">${labelDate}</text>
        <line x1="${x}" y1="${padding.top + chartHeight}" x2="${x}" y2="${padding.top + chartHeight + 4}" stroke="#cbd5e1" stroke-width="1" />
      `;
      })
      .join('');

    return `
      <svg width="100%" height="180" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
        <!-- Grid and Y Labels -->
        ${yGridHtml}
        
        <!-- X Axis and labels -->
        <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="#cbd5e1" stroke-width="1" />
        ${xLabelsHtml}

        <!-- Success Area -->
        <path d="${areaSuccessPoints}" fill="url(#successGrad)" opacity="0.15" />

        <!-- Success Line -->
        <path d="${successLinePoints}" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Error Line (Only if there are errors) -->
        ${
          timeSeries.some((d) => d.error > 0)
            ? `
          <path d="${errorLinePoints}" fill="none" stroke="var(--red-600)" stroke-width="1.5" stroke-dasharray="2,2" stroke-linecap="round" stroke-linejoin="round" />
        `
            : ''
        }

        <!-- Definitions for Gradients -->
        <defs>
          <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div style="display: flex; justify-content: center; gap: 20px; font-size: 9px; margin-top: 8px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="display: inline-block; width: 12px; height: 3px; background-color: var(--primary); border-radius: 1px;"></span>
          <span style="color: var(--slate-600); font-weight: 500;">Requisições com Sucesso (2xx/3xx)</span>
        </div>
        ${
          timeSeries.some((d) => d.error > 0)
            ? `
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 12px; height: 1px; border-top: 2px dashed var(--red-600);"></span>
            <span style="color: var(--slate-600); font-weight: 500;">Falhas / Erros (4xx/5xx)</span>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  private safeFormat(
    date: Date | string | number,
    formatStr: string,
    options?: any,
  ): string {
    try {
      let parsed = new Date(date);
      if (!date || isNaN(parsed.getTime())) {
        return '--/--/----';
      }
      const tzString = parsed.toLocaleString('en-US', {
        timeZone: 'America/Sao_Paulo',
      });
      parsed = new Date(tzString);
      return format(parsed, formatStr, options);
    } catch {
      return '--/--/----';
    }
  }
}
