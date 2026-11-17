# Plano de Implementação: CDC Watermark para Captura de Mutações em Webhooks

## 1. Visão Geral e Objetivo Arquitetural

Garantir que o worker autônomo de Webhooks capture tanto eventos de **criação (`*.created`)** quanto de **atualização/mutação de ciclo de vida (`*.updated`)** em todas as entidades suportadas pela API (`orders`, `products`, `deliveries`, `account_payable`, `account_receivable`), sem depender de tabelas auxiliares no banco legado e prevenindo 100% de loops de repetição por divergência de relógio (*clock drift* / UTC).

---

## 2. Diagnóstico das Entidades no Firebird

| Entidade | Tabela | Coluna de Criação | Coluna de Mutação / Liquidação | Coluna de Hora | Tie-Breaker (ID) | Regra de Diferenciação (`created` vs `updated`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Produtos** | `PRODUTOS` | `PRO_DATACADASTRO` | `PRO_DATAALTERACAO` | `PRO_HORA` | `PRO_CODIGO` | Se `PRO_DATAALTERACAO` for nulo ou igual ao cadastro: `created`, senão: `updated`. |
| **Entregas** | `ENTREGAS` | `ENT_DATA` | `ENT_DATABAIXA` | `ENT_HORA` | `ENT_NUMERO` | Se `ENT_DATABAIXA` estiver preenchida ou `TBS_CODIGO` final: `updated`, senão: `created`. |
| **Contas a Pagar** | `CONTASPAGAR` | `PAG_DATAMOV` | `PAG_DATAPAG` | - (`'00:00:00'`) | `PAG_NUMERO` | Se `PAG_DATAPAG` preenchida ou `PAG_SITUACAO = 'L'`: `updated`, senão: `created`. |
| **Contas a Receber** | `CONTASRECEBER` | `REC_DATAMOV` | `REC_DATAPAG` | - (`'00:00:00'`) | `REC_NUMERO` | Se `REC_DATAPAG` preenchida ou `REC_SITUACAO = 'L'`: `updated`, senão: `created`. |
| **Vendas** | `VENDAS` | `VEN_DATA` | `VEN_DATA` (muda `SIT_CODIGO`) | `VEN_HORA` | `VEN_NUMERO` | Se `SIT_CODIGO = 1`: `order.created` (orçamento/aberto). Se `SIT_CODIGO = 2` ou `3`: `order.updated` (faturado/cancelado). |

---

## 3. O Padrão CDC Watermark (Tupla Tridimensional)

Para cada entidade, o cursor persistido no Prisma (`WebhookSubscription`) rastreia a tupla `(lastSyncAt: DateTime, lastId: Int)`.

A query SQL no Firebird avalia o avanço cronológico estrito com tie-breaker em caso de empate no mesmo segundo:

```sql
WHERE
  (MUTATION_DATE > :cursorDate)
  OR (
    MUTATION_DATE = :cursorDate
    AND (
      MUTATION_TIME > :cursorTime
      OR (MUTATION_TIME = :cursorTime AND ID > :cursorId)
    )
  )
ORDER BY
  MUTATION_DATE ASC,
  MUTATION_TIME ASC,
  ID ASC
```

### Regras Vitais de Resiliência (Zero Loops)
1. **Nunca resetar o ID Tie-Breaker (`lastId = 0`):** O `lastId` garante que, se 20 itens forem alterados no mesmo segundo, o próximo lote continue exatamente após o 20º item.
2. **Anti-Drift Tolerante:** Relógio local e de servidor Firebird podem divergir até alguns minutos. O cursor só é reancorado se estiver bizarramente no futuro ($> 1$ hora).
3. **Avanço Atômico no Prisma:** Ao final de cada lote de 20/25 registros processados, a assinatura é atualizada com `(maxSyncAt, maxSeenId)`.

---

## 4. Etapas de Execução

### Etapa 1: Atualização das Queries no `WebhookWorkerService`
- **Entregas (`ENTREGAS`):**
  - Incorporar `COALESCE(E.ENT_DATABAIXA, E.ENT_DATA)` e `E.ENT_HORA`.
  - Diferenciar `delivery.created` vs `delivery.updated`.
  - Atualizar `lastDeliveryId` e `lastDeliverySyncAt`.
- **Contas a Pagar (`CONTASPAGAR`):**
  - Incorporar `COALESCE(CP.PAG_DATAPAG, CP.PAG_DATAMOV)`.
  - Diferenciar `account_payable.created` vs `account_payable.updated`.
  - Atualizar `lastAccountPayableId` e `lastAccountPayableSyncAt`.
- **Contas a Receber (`CONTASRECEBER`):**
  - Incorporar `COALESCE(REC.REC_DATAPAG, REC.REC_DATAMOV)`.
  - Diferenciar `account_receivable.created` vs `account_receivable.updated`.
  - Atualizar `lastAccountReceivableId` e `lastAccountReceivableSyncAt`.
- **Vendas (`VENDAS`):**
  - Avaliar transição de status (`SIT_CODIGO`) via cursor temporal `VEN_DATA` + `VEN_HORA` + `VEN_NUMERO` mantendo o avanço sem recuo.

### Etapa 2: Atualização do Cold-Start em `WebhookService`
- Ao criar nova assinatura, garantir que `last*SyncAt` inicialize em `new Date()` e os IDs correspondentes sejam obtidos sem travar conexões.

### Etapa 3: Testes e Validação
- Executar testes unitários com Jest (`webhook.service.spec.ts`).
- Executar `npm run build` para garantir conformidade estrita de tipagem.
