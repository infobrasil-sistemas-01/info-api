# Plano de Implementação: Módulo de Ordens de Produção (`production-order`)

## Contexto e Objetivo
Implementação do novo módulo `ProductionOrder` no **Info Vendas API**, integrando as tabelas legadas do Firebird `ORDENSPRODUCAO` (cabeçalho) e `ORDENSPRODUCAOITENS` (itens com JOIN em `PRODUTOS` para descrição e dados auxiliares). O módulo fornecerá:
1. `GET /api/v1/production-order`: Listagem com filtros e suporte opt-in aos cabeçalhos de paginação (`X-Request-Count`).
2. `GET /api/v1/production-order/:id`: Espelho detalhado da ordem de produção contendo os dados do cabeçalho e o array aninhado de itens (`items`).
3. Permissões RBAC (`tenant.production-orders.view`) no catálogo do PostgreSQL e script de sync.
4. Exibição da nova entidade na Landing Page (`landing.html`) e no formulário de solicitação de credenciais (`form.html`).

---

## 1. Mapeamento das Tabelas Firebird

### 1.1 Tabela Cabeçalho: `ORDENSPRODUCAO`
| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `ORP_NUMERO` | `INTEGER NOT NULL` | Número identificador da Ordem de Produção (PK) |
| `SIT_CODIGO` | `INTEGER NOT NULL` | Código da situação da ordem |
| `LOJ_CODIGO` | `INTEGER NOT NULL` | Código da filial/loja vinculada |
| `USU_CODIGO` | `INTEGER NOT NULL` | Usuário criador/operador da ordem |
| `ORP_DATA` | `DATE NOT NULL` | Data de registro |
| `ORP_HORA` | `TIME` | Hora de registro |
| `ORP_DATAINICIO` | `DATE` | Data de início prevista/real |
| `ORP_DATAFINAL` | `DATE` | Data de finalização prevista/real |
| `PRO_CODIGO` | `VARCHAR(14) NOT NULL`| Código do produto principal produzido |
| `ETA_NUMERO` | `INTEGER` | Etapa / identificador de fase de produção |
| `COM_NUMERO` | `INTEGER` | Identificador de composição / compra 1 |
| `ORP_QUANTIDADEACABADA`| `NUMERIC(15,6)` | Quantidade de peças/produtos acabados |
| `ORP_TOTAL` | `NUMERIC(15,2)` | Valor total acumulado da produção |
| `ORP_QUANTIDADE` | `NUMERIC(15,6)` | Quantidade planejada da ordem |
| `ORP_OBS` | `VARCHAR(200)` | Observações gerais |
| `ORP_DATABAIXA` | `DATE` | Data em que a ordem foi baixada/finalizada |
| `ORP_HORABAIXA` | `TIME` | Hora da baixa |
| `SDA_NUMERO` | `INTEGER` | Número de saída / documento auxiliar |
| `COM_NUMERO2` | `INTEGER` | Composição / documento auxiliar 2 |

#### JOINs do Cabeçalho:
* `LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = OP.PRO_CODIGO` -> `P.PRO_DESCRICAO AS PRO_DESCRICAO`, `P.PRO_UNIDADE AS PRO_UNIDADE`, `P.PRO_CODIGOBAR AS PRO_CODIGOBAR`
* `LEFT JOIN SITUACAO S ON S.SIT_CODIGO = OP.SIT_CODIGO` -> `S.SIT_DESCRICAO AS SIT_DESCRICAO`
* `LEFT JOIN LOJAS L ON L.LOJ_CODIGO = OP.LOJ_CODIGO` -> `L.LOJ_NOME AS LOJ_NOME`, `L.LOJ_FANTASIA AS LOJ_FANTASIA`
* `LEFT JOIN USUARIOS U ON U.USU_CODIGO = OP.USU_CODIGO` -> `U.USU_APELIDO AS USU_APELIDO`

---

### 1.2 Tabela de Itens (Insumos / Componentes): `ORDENSPRODUCAOITENS`
| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `OPI_NUMERO` | `INTEGER NOT NULL` | Identificador do item na ordem (PK) |
| `ORP_NUMERO` | `INTEGER NOT NULL` | Número da ordem de produção vinculada (FK) |
| `PRO_CODIGO` | `VARCHAR(14) NOT NULL`| Código do insumo / componente consumido |
| `OPI_PRECO` | `NUMERIC(15,6)` | Custo/preço unitário do insumo |
| `OPI_QTDE` | `NUMERIC(15,6)` | Quantidade consumida/utilizada |
| `OPI_TOTAL` | `NUMERIC(15,6)` | Valor total do item (`QTDE * PRECO`) |

#### JOINs dos Itens:
* `LEFT JOIN PRODUTOS P ON P.PRO_CODIGO = OPI.PRO_CODIGO` -> `P.PRO_DESCRICAO`, `P.PRO_UNIDADE`, `P.PRO_CODIGOBAR`, `P.PRO_REFERENCIA`
* `LEFT JOIN MARCAS M ON M.MAR_CODIGO = P.MAR_CODIGO` -> `M.MAR_DESCRICAO`
* `LEFT JOIN GRUPOSPRO G ON G.GRU_CODIGO = P.GRU_CODIGO` -> `G.GRU_DESCRICAO`

---

## 2. Especificação da API (`src/modules/production-order/`)

### 2.1 Rota Base e Segurança
* **Prefixo Global:** `/api/v1/production-order`
* **Guards:** `@UseGuards(JwtAuthGuard, PermissionsGuard)`
* **Permissão Obrigatória:** `@RequirePermissions({ allOf: ['tenant.production-orders.view'] })`
* **Tag Swagger:** `@ApiTags('Production Order')`

---

### 2.2 Endpoint 1: Listagem Paginada
`GET /api/v1/production-order`

* **Decorators:**
  * `@IncludeCount() includeCount: boolean`
  * `@ApiHeader({ name: 'X-Request-Count', required: false, description: 'Se true, calcula e inclui headers de paginação (X-Total-Count, etc)' })`
* **Query Parameters (`ProductionOrderQueryDto`):**
  * `page` (number, min 1, default 1)
  * `pageSize` (number, min 1, default 10)
  * `storeId` (number, opcional)
  * `statusId` (number, opcional - `SIT_CODIGO`)
  * `productCode` (string, opcional - `PRO_CODIGO` do item produzido)
  * `productionOrderNumber` (number, opcional - `ORP_NUMERO`)
  * `startDate` (string YYYY-MM-DD, opcional - `ORP_DATA >= ?`)
  * `endDate` (string YYYY-MM-DD, opcional - `ORP_DATA <= ?`)
  * `startDateBaixa` (string YYYY-MM-DD, opcional - `ORP_DATABAIXA >= ?`)
  * `endDateBaixa` (string YYYY-MM-DD, opcional - `ORP_DATABAIXA <= ?`)
* **Retorno HTTP:**
  * Status 200 com array de `ProductionOrderResponseDto` (ou cabeçalhos expostos se `X-Request-Count: true`).

---

### 2.3 Endpoint 2: Detalhe com Itens
`GET /api/v1/production-order/:id`

* **Parâmetros:**
  * `@Param('id', ParseIntPipe) id: number`
  * `@Query() query: GetProductionOrderByIdQueryDto` (opcional: `storeId`)
* **Fluxo de Serviço:**
  1. Busca o cabeçalho consolidado da ordem via `ORP_NUMERO = ?` (respeitando tenant e storeId se fornecido).
  2. Se não existir, lança `NotFoundException('Ordem de produção {id} não encontrada')`.
  3. Busca a lista de insumos/itens em `ORDENSPRODUCAOITENS` ordenada por `OPI_NUMERO ASC`.
  4. Retorna `ProductionOrderDetailResponseDto` ({ ...cabecalho, items: [...] }).

---

## 3. Estrutura de DTOs e Schemas Zod

* `src/modules/production-order/dto/production-order-query.dto.ts`:
  * `ProductionOrderQuerySchema` com `page`, `pageSize`, `storeId`, `statusId`, `productCode`, `productionOrderNumber`, `startDate`, `endDate`, etc.
  * `GetProductionOrderByIdQuerySchema` com `storeId` opcional.
* `src/modules/production-order/dto/production-order-response.dto.ts`:
  * `ProductionOrderResponseDto` contendo todos os campos do cabeçalho com decorators Swagger e examples representativos.
* `src/modules/production-order/dto/production-order-item-response.dto.ts`:
  * `ProductionOrderItemResponseDto` com `OPI_NUMERO`, `PRO_CODIGO`, `PRO_DESCRICAO`, `OPI_PRECO`, `OPI_QTDE`, `OPI_TOTAL`, etc.
* `src/modules/production-order/dto/production-order-detail-response.dto.ts`:
  * `ProductionOrderDetailResponseDto` estendendo ou agregando o cabeçalho com `items: ProductionOrderItemResponseDto[]`.

---

## 4. RBAC, Catálogo e Permissões

### 4.1 Catálogo (`src/infra/rbac/catalog/permissions.catalog.ts`)
Adicionar:
```typescript
  {
    key: 'tenant.production-orders.view',
    descricao: 'Visualizar ordens de produção do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.production-orders.create',
    descricao: 'Criar ordens de produção do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.production-orders.update',
    descricao: 'Atualizar ordens de produção do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.production-orders.delete',
    descricao: 'Deletar ordens de produção do tenant',
    module: 'tenant',
  },
```

### 4.2 Script de Permissões SQL (`PostgreSQL`)
```sql
-- Inserção das novas permissões de Ordens de Produção no catálogo
INSERT INTO "permissions" ("id", "key", "name", "description")
VALUES 
    (gen_random_uuid(), 'tenant.production-orders.view', 'Visualizar ordens de produção do tenant', 'Visualizar ordens de produção do tenant'),
    (gen_random_uuid(), 'tenant.production-orders.create', 'Criar ordens de produção do tenant', 'Criar ordens de produção do tenant'),
    (gen_random_uuid(), 'tenant.production-orders.update', 'Atualizar ordens de produção do tenant', 'Atualizar ordens de produção do tenant'),
    (gen_random_uuid(), 'tenant.production-orders.delete', 'Deletar ordens de produção do tenant', 'Deletar ordens de produção do tenant')
ON CONFLICT ("key") DO UPDATE 
SET "name" = EXCLUDED."name", 
    "description" = EXCLUDED."description";

-- Associação automática ao perfil 'Admin'
INSERT INTO "role_permissions" ("roleId", "permissionId")
SELECT r."id", p."id"
FROM "roles" r
JOIN "permissions" p ON p."key" IN (
    'tenant.production-orders.view',
    'tenant.production-orders.create',
    'tenant.production-orders.update',
    'tenant.production-orders.delete'
)
WHERE r."name" = 'Admin'
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
```

---

## 5. Integração com Frontend / Templates

### 5.1 Landing Page (`src/modules/integration-request/templates/landing.html`)
Adicionar novo Slide Card no carrossel de funcionalidades (`#features-slider`):
* **Ícone:** `bx bx-cog` ou `bx bx-layer`
* **Título:** `Ordens de Produção`
* **Descrição:** `Acompanhamento de ordens de fabricação, status de baixa e insumos consumidos.`
* **Endpoints:**
  * `GET /production-order`: Listar ordens com filtros por período e status
  * `GET /production-order/:id`: Espelho detalhado com insumos utilizados

### 5.2 Formulário de Solicitação (`src/modules/integration-request/templates/form.html`)
* Adicionar a opção no `<select id="scope-module">`:
  `<option value="Ordens de Produção">Ordens de Produção</option>`
* Atualizar o `moduleConfig`:
  `'Ordens de Produção': { read: true, create: false, update: false, delete: false }`

---

## 6. Registro no Swagger e Módulos NestJS

1. Adicionar Tag no `src/config/swagger.ts`:
   `.addTag('Production Order', 'Endpoints relacionados à gestão de ordens de produção e insumos')`
2. Criar `src/modules/production-order/production-order.module.ts`.
3. Registrar `ProductionOrderModule` nos `imports` de `src/app.module.ts`.

---

## 7. Testes e Validação
1. **Testes Unitários:**
   * `production-order.controller.spec.ts`: Testar GET listagem com/sem query e GET por ID com mock do service.
   * `production-order.service.spec.ts`: Testar montagem da query Firebird, filtros dinâmicos, `X-Request-Count` e retorno de itens vinculados.
   * `production-order-query.dto.spec.ts`: Testar validações Zod com cenários válidos e inválidos.
2. **Build e Testes Globais:**
   * `npm run test` (garantir 100% de aprovação de suites).
   * `npm run build`.
   * Atualizar Postman collection via `npm run postman:generate`.

