# ADR 004: Captura de Alterações (CDC) em Estoque e Preços Multi-Tabela via Checksum de Estado no Webhook Engine

- **Status:** Aceito
- **Data:** 2026-11-18
- **Autores:** Gabriel Bezerra / Time de Engenharia
- **Contexto de Aplicação:** Módulo de Webhooks / Worker Autônomo (`src/worker/webhook-worker.service.ts`) e Catálogo de Produtos

---

## 1. Contexto e Problema

O ecossistema `info-api` disponibiliza webhooks assíncronos orientados a eventos para notificar sistemas externos (e-commerces B2C/B2B, ERPs parceiros, CRMs e marketplaces) sobre alterações no ciclo de vida de produtos (`product.created` e `product.updated`).

Originalmente, a detecção de mudanças cadastrais operava exclusivamente sobre a tabela `PRODUTOS P` do banco de dados relacional Firebird, utilizando um cursor monotônico composto baseado em data, hora e identificador:
`COALESCE(P.PRO_DATAALTERACAO, P.PRO_DATACADASTRO)` + `P.PRO_HORA` + `P.PRO_CODIGO`.

Entretanto, as operações comerciais e logísticas no ERP InfoBrasil dividem o domínio de produtos em duas estruturas fisicamente desacopladas:
1. **Tabela `PRODUTOS` (1):** Armazena metadados cadastrais gerais (descrição, código de barras, unidade de medida, marca e grupo). Possui colunas de auditoria com granularidade de segundo (`PRO_DATACADASTRO`, `PRO_DATAALTERACAO` e `PRO_HORA`).
2. **Tabela `ESTOQUE` (N):** Armazena os saldos de estoque (`EST_ATUAL`, `EST_APOIO`) e até 12 tabelas simultâneas de preço normal (`PRO_PRECO1`..`12`) e promocional (`PRO_PRECOP1`..`12`) por filial (`LOJ_CODIGO`). Possui apenas o campo de auditoria `EST_DTALTERACAO` do tipo **`DATE` (sem coluna de hora `EST_HORA`)**.

### Desafios de Engenharia Identificados:
1. **Invisibilidade de Vendas e Atualizações de Preço:** Quando ocorre uma venda no PDV, baixa manual de estoque ou reajuste de preços na retaguarda, o ERP InfoBrasil atualiza estritamente os registros na tabela `ESTOQUE`. A tabela `PRODUTOS` permanece intocada. Consequentemente, o cursor de produtos não detectava a alteração, deixando os canais integrados (e-commerces) com saldo e preços desatualizados.
2. **A Armadilha do Fan-in no SQL (`JOIN` / `EXISTS`):** Tentar unificar a busca com um `OR EXISTS (SELECT 1 FROM ESTOQUE E WHERE ...)` quebraria a monotonicidade estrita do cursor de `PRODUTOS`. Se um produto cadastrado em 2023 tivesse o saldo alterado hoje, o cursor retrocederia anos no tempo ou geraria loops infinitos entre produtos antigos e novos (como o caso do EAN-13 `6890000010178` vs Produto `1`).
3. **Assimetria de Granularidade Temporal (Date sem Hora):** Como `EST_DTALTERACAO` armazena apenas `DATE`, qualquer filtro `>= CURRENT_DATE` retorna **todos** os produtos alterados hoje ao longo do dia inteiro. Sem um mecanismo secundário de controle de estado, cada ciclo do worker (15s) reemitiria eventos duplicados em massa para os mesmos produtos.
4. **Multi-tabela de Preços e Ambiguidade de Domínio:** O ERP suporta até 12 tabelas de preços simultâneas. Como o webhook é um evento *push* agnóstico, entregar apenas uma tabela arbitrária romperia com o princípio de auto-suficiência (*Event-Carried State Transfer*) para clientes que utilizam tabelas 2, 3 ou 5.

---

## 2. Decisão

Decidiu-se adotar uma arquitetura de **CDC desacoplado com duplo ciclo de detecção**, combinando **varredura sequencial de estoque**, **matriz de preços multi-tabela** e **filtro de idempotência por checksum determinístico (MD5)**.

### 2.1. Desacoplamento dos Ciclos de Captura
O worker passa a executar dois fluxos independentes de detecção dentro do mesmo tick de polling:
- **Fluxo 2.a (Cadastral - `PRODUTOS`):** Mantém o cursor monotônico existente (`lastProductId`, `lastProductSyncAt`), capturando inserções (`product.created`) e alterações de descrição/marca/grupo (`product.updated`).
- **Fluxo 2.b (Estoque e Preços - `ESTOQUE`):** Monitora candidatos na tabela `ESTOQUE` onde `EST_DTALTERACAO >= :todayStr`. Utiliza um cursor sequencial alfanumérico em memória (`lastStockSweepProductIdBySub`), paginando em lotes de 25 registros ordenados por `PRO_CODIGO ASC` e reiniciando a varredura ao atingir o fim da fila do dia.

### 2.2. Checksum de Estado Determinístico (MD5) e IdempotentFilter
Para contornar a ausência de coluna de hora em `ESTOQUE` sem criar tabelas auxiliares de auditoria no Firebird do cliente:
1. Para cada produto com estoque tocado na data atual, o worker extrai todas as linhas de `ESTOQUE` de todas as lojas (`LOJ_CODIGO`).
2. O método `computeStockChecksum(stocks)` ordena os registros por `storeId` e gera um hash MD5 determinístico sobre o JSON dos saldos (`current`, `support`) e do array de tabelas de preços (`prices`).
3. Uma chave de estado `${sub.id}:stock_state:${productId}:${checksum}` é verificada no `IdempotentFilter` em memória (com TTL de 2 horas):
   - **Checksum Idêntico:** O produto já foi processado e entregue com este exato estado de estoque/preço. É descartado imediatamente em $O(1)$, com **zero requisições de webhook geradas**.
   - **Checksum Divergente:** Houve alteração física real em saldo ou preço. O worker busca os dados do produto, monta o snapshot completo e enfileira a entrega de `product.updated`.
4. Os dois fluxos (2.a e 2.b) sincronizam entre si o registro de `stock_state`, garantindo que uma alteração cadastral que já incluiu o saldo recente não seja re-disparada pelo ciclo de estoque e vice-versa.

### 2.3. Modelagem do Payload Enriquecido (`stock` com `price`, `promotionalPrice` e `prices[]`)
Cada elemento do array `stock` no payload do webhook passa a transportar o estado completo de preços:
- `price`: Preço padrão da Tabela 1 (ou primeira tabela preenchida $> 0$, fallback `0`).
- `promotionalPrice`: Preço promocional da Tabela 1 (`PRO_PRECOP1`, fallback `null`).
- `prices`: Array estruturado contendo **apenas tabelas configuradas com preço $> 0$**, no formato:
```json
{
  "storeId": 1,
  "current": 376,
  "support": -20,
  "price": 100.0,
  "promotionalPrice": 89.9,
  "prices": [
    { "table": 1, "price": 100.0, "promotionalPrice": 89.9 },
    { "table": 2, "price": 105.0, "promotionalPrice": null }
  ]
}
```

### 2.4. Warmup de Chaves de Idempotência no Bootstrap
O método `warmupIdempotencyKeys()` foi atualizado para, na inicialização do worker, ler as entregas dos últimos 120 minutos e pré-computar os hashes `stock_state` a partir dos payloads já entregues. Isso assegura que um reinício de container não provoque rajadas (*thundering herd*) de reenvios sobre estoques que foram modificados antes do restart.

---

## 3. Consequências e Trade-Offs

### Positivas
- **Cobertura Integral do Ciclo de Vida:** Vendas em PDV, entradas de mercadoria e remarcações de preço agora notificam os sistemas integrados em tempo real (latência típica $\le 15$ segundos).
- **Preservação da Monotonicidade:** O cursor principal de `PRODUTOS` (`lastProductId`, `lastProductSyncAt`) permanece matematicamente protegido contra regressões temporais e loops infinitos.
- **Auto-suficiência do Consumidor (*Event-Carried State Transfer*):** Consumidores de canais de venda distintos (B2C, B2B, Televendas) leem sua respectiva tabela diretamente do array `prices` sem necessidade de round-trips síncronos na API REST.
- **Zero Invasividade no Banco Legado:** Não exige privilégios de DDL, criação de triggers ou tabelas de auditoria no Firebird do cliente.

### Negativas e Débitos Técnicos Conscientes
- **Custo de CPU em Memória:** Produtos que tiveram alteração na data de hoje são relidos em batches e têm seu hash revalidado a cada ciclo de varredura. Em clientes de varejo de altíssimo volume (ex: $> 100.000$ mutações diárias de saldo), a varredura da data de hoje exigirá um particionamento mais agressivo ou cache Redis distribuído.
- **Janela de Retenção do TTL (2 Horas):** Se um produto tiver seu estoque modificado, ficar estático por mais de 2 horas e o worker for reiniciado após esse período sem novas entregas no Postgres, uma primeira reavaliação pode reemitir o evento. O warmup de 3.000 registros mitiga isso para operações normais.

---

## 4. Alternativas Consideradas e Rejeitadas

1. **`LEFT JOIN` / `EXISTS` Único no SQL de Produtos:**
   - *Motivo da rejeição:* O produto alterado em estoque quebrava a ordenação cronológica do cursor cadastral (`PRO_DATAALTERACAO ASC`), gerando starvation ou regressão do cursor global para anos anteriores.
2. **Triggers com Tabela de Outbox no Firebird:**
   - *Motivo da rejeição:* Inviável em clientes corporativos onde o usuário de banco de dados fornecido para a API possui permissões estritamente restritas de `SELECT`, impossibilitando a execução de DDL em produção.
3. **Expor apenas a Tabela 1 no Webhook:**
   - *Motivo da rejeição:* Clientes com modelos omnichannel e precificação diferenciada por canal (e-commerce vs atacado) ficariam cegos a reajustes nas tabelas de preço ativas de suas operações.
