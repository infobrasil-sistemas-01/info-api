# Plano de Implementação: Enriquecimento de Dados dos Pedidos (GET /orders e GET /orders/:id)

Este documento especifica a inclusão e padronização dos campos solicitados nas rotas `GET /orders` e `GET /orders/:id` no módulo `order`, consultando a base de dados Firebird do cliente/tenant.

---

## 1. Diagnóstico do Estado Atual vs. Requisitos

A tabela abaixo compara as informações solicitadas pelo usuário com o que atualmente é retornado por `GET /orders` e `GET /orders/:id`:

| Informação Solicitada | Situação em `GET /orders` | Situação em `GET /orders/:id` | Ação Necessária |
| :--- | :--- | :--- | :--- |
| **Loja/filial** (ID e nome/fantasia) | Apenas `V.LOJ_CODIGO` | Apenas `V.LOJ_CODIGO` | Adicionar `LEFT JOIN LOJAS LOJ ON LOJ.LOJ_CODIGO = V.LOJ_CODIGO` e retornar `LOJ_NOME` e `LOJ_FANTASIA`. |
| **Data e hora da venda** | `V.VEN_DATA`, `V.VEN_HORA` | `V.VEN_DATA`, `V.VEN_HORA` | Já presente. Manter e validar tipagem. |
| **Número/código da venda** | `V.VEN_NUMERO` | `V.VEN_NUMERO` | Já presente. Manter. |
| **Valor bruto da venda** | **Ausente** | Presente (`V.VEN_TOTALBRUTO`) | Incluir `V.VEN_TOTALBRUTO` em `GET /orders` e expor em `OrderResponseDto`. |
| **Valor dos descontos** | **Ausente** | Presente (`V.VEN_TOTALDESC`) | Incluir `V.VEN_TOTALDESC` em `GET /orders` e expor em `OrderResponseDto`. |
| **Valor líquido** | Presente (`V.VEN_TOTALLIQUIDO`) | Presente (`V.VEN_TOTALLIQUIDO`) | Já presente. Manter. |
| **Formas de pagamento e valores** | Apenas `V.FP1_CODIGO`, `FPG_DESCRICAO` (sem valor!) | Apenas `V.FP1_CODIGO`, `FPG_DESCRICAO` (sem valor!) | Incluir `VEN_TOTALPP1` (valor da forma 1) e as formas secundárias da venda (`FP2_CODIGO`/`VEN_TOTALPP2`, `FP3_CODIGO`/`VEN_TOTALPP3`, `FP4_CODIGO`/`VEN_TOTALPP4`) com seus respectivos joins em `FORMASPAG`. Expor também uma estrutura amigável `PAYMENTS: Array<{ codigo, descricao, valor }>` para facilitar integrações. |
| **Situação da venda (e cancelamento)** | `V.SIT_CODIGO`, `S.SIT_DESCRICAO` no SQL, mas **ausente no DTO** | `V.SIT_CODIGO`, `S.SIT_DESCRICAO` no SQL, mas **ausente no DTO** | Adicionar `SIT_DESCRICAO` no `OrderResponseDto` e documentar códigos no Swagger (1: Aberto, 2: Faturado, 3: Cancelado). |
| **Vendedor (ID e nome)** | Presente (`V.FUN_CODIGO`, `F.FUN_NOME`) | Presente (`V.FUN_CODIGO`, `F.FUN_NOME`) | Já presente no SQL e DTO via `funcionarios`. Manter e enriquecer docstring do Swagger. |

---

## 2. Modelagem das Consultas SQL (Firebird)

### 2.1. `GET /orders` (Listagem Paginada)

Atualizar a query de `OrderService.get()` para:
```sql
SELECT FIRST ? SKIP ?
    V.VEN_NUMERO,
    V.LOJ_CODIGO,
    LOJ.LOJ_NOME,
    LOJ.LOJ_FANTASIA,
    V.VEN_DATA,
    V.VEN_HORA,
    V.SIT_CODIGO,
    S.SIT_DESCRICAO,
    V.CLI_CODIGO,
    C.CLI_NOME,
    V.FUN_CODIGO,
    F.FUN_NOME,
    V.USU_CODIGO,
    U.USU_APELIDO,
    V.VEN_NUMSITE,
    V.VEN_TIPO,
    V.VEN_TOTALBRUTO,
    V.VEN_TOTALDESC,
    V.VEN_TOTALLIQUIDO,
    -- Forma 1
    V.FP1_CODIGO,
    FPG1.FPG_DESCRICAO,
    V.VEN_TOTALPP1,
    V.PP1_CODIGO,
    PLP.PLP_DESCRICAO,
    -- Forma 2
    V.FP2_CODIGO,
    FPG2.FPG_DESCRICAO AS FPG2_DESCRICAO,
    V.VEN_TOTALPP2,
    -- Forma 3
    V.FP3_CODIGO,
    FPG3.FPG_DESCRICAO AS FPG3_DESCRICAO,
    V.VEN_TOTALPP3,
    -- Forma 4
    V.FP4_CODIGO,
    FPG4.FPG_DESCRICAO AS FPG4_DESCRICAO,
    V.VEN_TOTALPP4
 FROM VENDAS V
 LEFT JOIN LOJAS LOJ ON LOJ.LOJ_CODIGO = V.LOJ_CODIGO
 LEFT JOIN FORMASPAG FPG1 ON FPG1.FPG_CODIGO = V.FP1_CODIGO
 LEFT JOIN FORMASPAG FPG2 ON FPG2.FPG_CODIGO = V.FP2_CODIGO
 LEFT JOIN FORMASPAG FPG3 ON FPG3.FPG_CODIGO = V.FP3_CODIGO
 LEFT JOIN FORMASPAG FPG4 ON FPG4.FPG_CODIGO = V.FP4_CODIGO
 LEFT JOIN PLANOSPAG PLP ON PLP.PLP_CODIGO = V.PP1_CODIGO
 LEFT JOIN CLIENTES C ON C.CLI_CODIGO = V.CLI_CODIGO
 LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = V.FUN_CODIGO
 LEFT JOIN USUARIOS U ON U.USU_CODIGO = V.USU_CODIGO
 LEFT JOIN SITUACAO S ON S.SIT_CODIGO = V.SIT_CODIGO
 ${whereClause}
 ORDER BY V.VEN_NUMERO DESC
```

### 2.2. `GET /orders/:id` (Detalhes do Pedido)

Atualizar a query de `OrderService.getById()` com os mesmos campos de `LOJAS`, `FORMASPAG` adicionais e valores de pagamento (`VEN_TOTALPP1`, `VEN_TOTALPP2`, `VEN_TOTALPP3`, `VEN_TOTALPP4`), mantendo os campos detalhados de frete, entrega e montagem já existentes no detalhe.

---

## 3. Estruturação do Array de Pagamentos (`PAYMENTS`)

Para entregar uma experiência de desenvolvedor moderna mantendo compatibilidade 100% regressiva com os campos planos legados do Firebird, o serviço processará as linhas retornadas para injetar um array `PAYMENTS`:

```typescript
export interface OrderPaymentItem {
  codigo: number;
  descricao: string;
  valor: number;
}
```

Cada forma de pagamento (1 a 4) com código válido e/ou valor > 0 será adicionada ao array `PAYMENTS`:
- Se `FP1_CODIGO` estiver presente: `{ codigo: FP1_CODIGO, descricao: FPG_DESCRICAO, valor: VEN_TOTALPP1 || VEN_TOTALLIQUIDO }`
- Se `FP2_CODIGO` estiver presente e > 0: `{ codigo: FP2_CODIGO, descricao: FPG2_DESCRICAO, valor: VEN_TOTALPP2 }`
- Se `FP3_CODIGO` estiver presente e > 0: `{ codigo: FP3_CODIGO, descricao: FPG3_DESCRICAO, valor: VEN_TOTALPP3 }`
- Se `FP4_CODIGO` estiver presente e > 0: `{ codigo: FP4_CODIGO, descricao: FPG4_DESCRICAO, valor: VEN_TOTALPP4 }`

---

## 4. Atualização dos DTOs no Swagger

Atualizar [order-response.dto.ts](file:///c:/dev/info-api/src/modules/order/dto/order-response.dto.ts):
- Adicionar `LOJ_NOME?: string` e `LOJ_FANTASIA?: string`.
- Adicionar `SIT_DESCRICAO?: string`.
- Mover `VEN_TOTALBRUTO?: number` e `VEN_TOTALDESC?: number` para `OrderResponseDto` (ficando disponível tanto na listagem quanto no detalhe).
- Adicionar `VEN_TOTALPP1?: number`, `FP2_CODIGO?: number`, `FPG2_DESCRICAO?: string`, `VEN_TOTALPP2?: number`, `FP3_CODIGO?: number`, `FPG3_DESCRICAO?: string`, `VEN_TOTALPP3?: number`, `FP4_CODIGO?: number`, `FPG4_DESCRICAO?: string`, `VEN_TOTALPP4?: number`.
- Adicionar DTO `OrderPaymentDto` e propriedade `PAYMENTS?: OrderPaymentDto[]`.

---

## 5. Roteiro de Implementação e Validação

1. **Atualização de DTOs:**
   - Modificar `src/modules/order/dto/order-response.dto.ts` com as novas propriedades e anotações do `@nestjs/swagger`.
2. **Atualização do Service:**
   - Atualizar queries de `get()` e `getById()` em `src/modules/order/order.service.ts`.
   - Adicionar método auxiliar `mapOrderPayments(row)` para enriquecer o array `PAYMENTS`.
3. **Atualização dos Testes Unitários:**
   - Atualizar `src/modules/order/order.service.spec.ts` para verificar os novos campos nos mocks e retornos esperados.
4. **Validação:**
   - Executar `npm test -- src/modules/order/`
   - Executar `npm run build`
