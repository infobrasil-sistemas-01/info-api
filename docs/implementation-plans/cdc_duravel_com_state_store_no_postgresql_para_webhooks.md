# Plano de Implementação: CDC Durável com State Store no PostgreSQL para Webhooks

## 1. Visão Geral e Diagnóstico do Problema
Anteriormente, o `WebhookWorkerService` utilizava uma janela de deduplicação em memória (`recentEventKeys: Map<string, number>`) com TTL de 2 horas. 
No banco de dados Firebird dos clientes, campos como `EST_DTALTERACAO` e `PRO_DATAALTERACAO` possuem granularidade de **data (sem hora)**. Ao varrer alterações do dia corrente (`>= todayStr`), o poller reencontra os mesmos produtos alterados no dia.
Assim que as chaves em memória expiravam após 120 minutos, o poller detectava os mesmos registros como "inéditos", gerando disparos periódicos a cada 2 horas para produtos e estoques inalterados.

## 2. Decisão Arquitetural (ADR / Padrão de Engenharia)
Substituir a memória volátil com TTL por um **State Store Durável no PostgreSQL** (`WebhookEntityState`).
- **Não-intrusivo:** Zero alterações, DDLs ou triggers no Firebird legado dos clientes.
- **Atemporal e Determinístico:** Um estado tem hash invariante; a chave não expira por tempo. O webhook só é gerado quando o hash muda de fato ($H_{novo} \neq H_{anterior}$).
- **Escalabilidade em Lote:** Verificação de até 25 registros por consulta única com operador `IN` e `upsert` transacional apenas para estados modificados.
- **Unificação:** Aplicado para todos os domínios de webhook: `product`, `order`, `delivery`, `account_payable`, `account_receivable`.

## 3. Etapas de Execução

### Fase 1: Schema Prisma e Migration
- Adicionar modelo `WebhookEntityState` ao `prisma/schema.prisma`.
- Executar `npx prisma migrate dev --name add_webhook_entity_state`.
- Gerar o Prisma Client (`src/generated/prisma`).

### Fase 2: Implementação do State Store no Worker
- No `src/worker/webhook-worker.service.ts`:
  - Implementar método auxiliar `filterModifiedEntities(tenantId, entityType, items: Array<{ id: string, hash: string }>)`.
  - Implementar método auxiliar `persistEntityStates(tenantId, entityType, items: Array<{ id: string, hash: string }>)`.
  - Remover `recentEventKeys` e o método `warmupIdempotencyKeys()`.
  - Integrar a checagem durável em batch nos loops de Produtos (cadastro e estoque), Pedidos, Entregas, Contas a Pagar e Contas a Receber.

### Fase 3: Testes e Validação
- Executar testes unitários do webhook (`webhook.service.spec.ts`).
- Compilar o projeto (`npm run build`).
- Validar ausência de memory leaks ou timers de TTL periódicos.

### Fase 4: Commit e Push
- Commit semântico (`feat(webhook): implement durable postgresql state store for webhook cdc`).
- Push para `origin/main`.
