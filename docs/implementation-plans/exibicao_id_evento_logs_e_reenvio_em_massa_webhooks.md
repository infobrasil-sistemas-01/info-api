# Plano de Implementação: Exibição do ID do Evento nos Logs, Paginação, Reenvio em Massa e Toggle do Webhook

## Goal Description

Aprimorar o módulo de Webhooks e o Portal do Cliente (`#webhook-deliveries-table` e `#tab-webhooks` em `client.html`) para:
1. **Exibir o ID do Evento (`payload.id`) nos logs:** Mostrar exclusivamente o `payload.id` (ex: `evt_ord_...`, `evt_prd_...`) na tabela de entregas do portal com botão de cópia rápida, e incluí-lo nas mensagens de log do `WebhookWorkerService` (`eventId=...`).
2. **Paginação de Entregas (25/página):** Adicionar paginação no endpoint `GET /api/v1/webhooks/me/deliveries` (`page` e `limit`, padrão 25/página) e controles de paginação no rodapé da tabela no mesmo padrão visual do Dashboard do Admin (`Página X de Y (Total: Z)` com botões `Anterior` e `Próxima`).
3. **Seletor e Reenvio em Massa (apenas `FAILED`/`PENDING` / status != 2XX):** Permitir selecionar entregas elegíveis (`status !== 'SUCCESS'` e `responseStatus` fora de 200–299) via checkboxes individuais e mestre, com barra contextual de reenvio em massa (`POST /api/v1/webhooks/me/deliveries/bulk-resend`) e **reativação automática** caso a assinatura esteja pausada pelo Circuit Breaker.
4. **Toggle livre para Ativar/Desativar o Webhook:** Permitir ao usuário ativar e desativar os disparos de seu Webhook livremente pelo Portal do Cliente (persistindo `isActive` via `PUT /api/v1/webhooks/me`).

---

## User Review Required

> [!IMPORTANT]
> **Regras acordadas na revisão:**
> - **Identificador exibido:** Apenas `payload.id` (`evt_...`) será exibido na coluna **ID do Evento** (com botão de cópia).
> - **Elegibilidade para reenvio:** Tanto no seletor em massa quanto no backend (`resendDelivery` e `bulkResendDeliveries`), apenas entregas **não-2XX** (`status IN ('FAILED', 'PENDING')` / `responseStatus` fora de `200..299`) poderão ser reenviadas.
> - **Circuit Breaker:** Ao solicitar reenvio (em massa ou individual), se a assinatura estiver pausada (`isPaused = true`), ela será **reativada automaticamente** (`isPaused: false`, `isActive: true`, `consecutiveFailures: 0`, `pausedAt: null`, `pauseReason: null`) após validação anti-SSRF da `targetUrl`.
> - **Paginação:** Padrão de **25 registros por página**, utilizando o formato `{ data, meta: { total, page, limit, totalPages } }` quando `page` for informado (mantendo compatibilidade caso `page` seja omitido).
> - **Toggle de Ativação:** Switch interativo no cabeçalho/formulário da aba de Webhooks que altera `isActive` imediatamente (quando já configurado) e também é respeitado no `Salvar Configuração` (substituindo o valor fixo `isActive: true`).

---

## Proposed Changes

### Backend — Módulo Webhook

#### [NEW] `src/modules/webhook/dto/bulk-resend-deliveries.dto.ts`
Criar DTO com `ZodDto` validando o array de UUIDs a serem reenviados:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const BulkResendDeliveriesSchema = z.object({
  deliveryIds: z
    .array(z.string().uuid('Cada ID de entrega deve ser um UUID válido'))
    .min(1, 'Selecione ao menos uma entrega para reenviar')
    .max(100, 'Limite máximo de 100 entregas por requisição de reenvio em massa'),
});

export class BulkResendDeliveriesDto extends ZodDto(BulkResendDeliveriesSchema) {
  @ApiProperty({
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Lista de IDs (UUID) das entregas de webhook a serem reenfileiradas',
  })
  deliveryIds!: string[];
}
```

#### [MODIFY] `src/modules/webhook/webhook.controller.ts`
1. Atualizar `GET /webhooks/me/deliveries` para aceitar `@Query('page') page?: string` e `@Query('limit') limit?: string` (padrão `limit = 25` quando paginado):

```typescript
  @Get('me/deliveries')
  @ApiOperation({
    summary: 'Lista o histórico recente de entregas/tentativas de Webhook',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número da página (quando informado, retorna objeto paginado { data, meta })',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 25,
    description: 'Quantidade de registros por página (máximo 100)',
  })
  getDeliveries(
    @CurrentUser() user: JwtPayload,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : (page ? 25 : 50);
    const parsedPage = page ? parseInt(page, 10) : undefined;
    return this.service.getDeliveries(user.sub, parsedLimit, parsedPage);
  }
```

2. Adicionar endpoint `POST /webhooks/me/deliveries/bulk-resend`:

```typescript
  @Post('me/deliveries/bulk-resend')
  @ApiOperation({
    summary: 'Reenfileira múltiplas entregas (FAILED/PENDING) em lote para reenvio imediato',
  })
  bulkResendDeliveries(
    @CurrentUser() user: JwtPayload,
    @Body() dto: BulkResendDeliveriesDto,
  ) {
    return this.service.bulkResendDeliveries(user.sub, dto.deliveryIds);
  }
```

#### [MODIFY] `src/modules/webhook/webhook.service.ts`
1. Atualizar `getDeliveries(userId: string, limit = 50, page?: number)`:
   - Se `page` for informado (`page >= 1`), executar `findMany` com `skip: (safePage - 1) * safeLimit`, `take: safeLimit` e `count` em paralelo, retornando `{ data, meta: { total, page: safePage, limit: safeLimit, totalPages: Math.ceil(total / safeLimit) || 1 } }`.
   - Se `page` não for informado, manter o retorno em array simples para retrocompatibilidade.
2. Atualizar `update(userId: string, dto: UpdateWebhookDto)`:
   - Se `dto.isActive === true` e `subscription.isPaused === true`, validar `await assertPublicWebhookUrl(dto.targetUrl ?? subscription.targetUrl)` e resetar `isPaused: false`, `consecutiveFailures: 0`, `pausedAt: null`, `pauseReason: null`.
3. Atualizar `resendDelivery` e criar `bulkResendDeliveries`:
   - Filtrar estritamente entregas elegíveis (status diferente de `SUCCESS` e `responseStatus` fora de 200–299: `status: { in: ['FAILED', 'PENDING'] }`, `OR: [{ responseStatus: null }, { responseStatus: { lt: 200 } }, { responseStatus: { gte: 300 } }]`).
   - Se `subscription.isPaused` for `true`, validar `await assertPublicWebhookUrl(subscription.targetUrl)` e **reativar automaticamente** a assinatura dentro de `this.prisma.$transaction(...)` (`isPaused: false, isActive: true, consecutiveFailures: 0, pausedAt: null, pauseReason: null`).
   - Retornar `{ success: true, count, reactivated: subscription.isPaused, message }`.

---

### Worker — Logs de Disparo

#### [MODIFY] `src/worker/webhook-worker.service.ts`
Incluir o `eventId` (`(delivery.payload as any)?.id || 'n/a'`) nos logs do método `processDelivery` (bloqueio Anti-SSRF e falha na entrega) para correlação com o painel:

```typescript
const payload = delivery.payload as any;
const eventId = payload?.id || 'n/a';
```

- `Disparo de webhook ${delivery.id} (eventId=${eventId}) bloqueado por política Anti-SSRF (${sub.targetUrl}): ${ssrfErr.message}`
- `Falha ao entregar webhook ${delivery.id} (${delivery.event}, eventId=${eventId}) para ${sub.targetUrl}. Tentativa ${attempts}/4. Erro: ${lastError}`

---

### Frontend — Portal do Cliente

#### [MODIFY] `src/modules/integration-request/templates/client.html`
1. **Toggle de Ativar/Desativar Webhook**:
   - Adicionar um switch estilizado (`#webhook-active-toggle`) no card de configuração de Webhooks (ao lado do badge de status ou no topo do formulário).
   - Ao alterar o switch quando já houver assinatura salva (`window.currentWebhookSubscription`), disparar `PUT /api/v1/webhooks/me` com `{ isActive: toggle.checked }` (com estado de loading e rollback visual em caso de erro) e atualizar o badge `ATIVO` / `INATIVO`.
   - Em `saveWebhookConfig`, enviar `isActive: document.getElementById('webhook-active-toggle')?.checked ?? true` em vez de `true` fixo.
2. **Barra de Ações em Massa** acima da tabela `#webhook-deliveries-table` (exibida quando houver itens selecionados):
   - Contador `<span id="webhook-bulk-count">0 selecionado(s)</span>`.
   - Botão **Reenviar Selecionados** (`onclick="bulkResendWebhookDeliveries()"`).
   - Botão **Limpar seleção** (`onclick="clearWebhookDeliverySelection()"`).
3. **Cabeçalho da Tabela (`<thead>`)**:
   - Primeira coluna: checkbox mestre `<input type="checkbox" id="webhook-select-all" onchange="toggleAllWebhookDeliveries(this.checked)">`.
   - Nova coluna **`ID do Evento`** logo após **`Evento`**.
   - Atualizar `colspan` da linha vazia para `9`.
4. **Renderização das Linhas (`loadWebhookDeliveries(page = 1)`)**:
   - Manter variável de estado `let currentWebhookDeliveriesPage = 1;` e buscar `GET /api/v1/webhooks/me/deliveries?page=${page}&limit=25`.
   - Definir elegibilidade para reenvio: `const isHttp2xx = d.responseStatus >= 200 && d.responseStatus < 300; const canResend = d.status !== 'SUCCESS' && !isHttp2xx;` (apenas `FAILED`/`PENDING` com status diferente de 2XX).
   - Checkbox individual habilitado apenas se `canResend` (`disabled` quando `SUCCESS`/2XX).
   - Coluna **ID do Evento**: exibe exclusivamente `d.payload?.id || '-'` dentro de `<code>` com botão de cópia rápida (`copyWebhookEventId(eventId, this)`).
   - Ações: botão individual `Reenviar` apenas quando `canResend`.
5. **Paginação no Rodapé da Tabela** (idêntica ao padrão do Admin Dashboard em `admin-components.js`):
   - Container `<div id="webhook-deliveries-pagination">` logo abaixo da tabela:
     - Esquerda: `Página <strong>${meta.page}</strong> de <strong style="color: white;">${meta.totalPages || 1}</strong> (Total: ${meta.total})`
     - Direita: Botões `Anterior` (`onclick="loadWebhookDeliveries(page - 1)"`) e `Próxima` (`onclick="loadWebhookDeliveries(page + 1)"`) com estado `disabled` quando nos limites.
6. **Reenvio em Massa (`bulkResendWebhookDeliveries`)**:
   - Envia `POST /api/v1/webhooks/me/deliveries/bulk-resend` com `{ deliveryIds }`.
   - Caso retorne `reactivated: true`, informar no feedback que o Webhook pausado foi reativado automaticamente, e chamar `await loadWebhookData();` (ou atualizar status + `await loadWebhookDeliveries(currentWebhookDeliveriesPage)`).

---

### Testes Automatizados

#### [MODIFY] `src/modules/webhook/webhook.service.spec.ts`
Adicionar testes unitários para:
- `getDeliveries` com paginação (`page` e `limit`), validando `skip`, `take` e retorno `{ data, meta }`.
- `bulkResendDeliveries`:
  - Reenfileira entregas `FAILED`/`PENDING` (não-2XX) e retorna `count`.
  - Reativa automaticamente assinatura com `isPaused: true` (chamando `assertPublicWebhookUrl` e `webhookSubscription.update`).
  - Lança `NotFoundException` se não houver assinatura ou nenhuma entrega elegível.
- `update` com `isActive: false` e `isActive: true` (incluindo limpeza de `isPaused` ao reativar).

---

## Verification Plan

### Automated Tests
```bash
npx jest src/modules/webhook/webhook.service.spec.ts
npm run build
```

### Manual Verification
1. Acessar o Portal do Cliente (`/integration/client`), aba **Webhooks (Beta)**.
2. Testar o **toggle Ativar/Desativar Webhook** e verificar se o badge alterna entre `ATIVO` e `INATIVO` e persiste após recarregar a página.
3. Na seção **Histórico de Entregas Recentes**, confirmar que a tabela exibe **25 itens por página**, a coluna **ID do Evento** mostra exclusivamente o `payload.id` (`evt_...`) com botão de cópia funcionando e o rodapé exibe `Página X de Y (Total: Z)` com botões `Anterior` / `Próxima`.
4. Confirmar que apenas entregas `FAILED`/`PENDING` (diferente de 2XX) possuem checkbox habilitado para seleção e botão `Reenviar`.
5. Selecionar múltiplas entregas com falha, clicar em **Reenviar Selecionados** e confirmar o reenfileiramento em lote (e a reativação automática caso o Circuit Breaker estivesse ativo).
6. Verificar nos logs do worker a presença de `eventId=...` nos logs de erro/bloqueio.
