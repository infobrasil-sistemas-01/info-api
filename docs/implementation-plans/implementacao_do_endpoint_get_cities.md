# Plano de Implementação: Endpoint GET /cities (Municípios)

## 1. Visão Geral
Criação do módulo e endpoint `GET /cities` para consultar municípios a partir da tabela legada `MUNICIPIOS` no Firebird.
O endpoint contará com:
- Paginação (`page`, `pageSize`)
- Busca textual em `MUN_NOME` (com validação de no mínimo 3 caracteres, padrão do projeto)
- Filtro por código de estado (`stateId` mapeado para `EST_CODIGO`)
- Permissão RBAC `tenant.cities.view` incluída no catálogo e nos scripts de sincronização de permissões
- Referência documentada no `POST /clients` e `GET /clients/:id` para facilitar a identificação do código do município (`MUN_CODIGO`)

## 2. DDL da Tabela
```sql
CREATE TABLE MUNICIPIOS (
    MUN_CODIGO  INTEGER NOT NULL,
    MUN_NOME    VARCHAR(40) NOT NULL,
    EST_CODIGO  INTEGER
);
```

## 3. Especificação do Endpoint

### 3.1. Rota e Permissões
- **Rota**: `GET /api/v1/cities`
- **Guards**: `JwtAuthGuard`, `PermissionsGuard`
- **Permissão**: `@RequirePermissions({ allOf: ['tenant.cities.view'] })`
- **Tags Swagger**: `@ApiTags('City')`

### 3.2. Parâmetros de Consulta (`GetCitiesQueryDto`)
- `page` (opcional, número inteiro >= 1, padrão 1)
- `pageSize` (opcional, número inteiro >= 1, padrão 100)
- `search` (opcional, string, mínimo 3 caracteres)
- `stateId` (opcional, número inteiro, filtro por `EST_CODIGO`)

### 3.3. Resposta (`CityResponseDto`)
- `MUN_CODIGO`: número (Código IBGE)
- `MUN_NOME`: string (Nome do município)
- `EST_CODIGO`: número (Código do estado/UF)

## 4. Atualização de Permissões (RBAC)
1. **`src/infra/rbac/catalog/permissions.catalog.ts`**: Adicionar a permissão `tenant.cities.view` associada ao módulo `'tenant'`.
2. **`prisma/sync_permissions.sql`**: Inserir `tenant.cities.view` no script global de sincronização.
3. **`prisma/seed_admin_permissions.sql`**: Inserir na tabela de permissões e vincular à role `Admin`.

## 5. Referência no Módulo de Clientes
1. **`src/modules/client/dto/create-client.dto.ts`**:
   Atualizar a descrição `@ApiProperty` do campo `MUN_CODIGO` para apontar que os códigos válidos podem ser obtidos via `GET /cities`.
2. **`src/modules/client/dto/client-response.dto.ts`**:
   Atualizar a descrição `@ApiPropertyOptional` do campo `MUN_CODIGO` para referenciar `GET /cities`.

## 6. Estrutura de Arquivos a Criar/Modificar
- `src/modules/city/dto/get-cities-query.dto.ts`
- `src/modules/city/dto/city-response.dto.ts`
- `src/modules/city/city.service.ts`
- `src/modules/city/city.controller.ts`
- `src/modules/city/city.module.ts`
- `src/modules/city/dto/get-cities-query.dto.spec.ts`
- `src/modules/city/city.service.spec.ts`
- `src/modules/city/city.controller.spec.ts`
- `src/app.module.ts` (importar `CityModule`)
- `src/infra/rbac/catalog/permissions.catalog.ts`
- `prisma/sync_permissions.sql`
- `prisma/seed_admin_permissions.sql`
- `src/modules/client/dto/create-client.dto.ts`
- `src/modules/client/dto/client-response.dto.ts`

## 7. Critérios de Validação
- Testes unitários com Jest cobrindo DTO, Service e Controller.
- Compilação via `npm run build` sem falhas de tipagem.
- Sem commit ou push automático (o usuário realizará manualmente).
