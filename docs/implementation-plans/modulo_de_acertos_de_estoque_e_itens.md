# Plano de Implementação: Módulo de Acertos de Estoque e Itens (ACERTOS / ITENSACE)

## Contexto e Objetivo
Implementação do novo módulo `Adjustment` (Acertos de Estoque) no **Info Vendas API**, integrando as tabelas legadas do Firebird `ACERTOS` (cabeçalho) e `ITENSACE` (itens), expondo consultas otimizadas com suporte nativo a cabeçalhos de paginação (`X-Request-Count` e `PaginatedResponse`), retorno detalhado com array aninhado de itens em `GET /api/v1/adjustment/:id` (idêntico ao padrão de `orders/:id`), validações via Zod, controle de acesso RBAC, integração com o formulário de solicitações (`form.html`) com a ação "Ver", e scripts de sincronização de permissões no PostgreSQL.

---

## 1. Arquitetura e Modelagem de Dados

### Tabelas Firebird Envolvidas
1. **`ACERTOS` (Cabeçalho)**:
   - `ACE_NUMERO` (INTEGER NOT NULL, PK)
   - `SIT_CODIGO` (INTEGER NOT NULL)
   - `LOJ_CODIGO` (INTEGER NOT NULL)
   - `USU_CODIGO` (INTEGER NOT NULL)
   - `ACE_DATA` (DATE NOT NULL)
   - `ACE_HORA` (TIME)
   - `ACE_DATABAIXA` (DATE)
   - `ACE_OBS1`, `ACE_OBS2` (VARCHAR(60))
   - `ACE_TOTAL` (NUMERIC(15,2))
   - `ACE_QUANTIDADE` (NUMERIC(15,2))
   - `ACE_DATAALTERACAO` (DATE)
   - `ACE_TIPO` (VARCHAR(1) DEFAULT '1' NOT NULL)
   - `ACE_HORABAIXA` (TIME)
   - `ACE_GEROUFISCO` (VARCHAR(1) DEFAULT 'N')
   - `NTF_NUMERO` (INTEGER)

2. **`ITENSACE` (Itens do Acerto)**:
   - `IAC_NUMERO` (INTEGER NOT NULL, PK)
   - `ACE_NUMERO` (INTEGER NOT NULL, FK)
   - `PRO_CODIGO` (VARCHAR(14) NOT NULL)
   - `IAC_QTDE` (NUMERIC(15,4) NOT NULL)
   - `IAC_PRECO` (NUMERIC(15,4))
   - `IAC_TOTAL` (NUMERIC(15,2))
   - `IAC_TIPOACE` (VARCHAR(1))
   - `IAC_QTDECONTADA` (NUMERIC(15,4))
   - `IAC_ESTATUAL` (NUMERIC(15,4))
   - `IAC_MOTIVO` (VARCHAR(100))
   - `TAM_CODIGO` (VARCHAR(3))
   - `COR_CODIGO` (INTEGER)
   - `PRG_CODIGO` (VARCHAR(14))
   - `IAC_QTDEGRADE` (NUMERIC(18,2) DEFAULT 0)

### JOINs Relevantes
- **Cabeçalho (`ACERTOS A`)**:
  - `LEFT JOIN SITUACAO S ON S.SIT_CODIGO = A.SIT_CODIGO` -> `S.SIT_DESCRICAO`
  - `LEFT JOIN LOJAS L ON L.LOJ_CODIGO = A.LOJ_CODIGO` -> `L.LOJ_NOME`, `L.LOJ_FANTASIA`
  - `LEFT JOIN USUARIOS U ON U.USU_CODIGO = A.USU_CODIGO` -> `U.USU_APELIDO`, `U.USU_APELIDO`
- **Itens (`ITENSACE IA`)**:
  - `INNER JOIN PRODUTOS P ON P.PRO_CODIGO = IA.PRO_CODIGO` -> `P.PRO_DESCRICAO`, `P.PRO_CODIGOBAR`, `P.PRO_UNIDADE`, `P.PRO_REFERENCIA`
  - `LEFT JOIN MARCAS M ON M.MAR_CODIGO = P.MAR_CODIGO` -> `M.MAR_DESCRICAO`
  - `LEFT JOIN GRUPOSPRO G ON G.GRU_CODIGO = P.GRU_CODIGO` -> `G.GRU_DESCRICAO`
  - Variantes/Grade: `IA.TAM_CODIGO`, `IA.COR_CODIGO`, `IA.PRG_CODIGO`, `IA.IAC_QTDEGRADE`

---

## 2. Especificação da API (Endpoints e DTOs)

### 2.1 Rota Base: `/api/v1/adjustment`
- **Segurança**: `@UseGuards(JwtAuthGuard, PermissionsGuard)`
- **Permissão RBAC**: `@RequirePermissions({ allOf: ['tenant.adjustments.view'] })`

### 2.2 Endpoints:

#### 1. `GET /api/v1/adjustment` (Listagem com suporte a cabeçalhos de paginação)
- **Cabeçalho HTTP Opcional**: `X-Request-Count: true` (capturado via decorador `@IncludeCount() includeCount: boolean`)
- **Query Parameters (`AdjustmentQueryDto`)**:
  - `page` (number, default: 1, min: 1)
  - `pageSize` (number, default: 10, min: 1)
  - `storeId` (number, opcional)
  - `statusId` (number, opcional - `SIT_CODIGO`)
  - `type` (string, opcional - `ACE_TIPO`)
  - `userId` (number, opcional - `USU_CODIGO`)
  - `adjustmentNumber` (number, opcional - `ACE_NUMERO`)
  - `startDate` (string YYYY-MM-DD, opcional)
  - `endDate` (string YYYY-MM-DD, opcional)
- **Headers de Resposta Retornados (quando `X-Request-Count: true`)**:
  - `X-Total-Count`: Total de registros encontrados no banco.
  - `X-Total-Pages`: Total de páginas disponíveis.
  - `X-Current-Page`: Página atual solicitada.
  - `X-Per-Page`: Tamanho da página aplicado.
- **Implementação do Serviço**:
  - Executa a query principal: `SELECT FIRST ? SKIP ? ... FROM ACERTOS A ...`
  - Se `includeCount` for `true`, executa a contagem: `SELECT COUNT(*) AS TOTAL FROM ACERTOS A ... ${whereClause}`
  - Retorna `new PaginatedResponse(result, total, page, pageSize)`, que é interceptado pelo `PaginationHeadersInterceptor` global do projeto.

#### 2. `GET /api/v1/adjustment/:id` (Detalhe do Acerto com Itens Aninhados)
- **Path Param**: `id` (`ParseIntPipe`)
- **Query Param**: `storeId` (opcional, para validação multi-loja / tenant)
- **Comportamento**:
  - Busca o registro do cabeçalho em `ACERTOS` com joins de situação, loja e usuário.
  - Se não encontrado, lança `NotFoundException('Acerto <id> não encontrado')`.
  - Busca os itens correspondentes em `ITENSACE` enriquecidos com `PRODUTOS`, `MARCAS` e `GRUPOSPRO`.
  - Retorna o acerto completo com a propriedade `items: [...]` (seguindo exatamente o padrão do endpoint `GET /api/v1/order/:id`).

#### 3. `GET /api/v1/adjustment/:id/items` (Sub-recurso direto)
- **Path Param**: `id` (`ParseIntPipe`)
- **Retorno**: Array direto com os itens de `ITENSACE`.

---

## 3. RBAC, Permissões SQL e Integração com Formulário

### 3.1 Catálogo de Permissões (`src/infra/rbac/catalog/permissions.catalog.ts`)
```typescript
  // ========= ACERTOS DE ESTOQUE =========
  {
    key: 'tenant.adjustments.view',
    descricao: 'Visualizar acertos de estoque do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.adjustments.create',
    descricao: 'Criar acertos de estoque do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.adjustments.update',
    descricao: 'Atualizar acertos de estoque do tenant',
    module: 'tenant',
  },
  {
    key: 'tenant.adjustments.delete',
    descricao: 'Deletar acertos de estoque do tenant',
    module: 'tenant',
  },
```

### 3.2 Script de Sincronização SQL (`prisma/sync_permissions.sql`)
```sql
(gen_random_uuid(), 'tenant.adjustments.view', 'Visualizar acertos de estoque', 'Visualizar acertos de estoque do tenant'),
(gen_random_uuid(), 'tenant.adjustments.create', 'Criar acertos de estoque', 'Criar acertos de estoque do tenant'),
(gen_random_uuid(), 'tenant.adjustments.update', 'Atualizar acertos de estoque', 'Atualizar acertos de estoque do tenant'),
(gen_random_uuid(), 'tenant.adjustments.delete', 'Deletar acertos de estoque', 'Deletar acertos de estoque do tenant')
```

### 3.3 Formulário de Solicitação (`form.html`) e Dicionários
1. **`src/modules/integration-request/templates/form.html`**:
   - `<option value="Acertos">Acertos de Estoque</option>` no `<select id="scope-module">`.
   - Objeto `moduleConfig`:
     ```javascript
     Acertos: { read: true, create: false, update: false, delete: false },
     ```
     *(Garante estritamente apenas a permissão "Ver" habilitada no form).*
2. **`client-core.js` e `admin-core.js`**:
   - Mapear `'adjustments': 'Acertos de Estoque'`, `'acertos': 'Acertos de Estoque'`.

---

## 4. Estrutura de Arquivos a Serem Criados/Modificados

```
src/
├── app.module.ts                                       # [MODIFY] Registrar AdjustmentModule
├── infra/rbac/catalog/permissions.catalog.ts           # [MODIFY] Registrar permissões tenant.adjustments.*
├── modules/
│   ├── adjustment/
│   │   ├── adjustment.module.ts                        # [NEW] Módulo NestJS
│   │   ├── adjustment.controller.ts                    # [NEW] Controller com @IncludeCount(), Swagger e RBAC
│   │   ├── adjustment.service.ts                       # [NEW] Queries Firebird com JOINs, Count e Itens
│   │   ├── adjustment.controller.spec.ts               # [NEW] Testes unitários do controller
│   │   ├── adjustment.service.spec.ts                  # [NEW] Testes unitários do service (incluindo headers/count e items aninhados)
│   │   └── dto/
│   │       ├── adjustment-query.dto.ts                 # [NEW] Schema Zod para filtros de listagem
│   │       ├── adjustment-query.dto.spec.ts            # [NEW] Testes unitários do schema Zod
│   │       ├── adjustment-response.dto.ts              # [NEW] DTO Swagger para retorno do acerto
│   │       ├── adjustment-detail-response.dto.ts       # [NEW] DTO Swagger com acerto + items: []
│   │       └── adjustment-item-response.dto.ts         # [NEW] DTO Swagger para itens de acerto
│   └── integration-request/templates/
│       ├── form.html                                   # [MODIFY] Opção Acertos + flag { read: true }
│       └── assets/
│           ├── client-core.js                          # [MODIFY] Tradução do módulo
│           └── admin-core.js                           # [MODIFY] Tradução do módulo
prisma/
└── sync_permissions.sql                                # [MODIFY] Novas permissões no catálogo SQL
```

---

## 5. Plano de Validação e Testes

1. **Testes Unitários**:
   - `npm test -- adjustment` cobrindo:
     - Retorno de `PaginatedResponse` quando `includeCount = true`.
     - Execução da query de contagem (`SELECT COUNT(*) ...`).
     - `getById` retornando `{ ...adjustment, items: [...] }`.
     - Erro `NotFoundException` quando o acerto não existir.
2. **Validação de DTOs e Schemas Zod**:
   - Testes com `test.each` para validação de tipos e formatos de data.
3. **Build e Lints**:
   - `npm run build`
   - `npm run lint`
4. **Verificação do Form**:
   - Confirmar no HTML/JS que o módulo "Acertos de Estoque" tem apenas o checkbox "Ver" disponível.
