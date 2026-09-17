# Notas de Atualização da InfoBrasil API (Changelog Humanizado)

Este documento reúne o histórico de lançamentos, novas funcionalidades, melhorias de infraestrutura e correções da **InfoBrasil API** em linguagem clara e orientada a valor de negócio.

Para visualizar a versão interativa com busca em tempo real, acesse o portal web em: [/changelog](https://info-api.infobrasilsistemas.com.br/changelog).

---

## [v1.16.22] - 2026-09-07

### 📌 Resiliência e Auto-recuperação de Serviços
> Introdução de mecanismo automático de auto-cura (autoheal) para assegurar alta disponibilidade dos serviços da API.

**Destaques:**
- ⭐ Auto-recuperação automática em falhas transitórias de containers

#### 🛠️ Correções & Estabilidade
- **[Infraestrutura & Resiliência]** Recuperação automática de serviços (Autoheal): Adicionado mecanismo de autocura para monitorar a saúde dos containers e restabelecer conexões automaticamente em caso de instabilidade.

---

## [v1.16.21] - 2026-09-04

### 📌 Atualizações da Versão 1.16.21
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de .

---

## [v1.16.20] - 2026-09-04

### 📌 Entradas Fiscais e Proteção Criptográfica
> Lançamento do módulo de Entradas Fiscais (ENTRADAS_APOIO), cifragem de credenciais de banco e extensão de prazo de convites.

**Destaques:**
- ⭐ Novo módulo de Entradas Fiscais com controle RBAC
- ⭐ Criptografia robusta de credenciais de banco

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** database url by cnpj: Atualização no módulo de Geral & Usabilidade: database url by cnpj.
- **[Entradas Fiscais]** Módulo de Entradas Fiscais (ENTRADAS_APOIO): Disponibilizada integração completa para consulta e gestão de notas de entrada fiscal com controle de acesso granular baseado em perfis (RBAC).
- **[Geral & Usabilidade]** increase user invitation expiration to 24h and configure P130: Atualização no módulo de Geral & Usabilidade: increase user invitation expiration to 24h and configure P130.

#### 🛠️ Correções & Estabilidade
- **[Infraestrutura & Resiliência]** Inclusão de docs to docker build: Atualização no módulo de Infraestrutura & Resiliência: add docs to docker build.
- **[Geral & Usabilidade]** create-integration-request dto: Atualização no módulo de Geral & Usabilidade: create-integration-request dto.
- **[Geral & Usabilidade]** database url by cnpj: Atualização no módulo de Geral & Usabilidade: database url by cnpj.
- **[Entradas Fiscais]** import TenantConnectionModule and update swagger spec: Atualização no módulo de Entradas Fiscais: import TenantConnectionModule and update swagger spec.

#### 🔒 Segurança & Infraestrutura
- **[Criptografia & Segurança]** Proteção criptográfica de credenciais de banco: Implementado utilitário para cifrar senhas e credenciais dos bancos de dados dos clientes na camada de persistência.

---

## [v1.16.18] - 2026-08-31

### 📌 Módulo de Compras e Prevenção de Timeouts
> Implementação do módulo de Compras e melhorias críticas de resiliência no pool de conexões (prevenção de 504 Gateway Timeout).

**Destaques:**
- ⭐ Novo módulo de Compras integrado ao ERP
- ⭐ Conexões mais estáveis com pool TTL e TCP keep-alive

#### 🚀 Novidades & Melhorias
- **[Compras]** Módulo de Compras & Suporte a RBAC: Nova integração para sincronização e acompanhamento de pedidos de compra e cotações com fornecedores.
- **[Ferramentas de Manutenção]** Inclusão de permissions sync script and update prisma client documentation: Atualização no módulo de Ferramentas de Manutenção: add permissions sync script and update prisma client documentation.

#### 🛠️ Correções & Estabilidade
- **[Call Center]** Correção na leitura de campos longos no Call Center: Ajustada a conversão de campos de texto longo (BLOB) para prevenir truncamento de informações e falhas de consulta.
- **[Infraestrutura & Resiliência]** Estabilização de conexões e prevenção de timeout 504: Implementado controle inteligente de ciclo de vida de conexões (TTL), timeouts de segurança e TCP keep-alive no pool do banco de dados.
- **[Solicitações de Integração]** Módulo de Compras & Suporte a RBAC: Nova integração para sincronização e acompanhamento de pedidos de compra e cotações com fornecedores.

---

## [v1.16.17] - 2026-08-12

### 📌 Gestão Comercial de Planos e Estabilidade no Call Center
> Estruturação de valores e cotas de planos comerciais, além de correções no processamento de atendimentos de Call Center.

**Destaques:**
- ⭐ Visibilidade de valores e cotas por plano
- ⭐ Correção no tratamento de campos de texto no Call Center

#### 🚀 Novidades & Melhorias
- **[Planos & Quotas]** Exibição de valores e planos comerciais: Ajustada a estrutura de planos comerciais para detalhamento transparente de preços, quotas de requisição e upgrades.
- **[Planos & Quotas]** Exibição de valores e planos comerciais: Ajustada a estrutura de planos comerciais para detalhamento transparente de preços, quotas de requisição e upgrades.
- **[Planos & Quotas]** reset request logs on upgrade plan: Atualização no módulo de Planos & Quotas: reset request logs on upgrade plan.

#### 🛠️ Correções & Estabilidade
- **[Call Center]** Correção na leitura de campos longos no Call Center: Ajustada a conversão de campos de texto longo (BLOB) para prevenir truncamento de informações e falhas de consulta.
- **[Geral & Usabilidade]** fixed limit on pageSize: Atualização no módulo de Geral & Usabilidade: fixed limit on pageSize.
- **[Call Center]** Consulta a atendimentos de Call Center: Disponibilizados filtros avançados e novos campos na busca de atendimentos do suporte e call center.
- **[Call Center]** Consulta a atendimentos de Call Center: Disponibilizados filtros avançados e novos campos na busca de atendimentos do suporte e call center.
- **[Call Center]** Consulta a atendimentos de Call Center: Disponibilizados filtros avançados e novos campos na busca de atendimentos do suporte e call center.
- **[Planos & Quotas]** Exibição de valores e planos comerciais: Ajustada a estrutura de planos comerciais para detalhamento transparente de preços, quotas de requisição e upgrades.
- **[Planos & Quotas]** plans price on lp: Atualização no módulo de Planos & Quotas: plans price on lp.
- **[Call Center]** Consulta a atendimentos de Call Center: Disponibilizados filtros avançados e novos campos na busca de atendimentos do suporte e call center.

---

## [v1.16.16] - 2026-08-11

### 📌 Expansão da API de Call Center
> Disponibilização de novos endpoints e campos detalhados para integração de chamados do Call Center.

**Destaques:**
- ⭐ Novos campos de auditoria e dados de usuários nos atendimentos

#### 🚀 Novidades & Melhorias
- **[Call Center]** Consulta a atendimentos de Call Center: Disponibilizados filtros avançados e novos campos na busca de atendimentos do suporte e call center.
- **[Call Center]** Consulta a atendimentos de Call Center: Disponibilizados filtros avançados e novos campos na busca de atendimentos do suporte e call center.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** return 400 to invalid :id: Atualização no módulo de Geral & Usabilidade: return 400 to invalid :id.

---

## [v1.16.15] - 2026-08-05

### 📌 Correções de estabilidade e aprimoramentos
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Entregas & Logística.

**Destaques:**
- ⭐ Gestão de Entregas e Logística

#### 🛠️ Correções & Estabilidade
- **[Entregas & Logística]** Gestão de Entregas e Logística: Implementado o módulo de controle e rastreamento de entregas vinculadas a pedidos de venda.

---

## [v1.16.13] - 2026-07-29

### 📌 Alertas Proativos de Quota e Campos Logísticos
> Alertas automáticos de consumo de 100% da franquia e inclusão de dados fiscais e de logística nos pedidos.

**Destaques:**
- ⭐ Notificação automática de 100% da cota consumida
- ⭐ Detalhamento de operação fiscal e frete nos pedidos

#### 🚀 Novidades & Melhorias
- **[Planos & Quotas]** Alertas preventivos de consumo de cota: Notificações automatizadas quando a franquia de requisições atinge 80% e 100% do limite mensal.
- **[Clientes]** Inclusão de MUN_CODIGO and MUN_NOME municipality fields to client detail response: Atualização no módulo de Clientes: add MUN_CODIGO and MUN_NOME municipality fields to client detail response.
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** 80 percent alert table: Atualização no módulo de Geral & Usabilidade: 80 percent alert table.
- **[Entregas & Logística]** Gestão de Entregas e Logística: Implementado o módulo de controle e rastreamento de entregas vinculadas a pedidos de venda.
- **[Pedidos & Vendas]** order by id: Atualização no módulo de Pedidos & Vendas: order by id.
- **[Pedidos & Vendas]** order by id 2: Atualização no módulo de Pedidos & Vendas: order by id 2.
- **[Pedidos & Vendas]** throw NotFoundException when order is not found in getOrderById: Atualização no módulo de Pedidos & Vendas: throw NotFoundException when order is not found in getOrderById.

---

## [v1.16.12] - 2026-07-15

### 📌 Gestão de Entregas e Logística e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Entregas & Logística, Pedidos & Vendas, Geral & Usabilidade.

**Destaques:**
- ⭐ Gestão de Entregas e Logística
- ⭐ Gestão de Entregas e Logística

#### 🚀 Novidades & Melhorias
- **[Entregas & Logística]** Gestão de Entregas e Logística: Implementado o módulo de controle e rastreamento de entregas vinculadas a pedidos de venda.
- **[Pedidos & Vendas]** Gestão de Entregas e Logística: Implementado o módulo de controle e rastreamento de entregas vinculadas a pedidos de venda.
- **[Geral & Usabilidade]** minute usage by users on topusers row: Atualização no módulo de Geral & Usabilidade: minute usage by users on topusers row.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** endpoint cards: Atualização no módulo de Geral & Usabilidade: endpoint cards.

---

## [v1.16.11] - 2026-07-15

### 📌 Localização de Erros em Português e Métricas de Consumo
> Mensagens de validação da API traduzidas para português do Brasil, registro de logs de alerta e auditoria de RPM.

**Destaques:**
- ⭐ Erros da API apresentados em português claro
- ⭐ Métricas de requisições por minuto (RPM) em dossiês

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** Inclusão de alert emails logs on db: Atualização no módulo de Geral & Usabilidade: add alert emails logs on db.
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Geral & Usabilidade]** localize Zod validation error messages to pt-BR systematically: Atualização no módulo de Geral & Usabilidade: localize Zod validation error messages to pt-BR systematically.
- **[Planos & Quotas]** Alertas preventivos de consumo de cota: Notificações automatizadas quando a franquia de requisições atinge 80% e 100% do limite mensal.
- **[Painel & Métricas]** rpm on dashboard: Atualização no módulo de Painel & Métricas: rpm on dashboard.
- **[Geral & Usabilidade]** translate zod errors: Atualização no módulo de Geral & Usabilidade: translate zod errors.

#### 🛠️ Correções & Estabilidade
- **[Contas a Receber]** Ajuste em automatic alert conditions, add manual resend capability to frontend, and fix payment method spec: Atualização no módulo de Contas a Receber: adjust automatic alert conditions, add manual resend capability to frontend, and fix payment method spec.
- **[Infraestrutura & Resiliência]** docker build prisma client copy paths: Atualização no módulo de Infraestrutura & Resiliência: docker build prisma client copy paths.
- **[Infraestrutura & Resiliência]** import path of PrismaClient at runtime: Atualização no módulo de Infraestrutura & Resiliência: import path of PrismaClient at runtime.
- **[Painel & Métricas]** mock data on dashboard spec: Atualização no módulo de Painel & Métricas: mock data on dashboard spec.
- **[Planos & Quotas]** count all requests within calendar month for usage stats and alerts: Atualização no módulo de Planos & Quotas: count all requests within calendar month for usage stats and alerts.
- **[Infraestrutura & Resiliência]** revert PrismaClient import and map path in tsconfig: Atualização no módulo de Infraestrutura & Resiliência: revert PrismaClient import and map path in tsconfig.

---

## [v1.16.10] - 2026-07-13

### 📌 Inclusão de date range to filename1 e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Dossiês & Relatórios, Planos & Quotas, Filtros de Período.

**Destaques:**
- ⭐ Inclusão de date range to filename1
- ⭐ Alertas preventivos de consumo de cota

#### 🚀 Novidades & Melhorias
- **[Dossiês & Relatórios]** Inclusão de date range to filename1: Atualização no módulo de Dossiês & Relatórios: add date range to filename1.
- **[Planos & Quotas]** Alertas preventivos de consumo de cota: Notificações automatizadas quando a franquia de requisições atinge 80% e 100% do limite mensal.
- **[Filtros de Período]** Inclusão de hour on data range: Atualização no módulo de Filtros de Período: add hour on data range.

#### 🛠️ Correções & Estabilidade
- **[Painel & Métricas]** icons: Atualização no módulo de Painel & Métricas: icons.
- **[Dossiês & Relatórios]** Inclusão de date range to filename 2: Atualização no módulo de Dossiês & Relatórios: add date range to filename 2.
- **[Dossiês & Relatórios]** Inclusão de date range to filename1: Atualização no módulo de Dossiês & Relatórios: add date range to filename1.
- **[Dossiês & Relatórios]** timezone: Atualização no módulo de Dossiês & Relatórios: timezone.
- **[Painel & Métricas]** header on scroll (admin && client dash): Atualização no módulo de Painel & Métricas: header on scroll (admin && client dash).

---

## [v1.16.9] - 2026-07-10

### 📌 Sessão Estendida no Painel e Dossiês Gerenciais
> Opção de manter sessão conectada, renovação silenciosa de tokens e geração robusta de dossiês em PDF.

**Destaques:**
- ⭐ Conveniência de sessão estendida no painel de administração
- ⭐ Relatórios executivos e auditoria em PDF

#### 🚀 Novidades & Melhorias
- **[Clientes]** Sessão prolongada e renovação automática de acesso: Opção de "lembrar sessão" e renovação transparente do token de acesso sem interromper a navegação no painel.
- **[Geral & Usabilidade]** Inclusão de pagination to HTTP logs and move section to third row: Atualização no módulo de Geral & Usabilidade: add pagination to HTTP logs and move section to third row.
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Geral & Usabilidade]** Proteção contra sobrecarga de requisições (Rate Limiting): Controle de taxa de requisições por usuário para evitar lentidão e garantir justiça na distribuição de recursos.
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Geral & Usabilidade]** sanitize all DTOs: Atualização no módulo de Geral & Usabilidade: sanitize all DTOs.

#### 🛠️ Correções & Estabilidade
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Dossiês & Relatórios]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Infraestrutura & Resiliência]** prisma: Atualização no módulo de Infraestrutura & Resiliência: prisma.
- **[Geral & Usabilidade]** Remoção de --single-process and --no-zygote flags to prevent Puppeteer TargetCloseError: Atualização no módulo de Geral & Usabilidade: remove --single-process and --no-zygote flags to prevent Puppeteer TargetCloseError.
- **[Geral & Usabilidade]** safeguard against null avgLatency and p95Latency in topEndpoints table templates: Atualização no módulo de Geral & Usabilidade: safeguard against null avgLatency and p95Latency in topEndpoints table templates.

---

## [v1.16.8] - 2026-07-06

### 📌 new cards on dashboard e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Painel & Métricas, Validação & Segurança de Dados.

**Destaques:**
- ⭐ new cards on dashboard
- ⭐ enforce strict validation for query parameters

#### 🚀 Novidades & Melhorias
- **[Painel & Métricas]** new cards on dashboard: Atualização no módulo de Painel & Métricas: new cards on dashboard.
- **[Validação & Segurança de Dados]** enforce strict validation for query parameters: Atualização no módulo de Validação & Segurança de Dados: enforce strict validation for query parameters.

---

## [v1.16.7] - 2026-07-06

### 📌 admin dash granular graph e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Painel & Métricas, Entregas & Logística.

**Destaques:**
- ⭐ admin dash granular graph
- ⭐ admin usage dashboard

#### 🚀 Novidades & Melhorias
- **[Painel & Métricas]** admin dash granular graph: Atualização no módulo de Painel & Métricas: admin dash granular graph.
- **[Painel & Métricas]** admin usage dashboard: Atualização no módulo de Painel & Métricas: admin usage dashboard.
- **[Entregas & Logística]** Gestão de Entregas e Logística: Implementado o módulo de controle e rastreamento de entregas vinculadas a pedidos de venda.

#### 🛠️ Correções & Estabilidade
- **[Painel & Métricas]** admin dash: Atualização no módulo de Painel & Métricas: admin dash.
- **[Painel & Métricas]** no count dashboard requests on dashboard panel: Atualização no módulo de Painel & Métricas: no count dashboard requests on dashboard panel.

---

## [v1.16.6] - 2026-07-02

### 📌 GET /stores e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Geral & Usabilidade.

**Destaques:**
- ⭐ GET /stores

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** GET /stores: Atualização no módulo de Geral & Usabilidade: GET /stores.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** checkboxes: Atualização no módulo de Geral & Usabilidade: checkboxes.
- **[Geral & Usabilidade]** Atualização de node-firebird: Atualização no módulo de Geral & Usabilidade: update node-firebird.
- **[Geral & Usabilidade]** Criptografia na comunicação com Firebird: Habilitação de criptografia de canal (WireCrypt) na comunicação remota com os bancos de dados dos clientes.
- **[Geral & Usabilidade]** Criptografia na comunicação com Firebird: Habilitação de criptografia de canal (WireCrypt) na comunicação remota com os bancos de dados dos clientes.

---

## [v1.16.5] - 2026-06-09

### 📌 Operações de Vendas & Pedidos e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Pedidos & Vendas.

**Destaques:**
- ⭐ Operações de Vendas & Pedidos
- ⭐ payment_plan_code on CreateOrderDTO

#### 🚀 Novidades & Melhorias
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.
- **[Pedidos & Vendas]** payment_plan_code on CreateOrderDTO: Atualização no módulo de Pedidos & Vendas: payment_plan_code on CreateOrderDTO.

#### 🛠️ Correções & Estabilidade
- **[Pedidos & Vendas]** order_id on CreateOrderDTO: Atualização no módulo de Pedidos & Vendas: order_id on CreateOrderDTO.

---

## [v1.16.4] - 2026-06-09

### 📌 Operações de Vendas & Pedidos e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Pedidos & Vendas, Geral & Usabilidade.

**Destaques:**
- ⭐ Operações de Vendas & Pedidos

#### 🚀 Novidades & Melhorias
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** loj_codigo && usu_codigo && fun_codigo by field on endpoint: Atualização no módulo de Geral & Usabilidade: loj_codigo && usu_codigo && fun_codigo by field on endpoint.

---

## [v1.16.3] - 2026-06-03

### 📌 return sit_codigo on order e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Pedidos & Vendas.

**Destaques:**
- ⭐ return sit_codigo on order

#### 🚀 Novidades & Melhorias
- **[Pedidos & Vendas]** return sit_codigo on order: Atualização no módulo de Pedidos & Vendas: return sit_codigo on order.

---

## [v1.16.2] - 2026-05-25

### 📌 more options on POST order and disable POST receipt e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Pedidos & Vendas.

**Destaques:**
- ⭐ more options on POST order and disable POST receipt

#### 🚀 Novidades & Melhorias
- **[Pedidos & Vendas]** more options on POST order and disable POST receipt: Atualização no módulo de Pedidos & Vendas: more options on POST order and disable POST receipt.

---

## [v1.16.1] - 2026-05-20

### 📌 Central de Avisos e Notificações
> Implementação da gaveta de avisos com separação por lidos e não lidos para os usuários da API.

**Destaques:**
- ⭐ Central de comunicados e notificações interativa

#### 🚀 Novidades & Melhorias
- **[Avisos & Notificações]** Implementação de notifications drawer system with read/unread tabs: Atualização no módulo de Avisos & Notificações: implement notifications drawer system with read/unread tabs.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** Remoção de stores to form: Atualização no módulo de Geral & Usabilidade: remove stores to form.

---

## [v1.16.0] - 2026-05-20

### 📌 Implementação de POST and PATCH /products/groups e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Grupos de Produtos, Catálogo de Produtos.

**Destaques:**
- ⭐ Implementação de POST and PATCH /products/groups
- ⭐ patch /products/brands && lint

#### 🚀 Novidades & Melhorias
- **[Grupos de Produtos]** Implementação de POST and PATCH /products/groups: Atualização no módulo de Grupos de Produtos: implement POST and PATCH /products/groups.
- **[Catálogo de Produtos]** patch /products/brands && lint: Atualização no módulo de Catálogo de Produtos: patch /products/brands && lint.
- **[Catálogo de Produtos]** post /products/brands: Atualização no módulo de Catálogo de Produtos: post /products/brands.

---

## [v1.15.1] - 2026-05-19

### 📌 Geração de Dossiês e Relatórios em PDF e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Geral & Usabilidade, Funcionários & Cargos, Autenticação & Acesso.

**Destaques:**
- ⭐ Geração de Dossiês e Relatórios em PDF
- ⭐ new query params on account receivable and employee modules

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** Geração de Dossiês e Relatórios em PDF: Exportação de relatórios gerenciais consolidados em PDF com métricas de consumo de requisições, latência e chamadas por minuto (RPM).
- **[Funcionários & Cargos]** new query params on account receivable and employee modules: Atualização no módulo de Funcionários & Cargos: new query params on account receivable and employee modules.

#### 🛠️ Correções & Estabilidade
- **[Autenticação & Acesso]** user login example: Atualização no módulo de Autenticação & Acesso: user login example.

---

## [v1.15.0] - 2026-05-18

### 📌 Módulo Oficial de Newsletter
> Criação do módulo para envio de comunicados por e-mail sobre lançamentos e novidades da plataforma.

**Destaques:**
- ⭐ Disparo de e-mails informativos com formatação corporativa

#### 🚀 Novidades & Melhorias
- **[Informativos]** Módulo de Informativos & Novidades: Canal oficial para disparo de comunicados técnicos e comunicados de novidades aos usuários integradores.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** findOne user GET: Atualização no módulo de Geral & Usabilidade: findOne user GET.

---

## [v1.14.0] - 2026-05-18

### 📌 Módulo de Entregas & Rastreamento
> Novo módulo para acompanhamento e controle de despachos e status de entrega.

**Destaques:**
- ⭐ Gestão de entregas diretamente pela API

#### 🚀 Novidades & Melhorias
- **[Entregas & Logística]** Gestão de Entregas e Logística: Implementado o módulo de controle e rastreamento de entregas vinculadas a pedidos de venda.
- **[Entregas & Logística]** Gestão de Entregas e Logística: Implementado o módulo de controle e rastreamento de entregas vinculadas a pedidos de venda.

---

## [v1.13.0] - 2026-05-18

### 📌 GET /employee-roles e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Funcionários & Cargos.

**Destaques:**
- ⭐ GET /employee-roles

#### 🚀 Novidades & Melhorias
- **[Funcionários & Cargos]** GET /employee-roles: Atualização no módulo de Funcionários & Cargos: GET /employee-roles.

---

## [v1.12.1] - 2026-05-18

### 📌 return function of employees e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Funcionários & Cargos.

**Destaques:**
- ⭐ return function of employees

#### 🚀 Novidades & Melhorias
- **[Funcionários & Cargos]** return function of employees: Atualização no módulo de Funcionários & Cargos: return function of employees.

---

## [v1.12.0] - 2026-05-15

### 📌 GET /account-payable e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Contas a Receber.

**Destaques:**
- ⭐ GET /account-payable

#### 🚀 Novidades & Melhorias
- **[Contas a Receber]** GET /account-payable: Atualização no módulo de Contas a Receber: GET /account-payable.

---

## [v1.11.0] - 2026-05-15

### 📌 GET /payment-plans e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Planos & Quotas.

**Destaques:**
- ⭐ GET /payment-plans

#### 🚀 Novidades & Melhorias
- **[Planos & Quotas]** GET /payment-plans: Atualização no módulo de Planos & Quotas: GET /payment-plans.

---

## [v1.10.1] - 2026-05-15

### 📌 Correções de estabilidade e aprimoramentos
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Clientes, Geral & Usabilidade.

**Destaques:**
- ⭐ `clients`, `employees` and `suppliers` response dto
- ⭐ file `.versionrc`

#### 🛠️ Correções & Estabilidade
- **[Clientes]** `clients`, `employees` and `suppliers` response dto: Atualização no módulo de Clientes: `clients`, `employees` and `suppliers` response dto.
- **[Geral & Usabilidade]** file `.versionrc`: Atualização no módulo de Geral & Usabilidade: file `.versionrc`.

---

## [v1.10.0] - 2026-05-15

### 📌 filter orders by employee e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Pedidos & Vendas, Geral & Usabilidade.

**Destaques:**
- ⭐ filter orders by employee
- ⭐ GET /service-providers

#### 🚀 Novidades & Melhorias
- **[Pedidos & Vendas]** filter orders by employee: Atualização no módulo de Pedidos & Vendas: filter orders by employee.
- **[Geral & Usabilidade]** GET /service-providers: Atualização no módulo de Geral & Usabilidade: GET /service-providers.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** versioning scripts: Atualização no módulo de Geral & Usabilidade: versioning scripts.

---

## [v1.9.0] - 2026-05-15

### 📌 GET /suppliers e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Fornecedores, Funcionários & Cargos, Criptografia & Segurança.

**Destaques:**
- ⭐ GET /suppliers
- ⭐ GET /employees

#### 🚀 Novidades & Melhorias
- **[Fornecedores]** GET /suppliers: Atualização no módulo de Fornecedores: GET /suppliers.
- **[Funcionários & Cargos]** GET /employees: Atualização no módulo de Funcionários & Cargos: GET /employees.
- **[Geral & Usabilidade]** test connection: Atualização no módulo de Geral & Usabilidade: test connection.

#### 🛠️ Correções & Estabilidade
- **[Pedidos & Vendas]** Remoção de type `E` to /orders: Atualização no módulo de Pedidos & Vendas: remove type `E` to /orders.
- **[Geral & Usabilidade]** test connection treatment: Atualização no módulo de Geral & Usabilidade: test connection treatment.
- **[Geral & Usabilidade]** test connection treatment 2: Atualização no módulo de Geral & Usabilidade: test connection treatment 2.

#### 🔒 Segurança & Infraestrutura
- **[Criptografia & Segurança]** supports 129 password: Atualização no módulo de Criptografia & Segurança: supports 129 password.

---

## [v1.7.0] - 2026-05-14

### 📌 GET /order-items e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Pedidos & Vendas, Geral & Usabilidade.

**Destaques:**
- ⭐ GET /order-items

#### 🚀 Novidades & Melhorias
- **[Pedidos & Vendas]** GET /order-items: Atualização no módulo de Pedidos & Vendas: GET /order-items.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** POST /user return JSON: Atualização no módulo de Geral & Usabilidade: POST /user return JSON.

---

## [v1.6.0] - 2026-05-14

### 📌 Correções de estabilidade e aprimoramentos
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Monitoramento & Saúde, Catálogo de Produtos, Geral & Usabilidade.

**Destaques:**
- ⭐ status controller
- ⭐ status page template path for production

#### 🛠️ Correções & Estabilidade
- **[Monitoramento & Saúde]** status controller: Atualização no módulo de Monitoramento & Saúde: status controller.
- **[Catálogo de Produtos]** status page template path for production: Atualização no módulo de Catálogo de Produtos: status page template path for production.
- **[Catálogo de Produtos]** storeId on products: Atualização no módulo de Catálogo de Produtos: storeId on products.
- **[Geral & Usabilidade]** zod validation: Atualização no módulo de Geral & Usabilidade: zod validation.

---

## [v1.5.3] - 2026-05-14

### 📌 clients options on request form e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Clientes, Catálogo de Produtos, Pedidos & Vendas.

**Destaques:**
- ⭐ clients options on request form
- ⭐ filter tablePrice on GET products

#### 🚀 Novidades & Melhorias
- **[Clientes]** clients options on request form: Atualização no módulo de Clientes: clients options on request form.
- **[Catálogo de Produtos]** filter tablePrice on GET products: Atualização no módulo de Catálogo de Produtos: filter tablePrice on GET products.
- **[Pedidos & Vendas]** filters on GET orders: Atualização no módulo de Pedidos & Vendas: filters on GET orders.
- **[Pedidos & Vendas]** filters on GET orders: Atualização no módulo de Pedidos & Vendas: filters on GET orders.
- **[Painel & Métricas]** Implementação de background monitoring service and status dashboard template: Atualização no módulo de Painel & Métricas: implement background monitoring service and status dashboard template.
- **[Monitoramento & Saúde]** status page: Atualização no módulo de Monitoramento & Saúde: status page.
- **[Geral & Usabilidade]** tabs management and refresh data in admin panel: Atualização no módulo de Geral & Usabilidade: tabs management and refresh data in admin panel.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** api latency 0ms bug: Atualização no módulo de Geral & Usabilidade: api latency 0ms bug.
- **[Infraestrutura & Resiliência]** prisma migrations: Atualização no módulo de Infraestrutura & Resiliência: prisma migrations.
- **[Pedidos & Vendas]** resolve merge conflicts in order controller and swagger spec: Atualização no módulo de Pedidos & Vendas: resolve merge conflicts in order controller and swagger spec.
- **[Monitoramento & Saúde]** status controller: Atualização no módulo de Monitoramento & Saúde: status controller.
- **[Catálogo de Produtos]** status page template path for production: Atualização no módulo de Catálogo de Produtos: status page template path for production.
- **[Catálogo de Produtos]** storeId on products: Atualização no módulo de Catálogo de Produtos: storeId on products.
- **[Geral & Usabilidade]** zod validation: Atualização no módulo de Geral & Usabilidade: zod validation.

---

## [v1.5.2] - 2026-05-13

### 📌 clients options on request form e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Clientes, Pedidos & Vendas, Painel & Métricas.

**Destaques:**
- ⭐ clients options on request form
- ⭐ filters on GET orders

#### 🚀 Novidades & Melhorias
- **[Clientes]** clients options on request form: Atualização no módulo de Clientes: clients options on request form.
- **[Pedidos & Vendas]** filters on GET orders: Atualização no módulo de Pedidos & Vendas: filters on GET orders.
- **[Pedidos & Vendas]** filters on GET orders: Atualização no módulo de Pedidos & Vendas: filters on GET orders.
- **[Painel & Métricas]** Implementação de background monitoring service and status dashboard template: Atualização no módulo de Painel & Métricas: implement background monitoring service and status dashboard template.
- **[Monitoramento & Saúde]** status page: Atualização no módulo de Monitoramento & Saúde: status page.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** api latency 0ms bug: Atualização no módulo de Geral & Usabilidade: api latency 0ms bug.
- **[Infraestrutura & Resiliência]** prisma migrations: Atualização no módulo de Infraestrutura & Resiliência: prisma migrations.
- **[Pedidos & Vendas]** resolve merge conflicts in order controller and swagger spec: Atualização no módulo de Pedidos & Vendas: resolve merge conflicts in order controller and swagger spec.
- **[Monitoramento & Saúde]** status controller: Atualização no módulo de Monitoramento & Saúde: status controller.
- **[Catálogo de Produtos]** status page template path for production: Atualização no módulo de Catálogo de Produtos: status page template path for production.
- **[Geral & Usabilidade]** zod validation: Atualização no módulo de Geral & Usabilidade: zod validation.

---

## [v1.5.1] - 2026-05-13

### 📌 clients options on request form e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Clientes, Monitoramento & Saúde, Infraestrutura & Resiliência.

**Destaques:**
- ⭐ clients options on request form
- ⭐ status page

#### 🚀 Novidades & Melhorias
- **[Clientes]** clients options on request form: Atualização no módulo de Clientes: clients options on request form.
- **[Monitoramento & Saúde]** status page: Atualização no módulo de Monitoramento & Saúde: status page.

#### 🛠️ Correções & Estabilidade
- **[Infraestrutura & Resiliência]** prisma migrations: Atualização no módulo de Infraestrutura & Resiliência: prisma migrations.
- **[Catálogo de Produtos]** status page template path for production: Atualização no módulo de Catálogo de Produtos: status page template path for production.
- **[Geral & Usabilidade]** zod validation: Atualização no módulo de Geral & Usabilidade: zod validation.

---

## [v1.5.0] - 2026-05-12

### 📌 clients options on request form e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Clientes, Monitoramento & Saúde.

**Destaques:**
- ⭐ clients options on request form
- ⭐ status page

#### 🚀 Novidades & Melhorias
- **[Clientes]** clients options on request form: Atualização no módulo de Clientes: clients options on request form.
- **[Monitoramento & Saúde]** status page: Atualização no módulo de Monitoramento & Saúde: status page.

---

## [v1.4.0] - 2026-05-12

### 📌 Painel do Cliente e Monitoramento de Uptime
> Disponibilização do portal do cliente, rotação de senhas, monitoramento de disponibilidade e página pública de status.

**Destaques:**
- ⭐ Portal de autoatendimento para clientes integradores
- ⭐ Monitoramento ativo de saúde e página de status

#### 🚀 Novidades & Melhorias
- **[Clientes]** `Links Uteis` on client panel: Atualização no módulo de Clientes: `Links Uteis` on client panel.
- **[Avisos & Notificações]** Inclusão de seed script for announcement permissions and assign to admin role: Atualização no módulo de Avisos & Notificações: add seed script for announcement permissions and assign to admin role.
- **[Geral & Usabilidade]** docs versioning: Atualização no módulo de Geral & Usabilidade: docs versioning.
- **[Avisos & Notificações]** Implementação de announcement system with persistence, tracking, and UI integration: Atualização no módulo de Avisos & Notificações: implement announcement system with persistence, tracking, and UI integration.
- **[Clientes]** Implementação de clients module: Atualização no módulo de Clientes: implement clients module.
- **[Avisos & Notificações]** Implementação de RBAC-protected announcement module and define system-wide permissions catalog: Atualização no módulo de Avisos & Notificações: implement RBAC-protected announcement module and define system-wide permissions catalog.
- **[Geral & Usabilidade]** integration guide tab: Atualização no módulo de Geral & Usabilidade: integration guide tab.
- **[Geral & Usabilidade]** lp of integrations: Atualização no módulo de Geral & Usabilidade: lp of integrations.
- **[Geral & Usabilidade]** tab `Links Uteis` && filter for `Solicitações`: Atualização no módulo de Geral & Usabilidade: tab `Links Uteis` && filter for `Solicitações`.
- **[Monitoramento & Saúde]** uptime monitor: Atualização no módulo de Monitoramento & Saúde: uptime monitor.
- **[Geral & Usabilidade]** vpn guard on admin endpoints: Atualização no módulo de Geral & Usabilidade: vpn guard on admin endpoints.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** action btns on admin panel: Atualização no módulo de Geral & Usabilidade: action btns on admin panel.
- **[Geral & Usabilidade]** alter invite duration: Atualização no módulo de Geral & Usabilidade: alter invite duration.
- **[Geral & Usabilidade]** apply green-blue strategy to deploy: Atualização no módulo de Geral & Usabilidade: apply green-blue strategy to deploy.
- **[Clientes]** auto logout to clients in admin: Atualização no módulo de Clientes: auto logout to clients in admin.
- **[Geral & Usabilidade]** close buttons on modals: Atualização no módulo de Geral & Usabilidade: close buttons on modals.
- **[Monitoramento & Saúde]** deploy.sh healthcheck: Atualização no módulo de Monitoramento & Saúde: deploy.sh healthcheck.
- **[Geral & Usabilidade]** favicon: Atualização no módulo de Geral & Usabilidade: favicon.
- **[Geral & Usabilidade]** favicon2: Atualização no módulo de Geral & Usabilidade: favicon2.
- **[Clientes]** icon on client panel: Atualização no módulo de Clientes: icon on client panel.
- **[Geral & Usabilidade]** images: Atualização no módulo de Geral & Usabilidade: images.
- **[Geral & Usabilidade]** permissions block on creation role: Atualização no módulo de Geral & Usabilidade: permissions block on creation role.
- **[Avisos & Notificações]** Remoção de announcement endpoints of Swagger: Atualização no módulo de Avisos & Notificações: remove announcement endpoints of Swagger.
- **[Geral & Usabilidade]** Remoção de vpn guard && add docs: Atualização no módulo de Geral & Usabilidade: remove vpn guard && add docs.
- **[Monitoramento & Saúde]** status page url: Atualização no módulo de Monitoramento & Saúde: status page url.
- **[Monitoramento & Saúde]** statuspage url: Atualização no módulo de Monitoramento & Saúde: statuspage url.
- **[Avisos & Notificações]** turn database seed script for announcement permissions and assign them to the Admin role to JS file: Atualização no módulo de Avisos & Notificações: turn database seed script for announcement permissions and assign them to the Admin role to JS file.
- **[Geral & Usabilidade]** unit tests: Atualização no módulo de Geral & Usabilidade: unit tests.

#### 🔒 Segurança & Infraestrutura
- **[Criptografia & Segurança]** Inclusão de rotate password to client: Atualização no módulo de Criptografia & Segurança: add rotate password to client.
- **[Criptografia & Segurança]** welcome email after password generation: Atualização no módulo de Criptografia & Segurança: welcome email after password generation.
- **[Geral & Usabilidade]** Remoção de 404s blocklist: Atualização no módulo de Geral & Usabilidade: remove 404s blocklist.
- **[Criptografia & Segurança]** setup password: Atualização no módulo de Criptografia & Segurança: setup password.

---

## [v1.3.0] - 2026-05-07

### 📌 vpn guard on admin endpoints e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Criptografia & Segurança, Geral & Usabilidade, Clientes.

**Destaques:**
- ⭐ vpn guard on admin endpoints

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** vpn guard on admin endpoints: Atualização no módulo de Geral & Usabilidade: vpn guard on admin endpoints.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** action btns on admin panel: Atualização no módulo de Geral & Usabilidade: action btns on admin panel.
- **[Clientes]** auto logout to clients in admin: Atualização no módulo de Clientes: auto logout to clients in admin.
- **[Geral & Usabilidade]** close buttons on modals: Atualização no módulo de Geral & Usabilidade: close buttons on modals.
- **[Clientes]** icon on client panel: Atualização no módulo de Clientes: icon on client panel.
- **[Geral & Usabilidade]** permissions block on creation role: Atualização no módulo de Geral & Usabilidade: permissions block on creation role.
- **[Geral & Usabilidade]** Remoção de vpn guard && add docs: Atualização no módulo de Geral & Usabilidade: remove vpn guard && add docs.

#### 🔒 Segurança & Infraestrutura
- **[Criptografia & Segurança]** Inclusão de rotate password to client: Atualização no módulo de Criptografia & Segurança: add rotate password to client.
- **[Criptografia & Segurança]** setup password: Atualização no módulo de Criptografia & Segurança: setup password.

---

## [v1.2.6] - 2026-05-06

### 📌 invite management e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Geral & Usabilidade, Infraestrutura & Resiliência, Catálogo de Produtos.

**Destaques:**
- ⭐ invite management
- ⭐ Proteção contra sobrecarga de requisições (Rate Limiting)

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** invite management: Atualização no módulo de Geral & Usabilidade: invite management.
- **[Geral & Usabilidade]** Proteção contra sobrecarga de requisições (Rate Limiting): Controle de taxa de requisições por usuário para evitar lentidão e garantir justiça na distribuição de recursos.

#### 🛠️ Correções & Estabilidade
- **[Infraestrutura & Resiliência]** prisma seeding: Atualização no módulo de Infraestrutura & Resiliência: prisma seeding.
- **[Catálogo de Produtos]** product GET fields: Atualização no módulo de Catálogo de Produtos: product GET fields.

---

## [v1.2.5] - 2026-05-06

### 📌 invite management e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Geral & Usabilidade.

**Destaques:**
- ⭐ invite management

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** invite management: Atualização no módulo de Geral & Usabilidade: invite management.

---

## [v1.2.4] - 2026-05-06

### 📌 Inclusão de responsible contact to request form e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Geral & Usabilidade.

**Destaques:**
- ⭐ Inclusão de responsible contact to request form

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** Inclusão de responsible contact to request form: Atualização no módulo de Geral & Usabilidade: add responsible contact to request form.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** nest warnings: Atualização no módulo de Geral & Usabilidade: nest warnings.

---

## [v1.2.3] - 2026-05-05

### 📌 client confirmation email by request e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Clientes, Geral & Usabilidade.

**Destaques:**
- ⭐ client confirmation email by request
- ⭐ rejection reason

#### 🚀 Novidades & Melhorias
- **[Clientes]** client confirmation email by request: Atualização no módulo de Clientes: client confirmation email by request.
- **[Geral & Usabilidade]** rejection reason: Atualização no módulo de Geral & Usabilidade: rejection reason.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** `Solicitações` information on card: Atualização no módulo de Geral & Usabilidade: `Solicitações` information on card.
- **[Geral & Usabilidade]** admin panel: Atualização no módulo de Geral & Usabilidade: admin panel.

---

## [v1.2.2] - 2026-05-05

### 📌 users && roles && permission && dbCredentials monitoring e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Geral & Usabilidade.

**Destaques:**
- ⭐ users && roles && permission && dbCredentials monitoring

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** users && roles && permission && dbCredentials monitoring: Atualização no módulo de Geral & Usabilidade: users && roles && permission && dbCredentials monitoring.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** no show `Solicitações` tab without permission: Atualização no módulo de Geral & Usabilidade: no show `Solicitações` tab without permission.

---

## [v1.2.1] - 2026-05-04

### 📌 Inclusão de support icon on Swagger e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Geral & Usabilidade, Clientes.

**Destaques:**
- ⭐ Inclusão de support icon on Swagger
- ⭐ mail send for client and support

#### 🚀 Novidades & Melhorias
- **[Geral & Usabilidade]** Inclusão de support icon on Swagger: Atualização no módulo de Geral & Usabilidade: add support icon on Swagger.
- **[Clientes]** mail send for client and support: Atualização no módulo de Clientes: mail send for client and support.
- **[Clientes]** mail send for client and support: Atualização no módulo de Clientes: mail send for client and support.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** malformed sql queries: Atualização no módulo de Geral & Usabilidade: malformed sql queries.

---

## [v1.2.0] - 2026-05-04

### 📌 client request form e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Clientes.

**Destaques:**
- ⭐ client request form

#### 🚀 Novidades & Melhorias
- **[Clientes]** client request form: Atualização no módulo de Clientes: client request form.

#### 🛠️ Correções & Estabilidade
- **[Clientes]** client request form: Atualização no módulo de Clientes: client request form.

---

## [v1.1.4] - 2026-05-04

### 📌 Correções de estabilidade e aprimoramentos
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Infraestrutura & Resiliência.

**Destaques:**
- ⭐ firebird connection pool

#### 🛠️ Correções & Estabilidade
- **[Infraestrutura & Resiliência]** firebird connection pool: Atualização no módulo de Infraestrutura & Resiliência: firebird connection pool.

---

## [v1.1.3] - 2026-04-27

### 📌 block many 404 unauthenticated requests e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Autenticação & Acesso, Monitoramento & Saúde, Geral & Usabilidade.

**Destaques:**
- ⭐ block many 404 unauthenticated requests
- ⭐ implements `/health` endpoint

#### 🚀 Novidades & Melhorias
- **[Autenticação & Acesso]** block many 404 unauthenticated requests: Atualização no módulo de Autenticação & Acesso: block many 404 unauthenticated requests.
- **[Monitoramento & Saúde]** implements `/health` endpoint: Atualização no módulo de Monitoramento & Saúde: implements `/health` endpoint.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** no send `4xx` errors for issues on sentry: Atualização no módulo de Geral & Usabilidade: no send `4xx` errors for issues on sentry.
- **[Monitoramento & Saúde]** Remoção de health endpoint to logs: Atualização no módulo de Monitoramento & Saúde: remove health endpoint to logs.

---

## [v1.1.2] - 2026-04-23

### 📌 Inclusão de two decimal places on `REC_NUMERO` field e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Contas a Receber, Autenticação & Acesso.

**Destaques:**
- ⭐ Inclusão de two decimal places on `REC_NUMERO` field

#### 🚀 Novidades & Melhorias
- **[Contas a Receber]** Inclusão de two decimal places on `REC_NUMERO` field: Atualização no módulo de Contas a Receber: add two decimal places on `REC_NUMERO` field.

#### 🛠️ Correções & Estabilidade
- **[Contas a Receber]** `account-receivable.service.ts`: Atualização no módulo de Contas a Receber: `account-receivable.service.ts`.
- **[Autenticação & Acesso]** role returning on login endpoint: Atualização no módulo de Autenticação & Acesso: role returning on login endpoint.

---

## [v1.1.1] - 2026-04-17

### 📌 implements `GET /account-receivable` e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Contas a Receber, Geral & Usabilidade.

**Destaques:**
- ⭐ implements `GET /account-receivable`

#### 🚀 Novidades & Melhorias
- **[Contas a Receber]** implements `GET /account-receivable`: Atualização no módulo de Contas a Receber: implements `GET /account-receivable`.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** `node-firebird` crash bug: Atualização no módulo de Geral & Usabilidade: `node-firebird` crash bug.
- **[Geral & Usabilidade]** test suites to use new `tenant-connection`: Atualização no módulo de Geral & Usabilidade: test suites to use new `tenant-connection`.

---

## [v1.1.0] - 2026-04-16

### 📌 implements `GET /account-receivable` e melhorias
> Esta versão reúne melhorias contínuas, foco em estabilidade e segurança nos módulos de Contas a Receber.

**Destaques:**
- ⭐ implements `GET /account-receivable`

#### 🚀 Novidades & Melhorias
- **[Contas a Receber]** implements `GET /account-receivable`: Atualização no módulo de Contas a Receber: implements `GET /account-receivable`.

---

## [v1.0.0] - 2026-04-10

### 📌 Lançamento Inicial da InfoBrasil API
> Disponibilização da primeira versão da API com integração para produtos, pedidos, clientes e autenticação segura.

**Destaques:**
- ⭐ Primeira versão estável da plataforma de integração

---

## [v0.0.2] - 2026-04-10

### 📌 Lançamento Inicial da InfoBrasil API
> Disponibilização da primeira versão da API com integração para produtos, pedidos, clientes e autenticação segura.

**Destaques:**
- ⭐ Primeira versão estável da plataforma de integração

#### 🚀 Novidades & Melhorias
- **[Catálogo de Produtos]** `GET /products/:id` && `GET /products/ean/:ean`: Atualização no módulo de Catálogo de Produtos: `GET /products/:id` && `GET /products/ean/:ean`.
- **[Catálogo de Produtos]** Inclusão de `minStock` query param on `GET /products`: Atualização no módulo de Catálogo de Produtos: add `minStock` query param on `GET /products`.
- **[Catálogo de Produtos]** Inclusão de `search` to `GET /products`: Atualização no módulo de Catálogo de Produtos: add `search` to `GET /products`.
- **[Geral & Usabilidade]** Inclusão de `store_id` on user: Atualização no módulo de Geral & Usabilidade: add `store_id` on user.
- **[Geral & Usabilidade]** Inclusão de permission guard: Atualização no módulo de Geral & Usabilidade: add permission guard.
- **[Geral & Usabilidade]** Inclusão de permission guard on existing controllers: Atualização no módulo de Geral & Usabilidade: add permission guard on existing controllers.
- **[Catálogo de Produtos]** Inclusão de stock from products: Atualização no módulo de Catálogo de Produtos: add stock from products.
- **[Autenticação & Acesso]** dynamic store_id by JWT: Atualização no módulo de Autenticação & Acesso: dynamic store_id by JWT.
- **[Autenticação & Acesso]** endpoint `post /auth/login`: Atualização no módulo de Autenticação & Acesso: endpoint `post /auth/login`.
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.
- **[Catálogo de Produtos]** filter products by brand && group: Atualização no módulo de Catálogo de Produtos: filter products by brand && group.
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.
- **[Catálogo de Produtos]** implements `api/v1/products`: Atualização no módulo de Catálogo de Produtos: implements `api/v1/products`.
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.
- **[Contas a Receber]** implements `GET /payment-methods`: Atualização no módulo de Contas a Receber: implements `GET /payment-methods`.
- **[Catálogo de Produtos]** implements `GET /products/brands`: Atualização no módulo de Catálogo de Produtos: implements `GET /products/brands`.
- **[Catálogo de Produtos]** implements `GET /products/groups`: Atualização no módulo de Catálogo de Produtos: implements `GET /products/groups`.
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.
- **[Geral & Usabilidade]** implements `tenant connection module`: Atualização no módulo de Geral & Usabilidade: implements `tenant connection module`.
- **[Autenticação & Acesso]** implements endpoint `auth/refresh`: Atualização no módulo de Autenticação & Acesso: implements endpoint `auth/refresh`.
- **[Catálogo de Produtos]** improve `GET /products` by query params and specify columns: Atualização no módulo de Catálogo de Produtos: improve `GET /products` by query params and specify columns.

#### 🛠️ Correções & Estabilidade
- **[Geral & Usabilidade]** Inclusão de `storeId` on all functions: Atualização no módulo de Geral & Usabilidade: add `storeId` on all functions.
- **[Pedidos & Vendas]** Operações de Vendas & Pedidos: Aprimoramento nos fluxos de consulta e criação de pedidos de venda com suporte a novos campos e formas de pagamento.
- **[Geral & Usabilidade]** Ajuste em total value: Atualização no módulo de Geral & Usabilidade: adjust total value.
- **[Geral & Usabilidade]** code to assert all unit tests: Atualização no módulo de Geral & Usabilidade: code to assert all unit tests.
- **[Catálogo de Produtos]** product group adjusts to assert tests: Atualização no módulo de Catálogo de Produtos: product group adjusts to assert tests.
- **[Catálogo de Produtos]** product params: Atualização no módulo de Catálogo de Produtos: product params.
- **[Geral & Usabilidade]** swagger server definition: Atualização no módulo de Geral & Usabilidade: swagger server definition.
- **[Monitoramento & Saúde]** verify user status on login: Atualização no módulo de Monitoramento & Saúde: verify user status on login.

#### 🔒 Segurança & Infraestrutura
- **[Criptografia & Segurança]** Proteção criptográfica de credenciais de banco: Implementado utilitário para cifrar senhas e credenciais dos bancos de dados dos clientes na camada de persistência.

---

