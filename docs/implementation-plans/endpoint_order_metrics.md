# Implementação do Endpoint Order Metrics (GET /orders/order-metrics)

Este plano descreve a criação do endpoint exclusivo de métricas de pedidos (`GET /api/v1/orders/order-metrics`), retornando os 4 indicadores consolidados para o dashboard: **Pedidos no Mês/Período**, **Faturamento (R$)**, **Ticket Médio (R$)** e **Pedidos em Aberto**.

## Resumo das Regras de Negócio e Arquitetura

- **Fonte de Dados:** Tabela `VENDAS` no banco de dados Firebird do cliente (`TenantConnectionService`).
- **Agregação em Passada Única (Single-pass Scan):**
  - Uma única query SQL executada via `CASE WHEN` para eliminar múltiplos scans e round-trips de rede.
- **Tratamento de Datas:**
  - A coluna `VEN_DATA` é do tipo `DATE` no Firebird.
  - O filtro recebe `startDate` e `endDate` sanitizados no formato `YYYY-MM-DD`.
- **Mapeamento de Situações (`SIT_CODIGO`):**
  - **Pedidos Concluídos / Faturados:** `SIT_CODIGO = 2` (BAIXADA) -> alimenta `totalOrders` e `billing`.
  - **Pedidos em Aberto:** `SIT_CODIGO IN (1, 4)` (1 = PENDENTE, 4 = APROVADA) -> alimenta `openOrders`.
  - **Pedidos Descartados:** `3` (CANCELADA) e `5` (REPROVADA) não entram nas métricas.
- **Ticket Médio (`averageTicket`):**
  - Calculado na camada de serviço (TypeScript) com fallback seguro para `0` em caso de zero pedidos faturados.
- **Permissão RBAC:**
  - `tenant.orders.view`

## Proposed Changes

### 1. DTOs (`src/modules/order/dto/`)

#### [NEW] `get-order-metrics-query.dto.ts`
- Schema Zod `GetOrderMetricsQuerySchema` validando:
  - `startDate`: string obrigatória no formato `YYYY-MM-DD`.
  - `endDate`: string obrigatória no formato `YYYY-MM-DD`.
  - `storeId`: número inteiro opcional.
  - Refinement garantindo que `startDate <= endDate`.
- Classe `GetOrderMetricsQueryDto` decorada com `@ApiProperty` / `@ApiPropertyOptional`.

#### [NEW] `order-metrics-response.dto.ts`
- Classe `OrderMetricsResponseDto` com as propriedades:
  - `totalOrders`: número de pedidos baixados no período.
  - `billing`: faturamento total líquido no período (duas casas decimais).
  - `averageTicket`: ticket médio no período (duas casas decimais).
  - `openOrders`: pedidos em aberto (pendentes ou aprovados) no período.

---

### 2. Módulo Order (`src/modules/order/`)

#### [MODIFY] `order.service.ts`
- Implementar o método `getOrderMetrics(credentialsId: string, storeId?: number, filters: { startDate: string; endDate: string })`:
  - Obtém conexão com o Firebird via `tenantConnectionService.getConnection(credentialsId)`.
  - Constrói a query agregada com `CASE WHEN`:
    ```sql
    SELECT
      COUNT(CASE WHEN V.SIT_CODIGO = 2 THEN 1 END) AS TOTAL_ORDERS,
      COALESCE(SUM(CASE WHEN V.SIT_CODIGO = 2 THEN V.VEN_TOTALLIQUIDO ELSE 0 END), 0) AS BILLING,
      COUNT(CASE WHEN V.SIT_CODIGO IN (1, 4) THEN 1 END) AS OPEN_ORDERS
    FROM VENDAS V
    WHERE 1=1 [AND V.LOJ_CODIGO = ?]
      AND V.VEN_DATA BETWEEN ? AND ?
    ```
  - Mapeia defensivamente os campos de retorno (evitando `null`, `undefined` e lidando com caixas alta/baixa).
  - Calcula `averageTicket`.
  - Garante liberação da conexão no bloco `finally`.

#### [MODIFY] `order.controller.ts`
- Adicionar o endpoint `@Get('order-metrics')`:
  - Decorator `@SkipDateRangeLimit()`: isenta o endpoint do teto `maxDateRangeDays` do plano comercial, mantendo controle de rate limit e logging.
  - Guards: `JwtAuthGuard`, `PermissionsGuard`.
  - Permissão: `@RequirePermissions({ allOf: ['tenant.orders.view'] })`.
  - Extrai `credentialsId` e resolve `storeId` (respeitando token H2M vs query `storeId`).
  - Delega para `orderService.getOrderMetrics`.
  - Documentação OpenAPI com `@ApiOperation` e `@ApiResponse({ type: OrderMetricsResponseDto })`.

---

### 3. Governança de Limite de Plano (`src/modules/plan/`)

#### [NEW] `skip-date-range-limit.decorator.ts`
- Decorator `@SkipDateRangeLimit()` que atribui o metadado `skipDateRangeLimit = true` via `SetMetadata`.

#### [MODIFY] `plan-limit.interceptor.ts`
- Injeção de `Reflector` do NestJS.
- Checagem de `skipDateRangeLimit`: se ativado para o handler ou controller, pula a validação de `maxDateRangeDays`.

---

### 4. Testes Unitários

#### [NEW] `get-order-metrics-query.dto.spec.ts`
- Validação de datas válidas, ausência de parâmetros obrigatórios e `startDate > endDate`.

#### [MODIFY] `order.service.spec.ts`
- Testes para `getOrderMetrics`:
  - Retorno com valores normais e cálculo de ticket médio.
  - Retorno com zero pedidos e ticket médio igual a 0.
  - Tratamento com e sem `storeId`.
  - Falha na query do banco e liberação de conexão.

#### [MODIFY] `order.controller.spec.ts`
- Teste para chamada do endpoint `getOrderMetrics` passando `req` e query DTO.

## Verification Plan

### Automated Tests
- Executar testes unitários do módulo de pedidos:
  ```bash
  npm run test -- src/modules/order
  ```
- Executar linter para garantir conformidade de código:
  ```bash
  npm run lint
  ```
