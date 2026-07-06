# Plano de Implementação - Inserção de Entregas (POST /deliveries)

Implementação do service e controller para a inserção de entregas (`entregas`) e seus respectivos itens (`entregasitens`) no banco de dados Firebird do tenant correspondente, respeitando o controle de acessos por meio de RBAC e validações robustas com DTOs baseados em Zod.

## User Review Required

> [!NOTE]
> Foi verificado no banco de dados e nos arquivos de permissões que a permissão `tenant.deliveries.create` já existe e está devidamente mapeada tanto em `src/infra/rbac/catalog/permissions.catalog.ts` quanto no script de sincronização `prisma/sync_permissions.sql`.

> [!IMPORTANT]
> Nome dos Geradores (Generators) do Firebird:
> Conforme o padrão mapeado no ERP (ex: `vendas.VEN_NUMERO` usa `GEN_NUMEROVEN`, `itensven.IVD_NUMERO` usa `GEN_NUMEROIVD`), assumimos e utilizaremos:
> - `GEN_NUMEROENT` para a tabela `entregas` (campo `ENT_NUMERO`)
> - `GEN_NUMEROETI` para a tabela `entregasitens` (campo `ETI_NUMERO`)

## Proposed Changes

---

### DTOs (Data Transfer Objects)

Criaremos o DTO de criação de entregas em um novo arquivo com suporte para validação Zod.

#### [NEW] [create-delivery.dto.ts](file:///c:/dev/infoapi/src/modules/delivery/dto/create-delivery.dto.ts)
- Definição do schema Zod `CreateDeliverySchema` e da classe `CreateDeliveryDto` que estende `ZodDto`.
- Definição de `CreateDeliveryItemSchema` e `CreateDeliveryItemDto` para inserção opcional de itens.
- Inclusão dos campos de entrega do cabeçalho e detalhe:
  - `VEN_NUMERO` (obrigatório)
  - `PRE_CODIGO` (opcional)
  - `SIT_CODIGO` (opcional, padrão `1`)
  - `USU_CODIGO` (opcional, padrão `9999`)
  - `ENT_DATA` (opcional, padrão data atual `YYYY-MM-DD`)
  - `ENT_HORA` (opcional, padrão hora atual `HH:mm:ss`)
  - `ENT_KILOMETRAGEM` (opcional)
  - `VEI_PLACA` (opcional)
  - `ENT_OBS` (opcional)
  - `ENT_IMPRIMIR` (opcional, padrão `'S'`)
  - `AJU_CODIGO` (opcional)
  - `TBS_CODIGO` (opcional)
  - `AJA_CODIGO` (opcional)
  - `ENT_LOTEENTREGA` (opcional)
  - `SEP_CODIGO` (opcional)
  - `ENT_LOTEPRODUTO` (opcional)
  - `ENT_GERARROTAS` (opcional, padrão `'N'`)
  - `AJ2_CODIGO` (opcional)
  - `items` (opcional, array de itens da entrega contendo `IVD_NUMERO`, `PRO_CODIGO`, `ETI_QTDE`, `ETI_QTDECLIENTE`, `ETI_IMPRIMIR`, `USU_CODIGO`)

---

### Service Layer

#### [MODIFY] [delivery.service.ts](file:///c:/dev/infoapi/src/modules/delivery/delivery.service.ts)
- Implementação do método `create(credentialsId: string, data: CreateDeliveryDto)`.
- Uso de transações nativas do Firebird (`connection.startTransaction`) para garantir atomicidade ao salvar o cabeçalho da entrega e seus itens.
- Rollback automático em caso de qualquer erro e liberação correta da conexão (`releaseConnection`).
- Retorno da entrega recém-criada detalhada.

---

### Controller Layer

#### [MODIFY] [delivery.controller.ts](file:///c:/dev/infoapi/src/modules/delivery/delivery.controller.ts)
- Adicionar o decorator `@Post()` com a rota padrão `/deliveries`.
- Uso do guard `@RequirePermissions({ allOf: ['tenant.deliveries.create'] })` para segurança.
- Mapeamento das propriedades do Swagger com decorators do NestJS Swagger.
- Chamada do service passando o `credentialsId` extraído do contexto de autenticação JWT e o body validado.

---

### Unit Tests

#### [MODIFY] [delivery.service.spec.ts](file:///c:/dev/infoapi/src/modules/delivery/delivery.service.spec.ts)
- Adicionar testes de unidade para o método `create` do `DeliveryService` cobrindo cenários de sucesso (com e sem itens) e cenários de falha (erro na query, rollback da transação).

#### [MODIFY] [delivery.controller.spec.ts](file:///c:/dev/infoapi/src/modules/delivery/delivery.controller.spec.ts)
- Adicionar testes de unidade para validar a chamada ao endpoint `POST /deliveries` garantindo que passa os dados corretamente ao service e respeita as validações/permissões.

---

## Verification Plan

### Automated Tests
- Execução do comando de testes unitários:
  ```bash
  npm.cmd test src/modules/delivery/
  ```
- Validação estática com linter/formatter:
  ```bash
  npm.cmd run lint
  npm.cmd run format
  ```
