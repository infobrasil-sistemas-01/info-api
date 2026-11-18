# Plano de Implementação: Padronização de Payloads de Webhook em Português (DTOs do ERP)

- **Status:** Aprovado
- **Data:** 2026-11-18
- **Autor:** Gabriel Bezerra / Time de Engenharia
- **Contexto:** Alinhamento dos contratos dos eventos assíncronos (`webhookDelivery.payload.data`) com os DTOs de retorno dos endpoints REST da `info-api`.

---

## 1. Objetivo & Motivação

Atualmente, os endpoints REST da `info-api` retornam campos em português maiúsculo aderentes ao modelo relacional do ERP InfoBrasil (`PRO_CODIGO`, `VEN_NUMERO`, `LOJ_CODIGO`, `EST_ATUAL`), enquanto os Webhooks emitidos pelo `WebhookWorkerService` construíam o nó `data` em inglês `camelCase` (`productId`, `barcode`, `storeId`, etc.).

Essa divergência gerava redundância de modelos de dados e atrito para os integradores parceiros, que precisavam escrever parsers e DTOs distintos para consumir o mesmo dado via REST ou via Webhook.

Decidiu-se unificar o contrato:
- **Envelope de Transporte:** Preserva o padrão internacional (`id`, `event`, `timestamp`, `tenant`, `data`).
- **Nó `data`:** Passa a espelhar estritamente a estrutura e a nomenclatura dos DTOs de resposta da API REST (`ProductResponseDto`, `OrderResponseDto`, `DeliveryResponseDto`, etc.).

---

## 2. Especificação dos Contratos por Domínio

### 2.1. Produtos (`product.created` e `product.updated`)
Alinhado com `ProductResponseDto` e `ProductStockResponseDto`:
```json
{
  "id": "evt_prd_70a5d45057220b3b",
  "event": "product.updated",
  "timestamp": "2026-11-18T14:15:00.000Z",
  "tenant": "infoadmin",
  "data": {
    "PRO_CODIGO": 1,
    "PRO_CODIGOBAR": "7891234567890",
    "PRO_DESCRICAO": "REFRIGERANTE COCA-COLA 2L",
    "PRO_UNIDADE": "UN",
    "MAR_CODIGO": 2,
    "MAR_DESCRICAO": "COCA-COLA",
    "GRU_CODIGO": 1,
    "GRU_DESCRICAO": "BEBIDAS",
    "ESTOQUE": [
      {
        "LOJ_CODIGO": 1,
        "EST_ATUAL": 376,
        "EST_APOIO": -20,
        "PRECO": 10.50,
        "PRECO_PROMOCIONAL": 9.90,
        "TABELAS_PRECO": [
          { "TABELA": 1, "PRECO": 10.50, "PRECO_PROMOCIONAL": 9.90 },
          { "TABELA": 2, "PRECO": 11.00, "PRECO_PROMOCIONAL": null }
        ]
      }
    ],
    "PRO_DATACADASTRO": "2023-06-18 14:52:10",
    "PRO_DATAALTERACAO": "2026-11-18 10:24:00",
    "links": { "self": "/api/v1/products/id/1" }
  }
}
```

### 2.2. Pedidos (`order.created` e `order.updated`)
Alinhado com `OrderResponseDto`:
```json
{
  "id": "evt_ord_a1b2c3d4e5f60718",
  "event": "order.created",
  "timestamp": "2026-11-18T14:00:00.000Z",
  "tenant": "infoadmin",
  "data": {
    "VEN_NUMERO": 10452,
    "VEN_NUMSITE": "WEB-9912",
    "VEN_TIPO": "VENDA",
    "LOJ_CODIGO": 1,
    "LOJ_NOME": "LOJA MATRIZ",
    "LOJ_FANTASIA": "CENTRO",
    "SIT_CODIGO": 1,
    "SIT_DESCRICAO": "ABERTO",
    "CLI_CODIGO": 45,
    "CLI_NOME": "SUPERMERCADO CENTRAL LTDA",
    "CLI_CPF_CNPJ": "12.345.678/0001-90",
    "CLI_FONE": "(85) 99999-8888",
    "CLI_EMAIL": "compras@central.com.br",
    "FUN_CODIGO": 12,
    "FUN_NOME": "VENDEDOR EXEMPLO",
    "USU_CODIGO": 1,
    "USU_APELIDO": "OPERADOR",
    "VEN_TOTALBRUTO": 1250.80,
    "VEN_DESCONTO": 50.00,
    "VEN_TOTALLIQUIDO": 1200.80,
    "FORMAS_PAGAMENTO": [
      { "CODIGO": 1, "DESCRICAO": "DINHEIRO", "VALOR": 1200.80 }
    ],
    "ITENS": [],
    "VEN_DATAVENDA": "2026-11-18",
    "VEN_HORAVENDA": "13:58:00",
    "links": {
      "self": "/api/v1/orders/10452",
      "items": "/api/v1/orders/10452/items"
    }
  }
}
```

### 2.3. Entregas (`delivery.created` e `delivery.updated`)
Alinhado com `DeliveryResponseDto`:
```json
{
  "id": "evt_del_1234abcd5678ef90",
  "event": "delivery.created",
  "timestamp": "2026-11-18T14:12:00.000Z",
  "tenant": "infoadmin",
  "data": {
    "ENT_NUMERO": 501,
    "VEN_NUMERO": 10452,
    "LOJ_CODIGO": 1,
    "PRE_CODIGO": 3,
    "PRE_NOME": "MOTORISTA JOAO",
    "VEI_PLACA": "NQL-1234",
    "TBS_CODIGO": 1,
    "TBS_DESCRICAO": "PREPARACAO",
    "SIT_CODIGO": 1,
    "ENT_DATA": "2026-11-18",
    "ENT_HORA": "14:12:00",
    "ENT_DATABAIXA": null,
    "links": { "self": "/api/v1/deliveries/501" }
  }
}
```

### 2.4. Contas a Pagar (`account_payable.created` e `account_payable.updated`)
Alinhado com `AccountPayableResponseDto`:
```json
{
  "id": "evt_pay_aabb112233445566",
  "event": "account_payable.created",
  "timestamp": "2026-11-18T14:02:00.000Z",
  "tenant": "infoadmin",
  "data": {
    "PAG_NUMERO": 8812,
    "LOJ_CODIGO": 1,
    "CRE_CODIGO": 12,
    "CRE_NOME": "FORNECEDOR DISTRIBUIDOR",
    "PAG_VALOR": 3500.00,
    "PAG_DATAMOV": "2026-11-18",
    "PAG_DATAVENC": "2026-12-10",
    "PAG_DATAPAG": null,
    "PAG_SITUACAO": "A",
    "links": { "self": "/api/v1/account-payable/8812" }
  }
}
```

### 2.5. Contas a Receber (`account_receivable.created` e `account_receivable.updated`)
Alinhado com `AccountReceivableResponseDto`:
```json
{
  "id": "evt_rec_1122334455667788",
  "event": "account_receivable.created",
  "timestamp": "2026-11-18T14:03:00.000Z",
  "tenant": "infoadmin",
  "data": {
    "REC_NUMERO": 9940,
    "LOJ_CODIGO": 1,
    "CLI_CODIGO": 45,
    "CLI_NOME": "SUPERMERCADO CENTRAL LTDA",
    "CLI_CPF_CNPJ": "12.345.678/0001-90",
    "REC_VALOR": 1200.80,
    "REC_DATAVENC": "2026-11-30",
    "REC_SITUACAO": "A",
    "links": { "self": "/api/v1/account-receivable/9940" }
  }
}
```

---

## 3. Etapas de Execução

1. **Atualização do `WebhookWorkerService` (`src/worker/webhook-worker.service.ts`):**
   - Atualizar `mapStockRow` e `computeStockChecksum` para o padrão `LOJ_CODIGO`, `EST_ATUAL`, `EST_APOIO`, `PRECO`, `PRECO_PROMOCIONAL`, `TABELAS_PRECO`.
   - Atualizar a montagem dos payloads de:
     - Pedidos (`VEN_NUMERO`, etc.)
     - Produtos (`PRO_CODIGO`, `ESTOQUE`, etc.)
     - Entregas (`ENT_NUMERO`, etc.)
     - Contas a Pagar (`PAG_NUMERO`, etc.)
     - Contas a Receber (`REC_NUMERO`, etc.)
   - Manter compatibilidade de transição em `warmupIdempotencyKeys()`.

2. **Atualização do Portal do Cliente (`src/modules/integration-request/templates/client.html`):**
   - Atualizar os schemas registrados em `WEBHOOK_SCHEMAS_REGISTRY` para refletir as novas chaves em maiúsculas do ERP.
   - Atualizar as tipagens TypeScript geradas e o JSON Schema.

3. **Verificação & Testes:**
   - Executar `npm test -- src/modules/webhook/webhook.service.spec.ts`.
   - Executar `npm run build`.
