# Plano Arquitetural: Módulo de Webhooks Multi-Domínio com Processamento Isolado

## 1. Visão Geral e Contexto de Negócio

Este documento estabelece o design e a arquitetura técnica para o módulo de **Webhooks** da `info-api`. 

A motivação central é mitigar incidentes de indisponibilidade causados por integradores externos (ex: automações no **n8n**, ERPs na nuvem, e-commerces) executando polling síncrono massivo com `pageSize=500` em intervalos curtos. A transição de um modelo puramente *Pull-based* para um modelo *Push-based (Event-Driven)* transfere o controle de cadência e volume para a API, reduzindo dramaticamente a alocação de memória no Node.js e a pressão de I/O sobre os 1.000 bancos legados Firebird.

### Diretrizes Inegociáveis
1. **Zero Impacto no Legado:** Nenhuma alteração de schema, trigger ou código em qualquer um dos 1.000 bancos Firebird heterogêneos.
2. **Abordagem Híbrida (Summary Payload):** Eventos carregam os dados de negócio essenciais (IDs, status, totais, entidades-chave) e links de detalhamento, poupando o integrador de chamadas HTTP adicionais no n8n sem trafegar árvores pesadas de joins fiscais.
3. **Escopo Expandido (5 Domínios):**
   - **Pedidos:** `order.created`, `order.updated`
   - **Produtos:** `product.created`, `product.updated`
   - **Entregas:** `delivery.created`, `delivery.updated`
   - **Contas a Pagar:** `account_payable.created`, `account_payable.updated`
   - **Contas a Receber:** `account_receivable.created`, `account_receivable.updated`
4. **Isolamento Estrito de Processos:** O mecanismo de detecção (Polling) e despacho HTTP rodará em um **Worker dedicado (`infoapi-worker`)**, 100% desacoplado da API HTTP pública (`infoapi-blue` / `infoapi-green`), garantindo imunidade total contra *outbound socket exhaustion* ou lentidão de terceiros.
5. **Regra de Negócio (1:1):** Cada `User` (tenant) terá direito a **estritamente uma inscrição de webhook ativa** (`1:1`).
6. **Segurança por Assinatura (HMAC-SHA256):** Chave secreta única (`whsec_...`) gerada para o cliente validar a autenticidade das requisições via cabeçalho `X-Info-Signature`.

---

## 2. Topologia de Processos e Isolamento (Architecture Topology)

Para neutralizar o risco de "troca de um gargalo por outro" (onde requisições lentas de saída travariam o Event Loop da API de entrada), a arquitetura separa claramente os papéis em contêineres e processos distintos:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                      INTERNET                           │
                  └──────────────┬────────────────────────────▲─────────────┘
                                 │ Requisições Inbound        │ Disparos Outbound
                                 ▼                            │ (Timeout 3s)
┌──────────────────────────────────────────────────┐          │
│ Nginx Gateway (api-gateway)                      │          │
└────────┬─────────────────────────────────────────┘          │
         │ Proxy HTTP                                         │
         ▼                                                    │
┌──────────────────────────────────────────────────┐          │
│ 1. API Service (infoapi-blue / infoapi-green)    │          │
│    - Roteamento HTTP público (Express/NestJS)    │          │
│    - Autenticação e Gestão de Webhooks           │          │
│    - Endpoints de Negócio e Consulta             │          │
└────────┬─────────────────────────────────────────┘          │
         │ Grava Inscrições & Logs                            │
         ▼                                                    │
┌──────────────────────────────────────────────────┐          │
│ PostgreSQL Central (infoapi-db)                  │          │
│  - webhook_subscriptions                         │          │
│  - webhook_deliveries (Queue / Outbox)           │          │
└────────▲─────────────────────────────────────────┘          │
         │ Leitura de Inscrições & Fila                       │
         ▼                                                    │
┌──────────────────────────────────────────────────┐          │
│ 2. Worker Service Dedicado (infoapi-worker)      │          │
│    A. Poller Loop (Subscriber-Driven):           │          │
│       - Conecta APENAS aos Firebirds com         │          │
│         inscrições ativas                        │          │
│       - Query de delta indexada por cursor       │          │
│       - Enfileira em webhook_deliveries (PENDING)│          │
│    B. Dispatcher Loop:                           │          │
│       - Consome entregas PENDING                 │          │
│       - Assina HMAC-SHA256                       │          │
│       - Executa POST HTTP com pool isolado ──────┼──────────┘
│       - Aplica Exponential Backoff & DLQ         │
└──────────────────────────────────────────────────┘
```

---

## 3. Modelagem Relacional no PostgreSQL (Prisma Schema)

### 3.1. Tabela de Inscrições (`webhook_subscriptions`)

```prisma
model WebhookSubscription {
  id                        String         @id @default(uuid())
  userId                    String         @unique @map("user_id")
  targetUrl                 String         @map("target_url") @db.VarChar(500)
  secretKey                 String         @map("secret_key") @db.VarChar(128)
  isActive                  Boolean        @default(true) @map("is_active")
  
  // Lista de eventos ativos (ex: ["order.created", "delivery.updated", "account_payable.created"])
  events                    String[]       @default(["order.created", "product.created"])
  
  // High-Water Marks (Cursores sequenciais no Firebird deste tenant)
  lastOrderId               Int            @default(0) @map("last_order_id")
  lastOrderSyncAt           DateTime       @default(now()) @map("last_order_sync_at")
  
  lastProductId             Int            @default(0) @map("last_product_id")
  lastProductSyncAt         DateTime       @default(now()) @map("last_product_sync_at")
  
  lastDeliveryId            Int            @default(0) @map("last_delivery_id")
  lastDeliverySyncAt        DateTime       @default(now()) @map("last_delivery_sync_at")
  
  lastAccountPayableId      Int            @default(0) @map("last_account_payable_id")
  lastAccountPayableSyncAt  DateTime       @default(now()) @map("last_account_payable_sync_at")
  
  lastAccountReceivableId   Int            @default(0) @map("last_account_receivable_id")
  lastAccountReceivableSyncAt DateTime     @default(now()) @map("last_account_receivable_sync_at")

  createdAt                 DateTime       @default(now()) @map("created_at")
  updatedAt                 DateTime       @updatedAt @map("updated_at")

  user                      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  deliveries                WebhookDelivery[]

  @@map("webhook_subscriptions")
}
```

### 3.2. Tabela de Fila e Entregas (`webhook_deliveries`)

```prisma
enum WebhookDeliveryStatus {
  PENDING
  PROCESSING
  SUCCESS
  FAILED
}

model WebhookDelivery {
  id             String                @id @default(uuid())
  subscriptionId String                @map("subscription_id")
  event          String                @db.VarChar(50)
  payload        Json
  status         WebhookDeliveryStatus @default(PENDING)
  responseStatus Int?                  @map("response_status")
  responseBody   String?               @map("response_body") @db.Text
  durationMs     Float?                @map("duration_ms")
  attempts       Int                   @default(0)
  nextRetryAt    DateTime?             @map("next_retry_at")
  lastError      String?               @map("last_error") @db.Text
  createdAt      DateTime              @default(now()) @map("created_at")
  updatedAt      DateTime              @updatedAt @map("updated_at")

  subscription   WebhookSubscription   @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  @@index([subscriptionId, createdAt])
  @@index([status, nextRetryAt])
  @@map("webhook_deliveries")
}
```

---

## 4. Estrutura dos Payloads Híbridos (Summary Payloads)

### 4.1. Pedidos (`order.created` / `order.updated`)
```json
{
  "id": "evt_01a1da8966f8790cb1026caa9d518fa8",
  "event": "order.created",
  "timestamp": "2026-11-16T17:40:00.000Z",
  "tenant": "oliveirahomecenter",
  "data": {
    "orderId": 296782,
    "storeId": 1,
    "status": "APPROVED",
    "totalValue": 1450.50,
    "clientId": 4755,
    "clientName": "Maria Silva",
    "itemsCount": 2,
    "links": { "self": "/api/v1/orders/296782" }
  }
}
```

### 4.2. Produtos (`product.created` / `product.updated`)
```json
{
  "id": "evt_b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6",
  "event": "product.updated",
  "timestamp": "2026-11-16T17:40:00.000Z",
  "tenant": "oliveirahomecenter",
  "data": {
    "productId": 5021,
    "code": "PROD-5021",
    "description": "Smart TV 55 4K",
    "price": 2899.90,
    "stock": 14,
    "active": true,
    "links": { "self": "/api/v1/products/id/5021" }
  }
}
```

### 4.3. Entregas (`delivery.created` / `delivery.updated`)
```json
{
  "id": "evt_d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
  "event": "delivery.updated",
  "timestamp": "2026-11-16T17:40:00.000Z",
  "tenant": "oliveirahomecenter",
  "data": {
    "deliveryId": 8421,
    "orderId": 296782,
    "storeId": 1,
    "status": 11,
    "statusDescription": "EM ROTA",
    "driverId": 42,
    "updatedAt": "2026-11-16T17:39:10.000Z",
    "links": { "self": "/api/v1/deliveries/8421" }
  }
}
```

### 4.4. Contas a Pagar (`account_payable.created` / `account_payable.updated`)
```json
{
  "id": "evt_e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
  "event": "account_payable.created",
  "timestamp": "2026-11-16T17:40:00.000Z",
  "tenant": "oliveirahomecenter",
  "data": {
    "payableId": 15092,
    "storeId": 1,
    "supplierId": 320,
    "supplierName": "Distribuidora Nacional LTDA",
    "documentNumber": "NF-9842",
    "value": 4500.00,
    "dueDate": "2026-11-30",
    "situation": "A",
    "links": { "self": "/api/v1/account-payable/15092" }
  }
}
```

### 4.5. Contas a Receber (`account_receivable.created` / `account_receivable.updated`)
```json
{
  "id": "evt_f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5",
  "event": "account_receivable.created",
  "timestamp": "2026-11-16T17:40:00.000Z",
  "tenant": "oliveirahomecenter",
  "data": {
    "receivableId": 98432,
    "storeId": 1,
    "clientId": 4755,
    "clientName": "Maria Silva",
    "value": 1450.50,
    "dueDate": "2026-12-15",
    "situation": "A",
    "orderId": 296782,
    "links": { "self": "/api/v1/account-receivable/98432" }
  }
}
```

---

## 5. Engenharia do Worker Dedicado (`infoapi-worker`)

O worker operará como um processo Node.js independente (ou container Docker paralelo), compartilhando a base de dados do Prisma e a camada de repositório, mas sem abrir portas HTTP públicas.

### 5.1. Ciclo do Poller (Detecção de Mudanças)
1. **Cadência:** Loop executado a cada 15 segundos.
2. **Query de Assinantes:** `SELECT * FROM webhook_subscriptions WHERE is_active = true`.
   *Se apenas 20 lojas têm webhook configurado, apenas 20 conexões de banco são abertas.*
3. **Busca Sequencial no Firebird (Exemplo Contas a Pagar):**
   ```sql
   SELECT FIRST 50 PAG_CODIGO, PAG_VALOR, PAG_VENCIMENTO, PAG_SITUACAO, FOR_CODIGO, LOJ_CODIGO
   FROM CONTAS_PAGAR
   WHERE PAG_CODIGO > :lastAccountPayableId
   ORDER BY PAG_CODIGO ASC
   ```
4. **Enfileiramento Atômico:** Grava as entregas no PostgreSQL como `PENDING` e atualiza o cursor `lastAccountPayableId` na mesma transação.

### 5.2. Ciclo do Dispatcher (Despacho HTTP) & Circuit Breaker
1. **Consumo em Lote:** `SELECT * FROM webhook_deliveries WHERE status = 'PENDING' OR (status = 'FAILED' AND next_retry_at <= NOW()) ORDER BY id ASC LIMIT 25`.
2. **Assinatura Criptográfica HMAC-SHA256:**
   * Cabeçalho: `X-Info-Signature: t={timestamp},v1={hash_sha256}`.
3. **Timeout Estrito:** 3.000 ms por chamada (via `fetch` nativo com `AbortController`).
4. **Proteção Anti-SSRF em Runtime (DNS Resolution):**
   * Antes de cada disparo HTTP, o worker valida se o hostname não é literal IP, não é `localhost`, não pertence ao domínio raiz `infobrasil` e resolve o DNS checando se os IPs pertencem a faixas públicas (bloqueia faixas RFC 1918, Loopback e Link-local para mitigar DNS Rebinding).
5. **Política de Retry (Exponential Backoff):**
   - Tentativa 1: Imediata
   - Tentativa 2: após 2 minutos
   - Tentativa 3: após 10 minutos
   - Tentativa 4: após 30 minutos (após a 4ª falha, marca como `FAILED` definitivo).
6. **Circuit Breaker Automático por Eventos Distintos:**
   - Cada evento distinto que falha definitivamente (esgota as 4 tentativas) incrementa `consecutive_failures`.
   - Se o webhook acumular **5 eventos consecutivos distintos com falha**, a inscrição é pausada compulsoriamente (`is_paused = true`, `is_active = false`, `paused_at = NOW()`, `pause_reason = 'Circuito aberto: 5 eventos consecutivos distintos falharam na entrega.'`).
   - Um **e-mail de alerta** é disparado imediatamente para o e-mail do cliente (`User.email`) via `EmailService` notificando a indisponibilidade do endpoint e instruindo a reativação pelo painel.
   - Caso qualquer entrega intermediária responda com sucesso HTTP 2xx, o contador `consecutive_failures` é zerado imediatamente.

---

## 6. Endpoints de Gestão na API Pública (`/api/v1/webhooks`)

1. `POST /api/v1/webhooks` - Cria a inscrição 1:1 (gera `secretKey` `whsec_...`, valida URL anti-SSRF e verifica se o usuário possui as permissões GET correspondentes a cada evento solicitado).
2. `GET /api/v1/webhooks/me` - Consulta a configuração atual, o status do Circuit Breaker (`isPaused`, `consecutiveFailures`) e o segredo HMAC para exibição no front.
3. `PUT /api/v1/webhooks/me` - Atualiza a URL ou lista de eventos assinados (revalida permissões GET e anti-SSRF).
4. `POST /api/v1/webhooks/me/rotate-secret` - Rotaciona a chave secreta HMAC.
5. `POST /api/v1/webhooks/me/unpause` - Permite ao próprio cliente reativar os disparos após corrigir o endpoint, zerando `consecutiveFailures` e reabrindo o fluxo.
6. `GET /api/v1/webhooks/me/deliveries` - Retorna as últimas 50 tentativas para depuração do cliente (status, duração, payload).
7. `POST /api/v1/webhooks/me/deliveries/:id/resend` - Reenvio manual sob demanda.
8. `POST /api/v1/webhooks/me/test` - Dispara teste imediato (`test.ping`) com assinatura HMAC para o cliente testar sua infraestrutura em tempo real.
9. `DELETE /api/v1/webhooks/me` - Remove a inscrição.
10. `GET /api/v1/dashboard/webhooks` - Métricas administrativas de volume e taxa de sucesso nas últimas 24h/7d.

---

## 7. Governança e Segurança em Camadas

1. **Herança Estrita de Permissões GET (Menor Privilégio):**
   * Os eventos disponíveis para assinatura são condicionados às permissões de visualização do usuário:
     - `order.*` -> `tenant.orders.view`
     - `product.*` -> `tenant.products.view`
     - `delivery.*` -> `tenant.deliveries.view`
     - `account_payable.*` -> `tenant.account-payable.view`
     - `account_receivable.*` -> `tenant.account-receivable.view`
   * **Mitigação de TOCTOU (Time-of-Check to Time-of-Use):** O worker revalida o snapshot de permissões (`PermissionResolver.resolve`) a cada ciclo de polling antes de ler os bancos legados Firebird, garantindo que usuários que tiveram permissões revogadas não recebam eventos.
2. **Blindagem Anti-SSRF em Duas Camadas:**
   * **Camada 1 (Sintática - DTO/Zod):** Protocolo HTTPS obrigatório, proibição de IPs literais (IPv4/IPv6), proibição de `localhost`/`.local`/`.internal` e bloqueio do domínio raiz `infobrasil`.
   * **Camada 2 (Semântica - DNS Resolution):** O Worker e o serviço de teste resolvem o hostname e rejeitam ativamente faixas privadas RFC 1918, Loopback e Link-local antes de abrir conexão TCP.
