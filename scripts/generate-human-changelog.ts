import * as fs from 'fs';
import * as path from 'path';

export interface HumanReleaseItem {
  module: string;
  type: 'feature' | 'fix' | 'security' | 'improvement';
  title: string;
  description: string;
  impact: string;
  originalCommit?: string;
  commitHash?: string;
}

export interface HumanRelease {
  version: string;
  date: string;
  title: string;
  summary: string;
  highlights: string[];
  items: HumanReleaseItem[];
  totalChanges: number;
}

// Dicionário de Módulos
const MODULE_NAMES: Record<string, string> = {
  crypto: 'Criptografia & Segurança',
  'fiscal-entry': 'Entradas Fiscais',
  purchase: 'Compras',
  'call-center': 'Call Center',
  infra: 'Infraestrutura & Resiliência',
  'integration-request': 'Solicitações de Integração',
  plan: 'Planos & Quotas',
  order: 'Pedidos & Vendas',
  client: 'Clientes',
  delivery: 'Entregas & Logística',
  group: 'Grupos de Produtos',
  announcement: 'Avisos & Notificações',
  dossie: 'Dossiês & Relatórios',
  validation: 'Validação & Segurança de Dados',
  dashboard: 'Painel & Métricas',
  employee: 'Funcionários & Cargos',
  'employee-roles': 'Cargos de Funcionários',
  supplier: 'Fornecedores',
  'service-provider': 'Prestadores de Serviço',
  'payment-plan': 'Planos de Pagamento',
  'payment-method': 'Meios de Pagamento',
  'account-payable': 'Contas a Pagar',
  'account-receivable': 'Contas a Receber',
  status: 'Monitoramento & Saúde',
  uptime: 'Disponibilidade do Sistema',
  newsletter: 'Informativos',
  auth: 'Autenticação & Acesso',
  product: 'Catálogo de Produtos',
  store: 'Lojas & Filiais',
  receipt: 'Recibos Financeiros',
  scripts: 'Ferramentas de Manutenção',
  range: 'Filtros de Período',
  general: 'Geral & Usabilidade',
};

// Traduções e humanizações contextuais conhecidas
function humanizeItem(
  rawText: string,
  category: 'feature' | 'fix',
): HumanReleaseItem {
  let text = rawText.trim();
  let commitHash = '';

  const hashMatch = text.match(/\(\[([a-f0-9]+)\]\([^)]+\)\)$/);
  if (hashMatch) {
    commitHash = hashMatch[1];
    text = text.replace(hashMatch[0], '').trim();
  }

  // Remove aspas simples sobrando no final
  text = text.replace(/['"]+$/g, '').trim();

  let scope = 'general';
  const scopeMatch = text.match(/^\*\*([a-zA-Z0-9_-]+):\*\*\s*(.*)$/);
  if (scopeMatch) {
    scope = scopeMatch[1].toLowerCase();
    text = scopeMatch[2].trim();
  } else {
    // Detectar escopo por palavras-chave
    const lower = text.toLowerCase();
    if (
      lower.includes('call-center') ||
      lower.includes('callcenter') ||
      lower.includes('call centers')
    )
      scope = 'call-center';
    else if (lower.includes('fiscal') || lower.includes('entradas_apoio'))
      scope = 'fiscal-entry';
    else if (lower.includes('purchase') || lower.includes('compras'))
      scope = 'purchase';
    else if (lower.includes('order') || lower.includes('pedido'))
      scope = 'order';
    else if (
      lower.includes('deliveries') ||
      lower.includes('delivery') ||
      lower.includes('entrega')
    )
      scope = 'delivery';
    else if (
      lower.includes('product') ||
      lower.includes('produto') ||
      lower.includes('ean') ||
      lower.includes('brands') ||
      lower.includes('groups')
    )
      scope = 'product';
    else if (lower.includes('dossie') || lower.includes('dossi'))
      scope = 'dossie';
    else if (lower.includes('dashboard') || lower.includes('dash'))
      scope = 'dashboard';
    else if (
      lower.includes('plan') ||
      lower.includes('plano') ||
      lower.includes('quota') ||
      lower.includes('80%') ||
      lower.includes('100%')
    )
      scope = 'plan';
    else if (
      lower.includes('autoheal') ||
      lower.includes('timeout') ||
      lower.includes('pool') ||
      lower.includes('resilience') ||
      lower.includes('docker') ||
      lower.includes('prisma')
    )
      scope = 'infra';
    else if (
      lower.includes('crypto') ||
      lower.includes('encrypt') ||
      lower.includes('password') ||
      lower.includes('senha')
    )
      scope = 'crypto';
    else if (lower.includes('client') || lower.includes('cliente'))
      scope = 'client';
    else if (lower.includes('supplier') || lower.includes('fornecedor'))
      scope = 'supplier';
    else if (
      lower.includes('employee') ||
      lower.includes('funcionario') ||
      lower.includes('funcionário')
    )
      scope = 'employee';
    else if (lower.includes('newsletter')) scope = 'newsletter';
    else if (lower.includes('announcement') || lower.includes('aviso'))
      scope = 'announcement';
    else if (
      lower.includes('status') ||
      lower.includes('health') ||
      lower.includes('uptime')
    )
      scope = 'status';
    else if (
      lower.includes('payable') ||
      lower.includes('receivable') ||
      lower.includes('receipt') ||
      lower.includes('payment')
    )
      scope = 'account-receivable';
    else if (
      lower.includes('auth') ||
      lower.includes('login') ||
      lower.includes('jwt') ||
      lower.includes('token')
    )
      scope = 'auth';
  }

  const moduleName = MODULE_NAMES[scope] || 'Geral';
  const itemType: HumanReleaseItem['type'] =
    scope === 'crypto' ||
    text.toLowerCase().includes('security') ||
    text.toLowerCase().includes('firewall') ||
    text.toLowerCase().includes('blocklist')
      ? 'security'
      : category === 'feature'
        ? 'feature'
        : 'fix';

  let title = text;
  let description = text;
  let impact = 'Melhoria contínua na integridade e experiência do sistema.';

  // Regras de tradução e humanização específicas
  const lower = text.toLowerCase();

  if (lower.includes('autoheal') && lower.includes('resilience')) {
    title = 'Recuperação automática de serviços (Autoheal)';
    description =
      'Adicionado mecanismo de autocura para monitorar a saúde dos containers e restabelecer conexões automaticamente em caso de instabilidade.';
    impact = 'Maior tempo de atividade (uptime) e prevenção de quedas da API.';
  } else if (lower.includes('encrypt') || lower.includes('crypto')) {
    title = 'Proteção criptográfica de credenciais de banco';
    description =
      'Implementado utilitário para cifrar senhas e credenciais dos bancos de dados dos clientes na camada de persistência.';
    impact =
      'Máxima segurança e conformidade com boas práticas de proteção de dados sensíveis.';
  } else if (
    lower.includes('fiscal entries') ||
    lower.includes('entradas_apoio')
  ) {
    title = 'Módulo de Entradas Fiscais (ENTRADAS_APOIO)';
    description =
      'Disponibilizada integração completa para consulta e gestão de notas de entrada fiscal com controle de acesso granular baseado em perfis (RBAC).';
    impact =
      'Facilidade na integração contábil e fiscal de notas fiscais recebidas.';
  } else if (lower.includes('purchases module') || lower.includes('purchase')) {
    title = 'Módulo de Compras & Suporte a RBAC';
    description =
      'Nova integração para sincronização e acompanhamento de pedidos de compra e cotações com fornecedores.';
    impact =
      'Visibilidade em tempo real das movimentações de compras realizadas no ERP.';
  } else if (
    lower.includes('remove varchar cast on blob') ||
    lower.includes('blob id error')
  ) {
    title = 'Correção na leitura de campos longos no Call Center';
    description =
      'Ajustada a conversão de campos de texto longo (BLOB) para prevenir truncamento de informações e falhas de consulta.';
    impact =
      'Atendimentos de clientes agora exibem histórico detalhado sem corte de dados.';
  } else if (lower.includes('mitigate 504') || lower.includes('pool ttl')) {
    title = 'Estabilização de conexões e prevenção de timeout 504';
    description =
      'Implementado controle inteligente de ciclo de vida de conexões (TTL), timeouts de segurança e TCP keep-alive no pool do banco de dados.';
    impact =
      'Eliminação de travamentos e respostas de erro 504 em momentos de oscilação de rede.';
  } else if (
    lower.includes('price on plans') ||
    lower.includes('plans on lp')
  ) {
    title = 'Exibição de valores e planos comerciais';
    description =
      'Ajustada a estrutura de planos comerciais para detalhamento transparente de preços, quotas de requisição e upgrades.';
    impact =
      'Clareza na visualização das características e limites do plano contratado.';
  } else if (lower.includes('get /call-centers')) {
    title = 'Consulta a atendimentos de Call Center';
    description =
      'Disponibilizados filtros avançados e novos campos na busca de atendimentos do suporte e call center.';
    impact = 'Acesso simplificado ao histórico de suporte ao cliente.';
  } else if (
    lower.includes('post /deliveries') ||
    lower.includes('get /deliveries') ||
    lower.includes('delivery')
  ) {
    title = 'Gestão de Entregas e Logística';
    description =
      'Implementado o módulo de controle e rastreamento de entregas vinculadas a pedidos de venda.';
    impact =
      'Acompanhamento do status de despacho e rota de entregas aos clientes.';
  } else if (
    lower.includes('100% alert') ||
    lower.includes('80%') ||
    lower.includes('quota')
  ) {
    title = 'Alertas preventivos de consumo de cota';
    description =
      'Notificações automatizadas quando a franquia de requisições atinge 80% e 100% do limite mensal.';
    impact =
      'Prevenção contra bloqueios inesperados de integração por estouro de cota.';
  } else if (lower.includes('dossie') || lower.includes('pdf')) {
    title = 'Geração de Dossiês e Relatórios em PDF';
    description =
      'Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).';
    impact =
      'Facilidade de auditoria e prestação de contas com gráficos executivos.';
  } else if (
    lower.includes('extended session') ||
    lower.includes('silent token refresh')
  ) {
    title = 'Sessão prolongada e renovação automática de acesso';
    description =
      'Opção de "lembrar sessão" e renovação transparente do token de acesso sem interromper a navegação no painel.';
    impact = 'Maior comodidade e produtividade para operadores do sistema.';
  } else if (lower.includes('rate limit') || lower.includes('rate limiting')) {
    title = 'Proteção contra sobrecarga de requisições (Rate Limiting)';
    description =
      'Controle de taxa de requisições por usuário para evitar lentidão e garantir justiça na distribuição de recursos.';
    impact =
      'Estabilidade constante e alta disponibilidade da API para todos os clientes.';
  } else if (lower.includes('newsletter')) {
    title = 'Módulo de Informativos & Novidades';
    description =
      'Canal oficial para disparo de comunicados técnicos e comunicados de novidades aos usuários integradores.';
    impact =
      'Comunicação direta de atualizações importantes e avisos operacionais.';
  } else if (lower.includes('wirecrypt')) {
    title = 'Criptografia na comunicação com Firebird';
    description =
      'Habilitação de criptografia de canal (WireCrypt) na comunicação remota com os bancos de dados dos clientes.';
    impact =
      'Segurança reforçada no tráfego de dados confidenciais via VPN ou rede externa.';
  } else if (
    lower.includes('post /orders') ||
    lower.includes('get /orders') ||
    lower.includes('pedidos')
  ) {
    title = 'Operações de Vendas & Pedidos';
    description =
      'Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.';
    impact = 'Integração de vendas rápida, robusta e com validações completas.';
  } else {
    // Tratamento genérico refinado
    title = text
      .replace(/^implement\s+/i, 'Implementação de ')
      .replace(/^add\s+/i, 'Inclusão de ')
      .replace(/^fix\s+/i, 'Correção em ')
      .replace(/^update\s+/i, 'Atualização de ')
      .replace(/^remove\s+/i, 'Remoção de ')
      .replace(/^adjust\s+/i, 'Ajuste em ');
    description = `Atualização no módulo de ${moduleName}: ${text}.`;
  }

  return {
    module: moduleName,
    type: itemType,
    title,
    description,
    impact,
    originalCommit: text,
    commitHash,
  };
}

// Síntese executiva inteligente por versão
function generateReleaseSummary(
  version: string,
  items: HumanReleaseItem[],
): { title: string; summary: string; highlights: string[] } {
  const features = items.filter((i) => i.type === 'feature');
  const fixes = items.filter((i) => i.type === 'fix');
  const securities = items.filter((i) => i.type === 'security');

  const modules = Array.from(new Set(items.map((i) => i.module)));

  let title = `Atualizações da Versão ${version}`;
  let summary = `Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de ${modules.slice(0, 3).join(', ')}.`;
  const highlights: string[] = [];

  if (version === '1.16.22') {
    title = 'Resiliência e Auto-recuperação de Serviços';
    summary =
      'Introdução de mecanismo automático de auto-cura (autoheal) para assegurar alta disponibilidade dos serviços da API.';
    highlights.push(
      'Auto-recuperação automática em falhas transitórias de containers',
    );
  } else if (version === '1.16.20') {
    title = 'Entradas Fiscais e Proteção Criptográfica';
    summary =
      'Lançamento do módulo de Entradas Fiscais (ENTRADAS_APOIO), cifragem de credenciais de banco e extensão de prazo de convites.';
    highlights.push(
      'Novo módulo de Entradas Fiscais com controle RBAC',
      'Criptografia robusta de credenciais de banco',
    );
  } else if (version === '1.16.18') {
    title = 'Módulo de Compras e Prevenção de Timeouts';
    summary =
      'Implementação do módulo de Compras e melhorias críticas de resiliência no pool de conexões (prevenção de 504 Gateway Timeout).';
    highlights.push(
      'Novo módulo de Compras integrado ao ERP',
      'Conexões mais estáveis com pool TTL e TCP keep-alive',
    );
  } else if (version === '1.16.17') {
    title = 'Gestão Comercial de Planos e Estabilidade no Call Center';
    summary =
      'Estruturação de valores e cotas de planos comerciais, além de correções no processamento de atendimentos de Call Center.';
    highlights.push(
      'Visibilidade de valores e cotas por plano',
      'Correção no tratamento de campos de texto no Call Center',
    );
  } else if (version === '1.16.16') {
    title = 'Expansão da API de Call Center';
    summary =
      'Disponibilização de novos endpoints e campos detalhados para integração de chamados do Call Center.';
    highlights.push(
      'Novos campos de auditoria e dados de usuários nos atendimentos',
    );
  } else if (version === '1.16.13') {
    title = 'Alertas Proativos de Quota e Campos Logísticos';
    summary =
      'Alertas automáticos de consumo de 100% da franquia e inclusão de dados fiscais e de logística nos pedidos.';
    highlights.push(
      'Notificação automática de 100% da cota consumida',
      'Detalhamento de operação fiscal e frete nos pedidos',
    );
  } else if (version === '1.16.11') {
    title = 'Localização de Erros em Português e Métricas de Consumo';
    summary =
      'Mensagens de validação da API traduzidas para português do Brasil, registro de logs de alerta e auditoria de RPM.';
    highlights.push(
      'Erros da API apresentados em português claro',
      'Métricas de requisições por minuto (RPM) em dossiês',
    );
  } else if (version === '1.16.9') {
    title = 'Sessão Estendida no Painel e Dossiês Gerenciais';
    summary =
      'Opção de manter sessão conectada, renovação silenciosa de tokens e geração robusta de dossiês em PDF.';
    highlights.push(
      'Conveniência de sessão estendida no painel de administração',
      'Relatórios executivos e auditoria em PDF',
    );
  } else if (version === '1.16.1') {
    title = 'Central de Avisos e Notificações';
    summary =
      'Implementação da gaveta de avisos com separação por lidos e não lidos para os usuários da API.';
    highlights.push('Central de comunicados e notificações interativa');
  } else if (version === '1.15.0') {
    title = 'Módulo Oficial de Newsletter';
    summary =
      'Criação do módulo para envio de comunicados por e-mail sobre lançamentos e novidades da plataforma.';
    highlights.push(
      'Disparo de e-mails informativos com formatação corporativa',
    );
  } else if (version === '1.14.0') {
    title = 'Módulo de Entregas & Rastreamento';
    summary =
      'Novo módulo para acompanhamento e controle de despachos e status de entrega.';
    highlights.push('Gestão de entregas diretamente pela API');
  } else if (version === '1.4.0') {
    title = 'Painel do Cliente e Monitoramento de Uptime';
    summary =
      'Disponibilização do portal do cliente, rotação de senhas, monitoramento de disponibilidade e página pública de status.';
    highlights.push(
      'Portal de autoatendimento para clientes integradores',
      'Monitoramento ativo de saúde e página de status',
    );
  } else if (version === '1.0.0' || version === '0.0.2') {
    title = 'Lançamento Inicial da InfoBrasil API';
    summary =
      'Disponibilização da primeira versão da API com integração para produtos, pedidos, clientes e autenticação segura.';
    highlights.push('Primeira versão estável da plataforma de integração');
  } else {
    if (features.length > 0) {
      highlights.push(...features.slice(0, 2).map((f) => f.title));
      title = `${features[0].title} e melhorias`;
    } else if (fixes.length > 0) {
      highlights.push(...fixes.slice(0, 2).map((f) => f.title));
      title = `Correções de estabilidade e aprimoramentos`;
    }
  }

  if (highlights.length === 0 && items.length > 0) {
    highlights.push(items[0].title);
  }

  return { title, summary, highlights };
}

// Parser Principal do CHANGELOG.md
export function parseChangelogFile(filePath: string): HumanRelease[] {
  const content = fs.readFileSync(filePath, 'utf8');

  // Regex para identificar cabeçalhos de versão:
  // Exemplo: ## [1.16.22](https://...) (2026-09-07) ou ## 0.0.2 (2026-04-10)
  const lines = content.split('\n');
  const releases: HumanRelease[] = [];

  let currentVersion = '';
  let currentDate = '';
  let currentCategory: 'feature' | 'fix' | null = null;
  let currentItems: HumanReleaseItem[] = [];

  function flushRelease() {
    if (!currentVersion) return;

    const { title, summary, highlights } = generateReleaseSummary(
      currentVersion,
      currentItems,
    );
    releases.push({
      version: currentVersion,
      date: currentDate || 'Data não informada',
      title,
      summary,
      highlights,
      items: [...currentItems],
      totalChanges: currentItems.length,
    });

    currentItems = [];
    currentCategory = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Match de cabeçalho de versão
    const versionMatch = line.match(
      /^##\s+\[?([0-9]+\.[0-9]+\.[0-9]+)\]?.*?\((\d{4}-\d{2}-\d{2})\)/,
    );
    const altVersionMatch = line.match(/^##\s+\[?([0-9]+\.[0-9]+\.[0-9]+)\]?/);

    if (versionMatch || altVersionMatch) {
      flushRelease();
      currentVersion = versionMatch ? versionMatch[1] : altVersionMatch![1];
      currentDate = versionMatch ? versionMatch[2] : '';
      continue;
    }

    if (line.startsWith('### Features')) {
      currentCategory = 'feature';
      continue;
    }

    if (line.startsWith('### Bug Fixes')) {
      currentCategory = 'fix';
      continue;
    }

    if (line.startsWith('* ')) {
      const itemRaw = line.substring(2);
      if (currentCategory) {
        currentItems.push(humanizeItem(itemRaw, currentCategory));
      } else {
        // Assume feature ou fix conforme texto
        const isFix = /fix|corre|bug|error|crash/i.test(itemRaw);
        currentItems.push(humanizeItem(itemRaw, isFix ? 'fix' : 'feature'));
      }
    }
  }

  flushRelease();

  return releases;
}

// Gerador do arquivo Markdown em português
export function generateMarkdownChangelog(releases: HumanRelease[]): string {
  let md = `# Notas de Atualização da InfoBrasil API (Changelog Humanizado)\n\n`;
  md += `Este documento reúne o histórico de lançamentos, novas funcionalidades, melhorias de infraestrutura e correções da **InfoBrasil API** em linguagem clara e orientada a valor de negócio.\n\n`;
  md += `Para visualizar a versão interativa com busca em tempo real, acesse o portal web em: [/changelog](https://info-api.infobrasilsistemas.com.br/changelog).\n\n`;
  md += `---\n\n`;

  for (const rel of releases) {
    md += `## [v${rel.version}] - ${rel.date}\n\n`;
    md += `### 📌 ${rel.title}\n`;
    md += `> ${rel.summary}\n\n`;

    if (rel.highlights && rel.highlights.length > 0) {
      md += `**Destaques:**\n`;
      for (const h of rel.highlights) {
        md += `- ⭐ ${h}\n`;
      }
      md += `\n`;
    }

    const features = rel.items.filter((i) => i.type === 'feature');
    const fixes = rel.items.filter((i) => i.type === 'fix');
    const securities = rel.items.filter((i) => i.type === 'security');

    if (features.length > 0) {
      md += `#### 🚀 Novidades & Melhorias\n`;
      for (const feat of features) {
        md += `- **[${feat.module}]** ${feat.title}: ${feat.description}\n`;
      }
      md += `\n`;
    }

    if (fixes.length > 0) {
      md += `#### 🛠️ Correções & Estabilidade\n`;
      for (const fix of fixes) {
        md += `- **[${fix.module}]** ${fix.title}: ${fix.description}\n`;
      }
      md += `\n`;
    }

    if (securities.length > 0) {
      md += `#### 🔒 Segurança & Infraestrutura\n`;
      for (const sec of securities) {
        md += `- **[${sec.module}]** ${sec.title}: ${sec.description}\n`;
      }
      md += `\n`;
    }

    md += `---\n\n`;
  }

  return md;
}

// Execução principal
export function run() {
  const rootDir = process.cwd();
  const changelogPath = path.join(rootDir, 'CHANGELOG.md');
  const outputDir = path.join(rootDir, 'docs', 'changelog');

  if (!fs.existsSync(changelogPath)) {
    console.error('❌ Arquivo CHANGELOG.md não foi encontrado na raiz.');
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(
    '🔄 Processando e sintetizando CHANGELOG.md em formato humanizado...',
  );
  const releases = parseChangelogFile(changelogPath);

  const jsonPath = path.join(outputDir, 'releases.json');
  fs.writeFileSync(jsonPath, JSON.stringify(releases, null, 2), 'utf8');
  console.log(
    `✅ Base estruturada gerada com sucesso: ${jsonPath} (${releases.length} versões)`,
  );

  const mdContent = generateMarkdownChangelog(releases);
  const mdPath = path.join(outputDir, 'CHANGELOG.pt-BR.md');
  fs.writeFileSync(mdPath, mdContent, 'utf8');
  console.log(`✅ Markdown humanizado gerado com sucesso: ${mdPath}`);

  console.log(
    '✨ Processamento de changelog humanizado finalizado com sucesso!',
  );
}

if (require.main === module) {
  run();
}
