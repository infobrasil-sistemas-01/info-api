# Plano de Implementação: Endpoint POST /production-order

## 1. Contexto e Objetivo
Implementação do endpoint de criação de Ordem de Produção (`POST /api/v1/production-order`) no módulo `ProductionOrder` do **Info Vendas API**.
O endpoint permite que integradores criem ordens de fabricação indicando o produto acabado a ser produzido, as datas/observações e a lista declarativa de insumos consumidos. O backend é a autoridade sobre a precificação contábil dos insumos, buscando os custos fiscais em lote (`PRO_PRCCOMPRAFISCAL`) na tabela `PRODUTOS` do Firebird e consolidando a transação de forma atômica entre `ORDENSPRODUCAO` e `ORDENSPRODUCAOITENS`.

---

## 2. Regras de Negócio e Mapeamento

### 2.1 Cabeçalho (`ORDENSPRODUCAO`)
| Coluna Firebird | Origem | Comportamento / Regra |
| :--- | :--- | :--- |
| `ORP_NUMERO` | Firebird Generator | `GEN_ID(GEN_NUMEROORP, 1)` via cláusula `RETURNING ORP_NUMERO` |
| `SIT_CODIGO` | Fixo | Sempre `1` (Aberta/Pendente), não editável pelo integrador |
| `LOJ_CODIGO` | Token / Body | Em M2M usa `body.storeId` ou fallback `token.storeId`. Em H2M força `token.storeId` |
| `USU_CODIGO` | Token / Body | Em M2M recebe no DTO (`body.userId` ou fallback token). Em H2M usa operador do token |
| `ORP_DATA` | Sistema | Data atual do servidor em UTC-3 (`America/Sao_Paulo`, `YYYY-MM-DD`) |
| `ORP_HORA` | Sistema | Hora atual do servidor em UTC-3 (`America/Sao_Paulo`, `HH:mm:ss`) |
| `ORP_DATAINICIO` | DTO (Opcional) | Data prevista de início da fabricação (`start_date` / `date`) |
| `ORP_DATAFINAL` | DTO (Opcional) | Data prevista de término da fabricação (`end_date`) |
| `PRO_CODIGO` | DTO (Obrigatório) | Código/ID do produto final a ser produzido (`product_id` / `product_code`) |
| `ORP_QUANTIDADE` | DTO (Obrigatório) | Quantidade planejada a produzir (`quantity`, maior que 0) |
| `ORP_QUANTIDADEACABADA` | Fixo | `0` (nenhuma quantidade baixada no momento da criação) |
| `ORP_TOTAL` | Sistema | Somatória calculada de todos os insumos: $\sum (\text{OPI\_QTDE} \times \text{OPI\_PRECO})$ |
| `ORP_OBS` | Sistema / Hard-coded | Sempre `'Ordem de Produção emitida via integração'` na coluna `ORP_OBS` |

### 2.2 Itens / Insumos (`ORDENSPRODUCAOITENS`)
| Coluna Firebird | Origem | Comportamento / Regra |
| :--- | :--- | :--- |
| `OPI_NUMERO` | Firebird Generator | `GEN_ID(GEN_NUMEROOPI, 1)` |
| `ORP_NUMERO` | FK | Vinculado ao `ORP_NUMERO` gerado no cabeçalho |
| `PRO_CODIGO` | DTO (`items[].product_id`) | Código/ID do insumo consumido |
| `OPI_QTDE` | DTO (`items[].quantity`) | Quantidade consumida (maior que 0) |
| `OPI_PRECO` | Tabela `PRODUTOS` | Custo fiscal do insumo (`PRO_PRCCOMPRAFISCAL ?? 0.00`) |
| `OPI_TOTAL` | Sistema | $\text{OPI\_QTDE} \times \text{OPI\_PRECO}$ |

### 2.3 Validações e Tratamento de Erros
1. **Insumos inexistentes:** Busca em lote `SELECT PRO_CODIGO, PRO_PRCCOMPRAFISCAL FROM PRODUTOS WHERE PRO_CODIGO IN (...)`. Se algum código não for retornado, lança `BadRequestException('Produto(s)/Insumo(s) não encontrado(s) no cadastro: [...]')`.
2. **Array de itens vazio:** O schema Zod valida `items: z.array(...).min(1, 'A ordem de produção deve conter pelo menos 1 insumo')`.
3. **Produto acabado inexistente:** Validação da existência do produto acabado a ser produzido (`product_id`).
4. **Atomicidade:** Transação Firebird atômica. Caso qualquer insert falhe, executa `transaction.rollback` e lança a exceção correspondente.

---

## 3. Especificação do Endpoint

* **Rota:** `POST /api/v1/production-order`
* **Guards:** `@UseGuards(JwtAuthGuard, PermissionsGuard)`
* **Permissão RBAC:** `@RequirePermissions({ allOf: ['tenant.production-orders.create'] })`
* **Tag Swagger:** `Production Order`
* **Status HTTP:** `201 Created` retornando a ordem completa criada com itens (`ProductionOrderDetailResponseDto`).

---

## 4. Estrutura de Arquivos Criados/Modificados

1. **DTOs:**
   - `src/modules/production-order/dto/create-production-order.dto.ts`:
     - `ProductionOrderItemSchema` / `ProductionOrderItemDto`: `product_id` (string | number), `quantity` (number > 0).
     - `PostProductionOrderSchema` / `PostProductionOrderDto`: `product_id` (string | number), `quantity` (number > 0), `store_id` (opcional), `user_id` (opcional), `start_date` / `date` (YYYY-MM-DD opcional), `end_date` (YYYY-MM-DD opcional), `store_note` (string <= 200 opcional), `items` (array min 1 obrigatório).
2. **Service (`production-order.service.ts`):**
   - Método `create(credentialsId, storeId, operatorId, dto: PostProductionOrderDto)`.
   - Consulta em lote dos insumos e do produto acabado.
   - Data e hora convertidas explicitamente para o fuso horário `America/Sao_Paulo` (UTC-3).
   - Transação Firebird com inserts sequenciais de cabeçalho e itens.
   - Retorno da ordem criada chamando `getById(credentialsId, storeId, orderNumber)` com `getItemsByProductionOrderNumber`.
3. **Controller (`production-order.controller.ts`):**
   - `@Post()` mapeado para `create`.
4. **Testes Unitários:**
   - `create-production-order.dto.spec.ts`
   - Atualização de `production-order.service.spec.ts` com testes de criação bem-sucedida, rollback e erro de insumo inexistente.
   - Atualização de `production-order.controller.spec.ts` com o endpoint `create`.

