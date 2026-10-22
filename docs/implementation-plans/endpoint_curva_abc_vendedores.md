# Implementação do Endpoint Curva ABC Dimensional de Vendas (GET /orders/abc-curve)

Este plano descreve a criação do endpoint analítico de alta performance `GET /api/v1/orders/abc-curve`, projetado para reproduzir com 100% de fidelidade a família de relatórios gerenciais da tela **Sistema Retaguarda - Listagem Curvas Abc de Vendas** (iniciando pelo **L2.5.2 - Curva ABC por Vendedor**, mas com arquitetura dimensional extensível).

---

## 1. Contexto & Decisões Arquiteturais Consolidadas

1. **Abordagem Dimensional Unificada (Abordagem B):**
   - Rota única sob `/orders`: `GET /api/v1/orders/abc-curve`.
   - Parâmetro `groupBy`: define a dimensão de consolidação (`SELLER`, `STORE`, `GROUP`, `BRAND`, `CUSTOMER`, `PRODUCT`).
2. **Tratamento de Nulos (Null-Safety):**
   - Conforme diretriz, **registros órfãos/nulos são desconsiderados** no agrupamento (ex: vendas sem vendedor, produtos sem marca ou grupo). A cláusula SQL sempre inclui `WHERE <ENTITY_KEY> IS NOT NULL`.
3. **Governança de Cardinalidade & Clamping (Proteção Anti-DoS):**
   - **Dimensões de Baixa Cardinalidade (`SELLER`, `STORE`, `GROUP`, `BRAND`):** Paginação opcional; resultado consolidado entregue de forma direta.
   - **Dimensões de Alta Cardinalidade (`CUSTOMER`, `PRODUCT`):** Paginação **estritamente obrigatória** (`page` e `pageSize` com teto de 100).
   - Se `groupBy IN ('CUSTOMER', 'PRODUCT')` for chamado sem `page` ou `pageSize`, a API responderá imediatamente com `400 Bad Request`, explicitando o motivo arquitetural (risco de I/O e payload excessivo em dezenas de milhares de registros).
4. **Permissão & RBAC:**
   - Reutiliza a permissão de pedidos: `@RequirePermissions({ allOf: ['tenant.orders.view'] })`.
5. **Isenção de Limite de Intervalo Comercial:**
   - Decorado com `@SkipDateRangeLimit()` para suportar janelas anuais/históricas.

---

## 2. Especificação do Contrato de API

### 2.1 Query Parameters (`GetAbcCurveQueryDto`)

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `startDate` | string (`YYYY-MM-DD`) | Sim | - | Data inicial da apuração |
| `endDate` | string (`YYYY-MM-DD`) | Sim | - | Data final da apuração |
| `groupBy` | enum (`SELLER`, `STORE`, `GROUP`, `BRAND`, `CUSTOMER`, `PRODUCT`) | Não | `SELLER` | Dimensão de agregação do relatório |
| `storeId` | number (inteiro) | Não | Token | Identificador da loja/filial no ERP |
| `system` | enum (`PED`, `PDV`, `ALL`) | Não | `PED` | Tipo da venda (`PED` = `VEN_TIPO 'E'`, `PDV` = frente de caixa) |
| `situation` | number (inteiro) | Não | `2` | Código da situação (`2` = Fechada/Faturada) |
| `orderBy` | enum (`NAME`, `VALUE`, `QUANTITY`) | Não | `NAME` | Ordenação das linhas (`NAME` replica o relatório impresso) |
| `orderDirection`| enum (`ASC`, `DESC`) | Não | Dinâmico | `ASC` para `NAME`; `DESC` para `VALUE` e `QUANTITY` |
| `page` | number (inteiro $\ge$ 1) | Condicional | `1` | **Obrigatório** para `CUSTOMER` e `PRODUCT` |
| `pageSize` | number (inteiro 1 a 100) | Condicional | `50` | **Obrigatório** para `CUSTOMER` e `PRODUCT` (Máx: 100) |

> [!IMPORTANT]
> **Validação de Erro para Alta Cardinalidade:**
> Caso `groupBy` seja `CUSTOMER` ou `PRODUCT` e a requisição omitir paginação explícita, a API lançará:
> ```json
> {
>   "statusCode": 400,
>   "message": "Para agrupamentos de alta cardinalidade ('CUSTOMER' e 'PRODUCT'), os parâmetros 'page' e 'pageSize' (máx: 100) são obrigatórios para evitar degradação de I/O no banco Firebird.",
>   "error": "Bad Request"
> }
> ```

---

### 2.2 Formato da Resposta (`AbcCurveResponseDto`)

```json
{
  "dimension": "SELLER",
  "period": {
    "startDate": "2026-01-22",
    "endDate": "2026-10-22"
  },
  "summary": {
    "totalQuantity": 57.0,
    "totalValue": 27275.88,
    "entityCount": 6
  },
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalPages": 1,
    "totalItems": 6
  },
  "items": [
    {
      "position": 1,
      "code": 41,
      "name": "ALISSON - HOMOBR",
      "soldQuantity": 1.0,
      "soldValue": 100.0,
      "quantityPercent": 1.75,
      "valuePercent": 0.37,
      "cumulativePercent": 0.37,
      "classification": "A"
    },
    {
      "position": 2,
      "code": 49,
      "name": "CARLOS CESAR - DAVI",
      "soldQuantity": 8.0,
      "soldValue": 6632.0,
      "quantityPercent": 14.04,
      "valuePercent": 24.31,
      "cumulativePercent": 24.68,
      "classification": "A"
    },
    {
      "position": 6,
      "code": 18,
      "name": "THIAGO - HOMOBR",
      "soldQuantity": 30.0,
      "soldValue": 8583.33,
      "quantityPercent": 52.63,
      "valuePercent": 31.47,
      "cumulativePercent": 100.0,
      "classification": "C"
    }
  ]
}
```

---

## 3. Matriz de Mapeamento SQL por Dimensão

O service selecionará a estratégia de JOIN e agregação baseado em `groupBy`:

| Dimensão | Coluna Código | Coluna Descrição | Tabela Principal | JOINs Necessários | Filtro Anti-Null |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`SELLER`** | `V.FUN_CODIGO` | `F.FUN_NOME` | `VENDAS V` | `ITENSVEN IV`, `FUNCIONARIOS F` | `V.FUN_CODIGO IS NOT NULL` |
| **`STORE`** | `V.LOJ_CODIGO` | `LOJ.LOJ_NOME` | `VENDAS V` | `ITENSVEN IV`, `LOJAS LOJ` | `V.LOJ_CODIGO IS NOT NULL` |
| **`GROUP`** | `P.GRU_CODIGO` | `G.GRU_DESCRICAO` | `VENDAS V` | `ITENSVEN IV`, `PRODUTOS P`, `GRUPOSPRO G` | `P.GRU_CODIGO IS NOT NULL` |
| **`BRAND`** | `P.MAR_CODIGO` | `M.MAR_DESCRICAO` | `VENDAS V` | `ITENSVEN IV`, `PRODUTOS P`, `MARCAS M` | `P.MAR_CODIGO IS NOT NULL` |
| **`CUSTOMER`** | `V.CLI_CODIGO` | `C.CLI_NOME` | `VENDAS V` | `ITENSVEN IV`, `CLIENTES C` | `V.CLI_CODIGO IS NOT NULL` |
| **`PRODUCT`** | `IV.PRO_CODIGO`| `P.PRO_DESCRICAO` | `VENDAS V` | `ITENSVEN IV`, `PRODUTOS P` | `IV.PRO_CODIGO IS NOT NULL` |

---

## 4. Algoritmo de Cálculo e Totalização

1. **Totalização Global do Universo:**
   - Para que `% Quantidade` e `% Valor` sejam matematicamente fidedignos mesmo quando paginados (ex: página 1 de Clientes), calcula-se o `totalQuantity` e `totalValue` global do período com o mesmo filtro de situação e tipo de venda:
     ```sql
     SELECT 
       COALESCE(SUM(IV.IVD_QTDE), 0) AS GLOBAL_QTD,
       COALESCE(SUM(IV.IVD_LIQUIDO), 0) AS GLOBAL_VALOR
     FROM VENDAS V
     INNER JOIN ITENSVEN IV ON IV.VEN_NUMERO = V.VEN_NUMERO
     WHERE V.VEN_DATA BETWEEN ? AND ?
       AND <DIMENSION_COLUMN> IS NOT NULL
       [AND V.LOJ_CODIGO = ?]
       [AND V.VEN_TIPO = ?]
       [AND V.SIT_CODIGO = ?]
     ```
2. **Cálculo Percentual e Curva ABC:**
   - `quantityPercent = (soldQuantity / globalQtd) * 100`
   - `valuePercent = (soldValue / globalValor) * 100`
   - `cumulativePercent`: somatório acumulado sequencial.
   - **Faixas de Corte de Pareto:**
     - **Classe A:** Acumulado até 70.00%
     - **Classe B:** Acumulado entre 70.01% e 90.00%
     - **Classe C:** Acumulado de 90.01% a 100.00%

---

## 5. Arquivos e Componentes Envolvidos

### 5.1 Novos Arquivos (DTOs & Validação)
1. **`src/modules/order/dto/get-abc-curve-query.dto.ts`**
   - Schema Zod com validação condicional para `CUSTOMER`/`PRODUCT` exigindo `page` e `pageSize`.
2. **`src/modules/order/dto/abc-curve-response.dto.ts`**
   - Classes Swagger com schema genérico (`code`, `name`, `soldQuantity`, etc.).
3. **`src/modules/order/dto/get-abc-curve-query.dto.spec.ts`**
   - Testes unitários para rejeição de `CUSTOMER`/`PRODUCT` sem paginação e aceitação das dimensões de baixa cardinalidade.

### 5.2 Arquivos Existentes a Modificar
1. **`src/modules/order/order.service.ts`**
   - Implementar `getAbcCurve(credentialsId: string, storeId: number | undefined, query: GetAbcCurveQueryDto)`.
   - Inclusão de `try ... finally { releaseConnection(connection); }` obrigatório.
2. **`src/modules/order/order.controller.ts`**
   - Adicionar `@Get('abc-curve')` com `@RequirePermissions({ allOf: ['tenant.orders.view'] })` e `@SkipDateRangeLimit()`.
3. **`src/modules/order/order.service.spec.ts` & `order.controller.spec.ts`**
   - Testes unitários para:
     - Dimensão `SELLER` batendo com os dados do print L2.5.2.
     - Dimensões `BRAND` e `GROUP` ignorando produtos com chave nula.
     - Dimensão `CUSTOMER` lançando `BadRequestException` se faltar `pageSize`.

---

## 6. Próximo Passo: Geração do Guia de Integração em PDF

Uma vez implementado e validado o endpoint com 100% de cobertura nos testes unitários:
- Criar o script `scripts/generate-abc-curve-pdf.js` estritamente alinhado às diretrizes de [`docs/guidelines/pdf-guidance.md`](file:///c:/dev/info-api/docs/guidelines/pdf-guidance.md).
- O PDF será estruturado como **Guia Técnico de Integração da API**, focando exclusivamente no endpoint `GET /api/v1/orders/abc-curve`:
  1. **Objetivo da Curva ABC de Vendas:** Breve introdução ao Princípio de Pareto (regra 80/20) e à concentração de faturamento/volume para tomada de decisão estratégica.
  2. **Permissões & Acesso:** Deixar explícito que operadores e chaves de API com a permissão existente de **"Visualizar Vendas" (`tenant.orders.view`)** já possuem acesso imediato ao recurso.
  3. **Especificação de Parâmetros e Dimensões:** Detalhamento prático de cada dimensão (`SELLER`, `STORE`, `GROUP`, `BRAND`, `CUSTOMER`, `PRODUCT`) e ordenação.
  4. **Salvaguardas & Limitações Técnicas:**
     - Exigência mandatória de paginação (`page` e `pageSize` máx: 100) para entidades de alta cardinalidade (`CUSTOMER` e `PRODUCT`), com explicação da prevenção de gargalos de I/O no Firebird.
     - Descarte automático de registros nulos (`IS NOT NULL`) para garantir a consistência das métricas.
     - Isenção de teto de dias (`@SkipDateRangeLimit()`) para relatórios anuais ou históricos.
  5. **Exemplo de Consumo:** Bloco com visual de terminal elegante demonstrando requisição HTTP e payload JSON consolidado.
