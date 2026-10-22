<!-- =========================================================================
     CAPA (COVER PAGE)
     ========================================================================= -->

<div align="center">
  <br /><br />
  <p style="font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #059669; font-weight: bold;">
    INFOBRASIL SISTEMAS • ENGENHARIA DE SOFTWARE & ARQUITETURA
  </p>
  <br />
  <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
    DOCUMENTO DE ARQUITETURA & ESPECIFICAÇÃO TÉCNICA
  </h1>
  <h2 style="font-size: 20px; font-weight: 600; color: #334155; margin-top: 0;">
    Ecossistema de Integrações InfoAPI
  </h2>
  <p style="font-size: 15px; color: #64748b; max-width: 600px;">
    Guia arquitetural unificado: Inbound APIs (B2B), Barramento Interno (InfoAPI Retaguarda) e Integrações Reversas (Outbound Third-Party).
  </p>
  <br /><br />
  <div style="display: inline-block; border-left: 3px solid #059669; padding-left: 12px; text-align: left; font-size: 13px; color: #475569;">
    <strong>Autor:</strong> Gabriel Camurça<br />
    <strong>Versão Atual:</strong> 1.17.1 (Build 64)<br />
    <strong>Data de Emissão:</strong> Outubro de 2026<br />
    <strong>Classificação:</strong> Confidencial / Uso Interno & Parceiros Homologados
  </div>
  <br /><br /><br />
</div>

<div style="page-break-after: always;"></div>

<!-- =========================================================================
     CONTRACAPA & FICHA CATALOGRÁFICA TÉCNICA
     ========================================================================= -->

## Ficha de Controle e Governança do Documento

| Parâmetro | Detalhes do Registro |
| :--- | :--- |
| **Título do Documento** | Especificação Arquitetural e Operacional do Ecossistema InfoAPI |
| **Identificador / ID** | DOC-ENG-INFOAPI-2026-V1.17 |
| **Stack Primária** | Node.js (Gateway & Serviços) + Firebird SQL (Multi-tenant DBs) |
| **Repositório Central** | `git.infobrasil.com.br/core/infoapi-ecosystem` |
| **Aprovadores** | Gabriel Camurça (Tech Lead) / Diretoria InfoBrasil |
| **Status do Ciclo de Vida** | Homologado em Produção (v1.17.1) |

---

### Histórico de Revisões e Deploys

| Versão | Data | Autor | Resumo das Alterações |
| :---: | :---: | :--- | :--- |
| `0.1.0` | Jun/2026 | Gabriel Camurça | Especificação inicial do gateway REST e conexão de tenants. |
| `1.0.0` | Jul/2026 | Gabriel Camurça | Implementação de Rate Limiting (429) e criação de índices compostos em `VENDAS`. |
| `1.10.0`| Ago/2026 | Gabriel Camurça | Estruturação comercial por Tiers (Free, Profissional, Enterprise) e Log Processor. |
| `1.15.0`| Set/2026 | Gabriel Camurça | Módulo de chamadas reversas (SEFAZ/PIX) e desacoplamento da InfoAPI Retaguarda. |
| `1.17.1`| Out/2026 | Gabriel Camurça | Versão consolidada (Deploy #64): Sistema de tíquetes, paginação `pageSize=500`. |

<div style="page-break-after: always;"></div>

<!-- =========================================================================
     SUMÁRIO (TABLE OF CONTENTS)
     ========================================================================= -->

## Sumário Executivo

1. [Visão Geral & Objetivos Estratégicos](#1-visão-geral--objetivos-estratégicos)
2. [Macroarquitetura do Ecossistema InfoBrasil](#2-macroarquitetura-do-ecossistema-infobrasil)
3. [Pilar 1: InfoAPI Corporativa (Inbound B2B)](#3-pilar-1-infoapi-corporativa-inbound-b2b)
   * 3.1. [Catálogo de Endpoints e Índices](#31-catálogo-de-endpoints-e-índices)
   * 3.2. [Governança de Quotas, Rate Limit e Tiers](#32-governança-de-quotas-rate-limit-e-tiers)
4. [Pilar 2: InfoAPI Retaguarda (Uso Interno e Background)](#4-pilar-2-infoapi-retaguarda-uso-interno-e-background)
   * 4.1. [Objetivos e Casos de Uso Especializados](#41-objetivos-e-casos-de-uso-especializados)
   * 4.2. [Topologia de Filas e Processamento em Lote](#42-topologia-de-filas-e-processamento-em-lote)
5. [Pilar 3: Integrações Reversas (Outbound Third-Party)](#5-pilar-3-integrações-reversas-outbound-third-party)
   * 5.1. [Conectores Fiscais, Bancários e Logísticos](#51-conectores-fiscais-bancários-e-logísticos)
   * 5.2. [Políticas de Resiliência: Circuit Breaker, Retries e DLQ](#52-políticas-de-resiliência-circuit-breaker-retries-e-dlq)
6. [Segurança, Autenticação e Multi-Tenancy](#6-segurança-autenticação-e-multi-tenancy)
7. [Observabilidade, Métricas e Portal do Desenvolvedor](#7-observabilidade-métricas-e-portal-do-desenvolvedor)
8. [Roadmap Técnico & Considerações Finais](#8-roadmap-técnico--considerações-finais)

---

<div style="page-break-after: always;"></div>

<!-- =========================================================================
     CORPO DO DOCUMENTO (SEÇÕES TÉCNICAS E DIAGRAMAS)
     ========================================================================= -->

## 1. Visão Geral & Objetivos Estratégicos

*(Inserir texto descritivo: motivação de negócio, evolução de monólito para barramento orientado a APIs, contexto da stack Node.js + Firebird e redução de gargalos de I/O).*

---

## 2. Macroarquitetura do Ecossistema InfoBrasil

O ecossistema é dividido em três fluxos distintos de dados:
* **Inbound B2B (InfoAPI Externa):** Clientes integradores consultando o ERP.
* **Internal Barramento (InfoAPI Retaguarda):** Sincronizações internas e jobs operacionais sem expor limites públicos.
* **Outbound Reversa:** O ERP/API consumindo serviços de terceiros (SEFAZ, Bancos, Logística).

```mermaid
flowchart TB
    subgraph EXTERNAL_CLIENTS["1. Integradores Externos (Inbound B2B)"]
        CLI_A["Oliveira Homecenter (Profissional)"]
        CLI_B["Rihomo (Free / Pro)"]
        CLI_C["Cortex / Parceiros"]
    end

    subgraph GATEWAY_TIER["2. Camada Gateway & Segurança (Node.js)"]
        GW["API Gateway InfoAPI"]
        RL["Rate Limiter (Token Bucket / Redis)"]
        AUTH["Auth & Tier Validator (Free / Pro / Ent)"]
        LOGS["Async Log Processor (Métricas & Dossiê)"]
    end

    subgraph RETAGUARDA_TIER["3. InfoAPI Retaguarda (Uso Interno)"]
        RET_GW["Retaguarda Internal API"]
        QUEUE["Fila de Tarefas / Bulk Jobs"]
        ABC_CALC["Processador Curva ABC / Relatórios L2"]
    end

    subgraph DATA_TIER["4. Banco de Dados Multi-Tenant (Firebird)"]
        FB_ROUTER["Tenant Dynamic Router"]
        DB_OLIVEIRA[("dbdepoliveira")]
        DB_LIVERTEC[("dblivertec")]
        DB_BEZERRA[("dbbezerra")]
    end

    subgraph THIRD_PARTY["5. APIs de Terceiros (Consumo Reverso Outbound)"]
        SEFAZ["SEFAZ / NF-e / NFC-e"]
        BANCO["Gateways Pagamento / PIX"]
        LOGISTICA["Transportadoras / Fretes"]
    end

    %% Inbound Flow
    EXTERNAL_CLIENTS -->|HTTPS / REST| GW
    GW --> AUTH
    AUTH --> RL
    RL -->|Válido| FB_ROUTER
    RL -.->|Excedido: HTTP 429| EXTERNAL_CLIENTS
    GW -.->|Eventos de Log| LOGS

    %% Tenant Routing
    FB_ROUTER --> DB_OLIVEIRA
    FB_ROUTER --> DB_LIVERTEC
    FB_ROUTER --> DB_BEZERRA

    %% Retaguarda Flow
    RET_GW --> QUEUE
    QUEUE --> ABC_CALC
    ABC_CALC --> FB_ROUTER

    %% Outbound Flow
    FB_ROUTER -.->|Gatilhos de Evento| GW
    GW -->|Outbound REST| THIRD_PARTY
```

---

## 3. Pilar 1: InfoAPI Corporativa (Inbound B2B)

*(Inserir introdução detalhando a comunicação pública, padrões de payload JSON, convenções REST e cabeçalhos).*

### 3.1. Catálogo de Endpoints e Índices

```mermaid
classDiagram
    class OrdersController {
        +GET /api/v1/orders
        +GET /api/v1/orders/:id
        -validaDateRange()
        -validaPageSize()
    }
    class DeliveriesController {
        +GET /api/v1/deliveries
        +GET /api/v1/deliveries/:id
    }
    class ReceivablesController {
        +GET /api/v1/account-receivable
    }
    class FirebirdDatabase {
        +IDX_VENDAS_PAGINACAO (ven_data, ven_numero)
        +IDX_ROMANEIO_STATUS (status, data)
        +executePaginatedQuery()
    }

    OrdersController --> FirebirdDatabase : Consulta Paginada (ROWS / OFFSET)
    DeliveriesController --> FirebirdDatabase : Filtro Status Logístico
    ReceivablesController --> FirebirdDatabase : Filtro Situação Financeira
```

*(Preencher miolo com tabela de rotas detalhadas, payloads e regras de paginação).*

### 3.2. Governança de Quotas, Rate Limit e Tiers

*(Preencher miolo com detalhamento técnico dos limites por plano, políticas de burst e status code HTTP 429).*

---

## 4. Pilar 2: InfoAPI Retaguarda (Uso Interno e Background)

### 4.1. Objetivos e Casos de Uso Especializados

*(Inserir texto descritivo justificando o porquê da criação da InfoAPI Retaguarda: isolamento de tráfego de retaguarda, tarefas pesadas de fechamento de caixa, Curva ABC, consolidação de dados).*

### 4.2. Topologia de Filas e Processamento em Lote

```mermaid
sequenceDiagram
    autonumber
    actor ERP as ERP / Retaguarda Desktop
    participant RetAPI as InfoAPI Retaguarda
    participant Queue as Fila de Processamento (Jobs)
    participant Worker as Background Worker Node.js
    participant DB as Firebird Tenant

    ERP->>RetAPI: POST /internal/v1/reports/abc-curve (Solicita L2.5.2)
    RetAPI->>Queue: Enfileira Job (#ABC-2026)
    RetAPI-->>ERP: HTTP 202 Accepted { jobId: "ABC-2026" }
    
    Note over Worker,Queue: Execução desacoplada sem travar o Gateway
    Queue->>Worker: Consome Job #ABC-2026
    Worker->>DB: Processa agregações com cursores controlados
    DB-->>Worker: Retorna consolidado
    Worker->>DB: Grava tabela cacheada / resultado
    Worker-->>Queue: Marca Job como concluído
    
    ERP->>RetAPI: GET /internal/v1/reports/abc-curve/status/ABC-2026
    RetAPI-->>ERP: HTTP 200 OK (Pronto / Download)
```

---

## 5. Pilar 3: Integrações Reversas (Outbound Third-Party)

### 5.1. Conectores Fiscais, Bancários e Logísticos

*(Inserir descrição do pipeline de saída, quando a InfoBrasil atua como cliente consumindo serviços externos).*

### 5.2. Políticas de Resiliência: Circuit Breaker, Retries e DLQ

```mermaid
stateDiagram-v2
    [*] --> Closed: Operação Normal

    Closed --> Open: Falhas consecutivas > Limiar (5xx / Timeouts)
    note right of Open: Rejeita requisições imediatamente\nEvita reter conexões locais

    Open --> HalfOpen: Timeout expirado (ex: 30s)
    
    HalfOpen --> Closed: Chamada de teste bem-sucedida
    HalfOpen --> Open: Falha na chamada de teste
```

```mermaid
flowchart LR
    A[Disparo Outbound] --> B{API Externa OK?}
    B -- Sim --> C[Conclui Transação]
    B -- Não --> D[Retry com Backoff Exponencial]
    D --> E{Esgotou 3 Tentativas?}
    E -- Não --> B
    E -- Sim --> F[Roteia para Dead Letter Queue - DLQ]
    F --> G[Alerta Painel Admin / Tíquete Suporte]
```

---

## 6. Segurança, Autenticação e Multi-Tenancy

*(Preencher miolo com modelo de API Keys, cabeçalhos de autenticação, rotação de chaves e conexão dinâmica por tenant).*

---

## 7. Observabilidade, Métricas e Portal do Desenvolvedor

*(Preencher miolo detalhando o Log Processor, exportação do Dossiê em PDF, painel administrativo e a aba de Solicitações/Tíquetes).*

---

## 8. Roadmap Técnico & Considerações Finais

*(Preencher miolo com itens futuros: OpenAPI/Swagger interativo, implementação de Webhooks para clientes pagantes, cache Redis para rotas de clientes).*

---

<div style="page-break-after: always;"></div>

<!-- =========================================================================
     CONTRACAPA FINAL
     ========================================================================= -->

<div align="center">
  <br /><br /><br /><br />
  <h3 style="color: #059669; font-size: 16px; letter-spacing: 1.5px; text-transform: uppercase;">
    INFOBRASIL SISTEMAS
  </h3>
  <p style="font-size: 13px; color: #64748b;">
    Inovação em Gestão e Infraestrutura de APIs Corporativas
  </p>
  <br />
  <p style="font-size: 11px; color: #94a3b8; max-width: 480px; line-height: 1.6;">
    Este documento é propriedade da InfoBrasil Sistemas. As informações técnicas contidas neste manual são restritas ao time de Engenharia e integradores devidamente autorizados sob termo de confidencialidade (NDA).
  </p>
  <br />
  <p style="font-size: 12px; font-weight: 600; color: #475569;">
    Fortaleza — CE • 2026
  </p>
</div>