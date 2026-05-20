# Plano de Implementação: POST e PATCH /products/groups

Este documento descreve o planejamento técnico para a implementação dos endpoints `POST /products/groups` e `PATCH /products/groups/:id` no módulo de produtos da **Info Vendas API**.

---

## 1. Visão Geral

O objetivo é permitir a criação e atualização de grupos de produtos (`grupospro` no banco de dados Firebird de cada tenant) através da API.

Usaremos as seguintes permissões já cadastradas:
* Criar: `'tenant.groups.create'`
* Atualizar: `'tenant.groups.update'`

A arquitetura seguirá o padrão modular NestJS do projeto:
1. Validação via **Zod** nos DTOs de entrada (`CreateGroupDto` e `UpdateGroupDto`).
2. Acesso ao banco Firebird via `TenantConnectionService` utilizando o generator `GEN_CODIGOGRU` para o preenchimento de `GRU_CODIGO`.
3. Tratamento de erro com `NotFoundException` para grupos inexistentes.
4. Cobertura de testes unitários no Service e no Controller.

---

## 2. Alterações Propostas

### 2.1. DTO de Entrada (Criação e Atualização)

#### [NEW] [create-group.dto.ts](file:///c:/dev/infoapi/src/modules/product/group/dto/create-group.dto.ts)
* Criar o arquivo `create-group.dto.ts` dentro de `src/modules/product/group/dto/`.
* Definir o schema Zod `CreateGroupSchema` com a propriedade:
  * `GRU_DESCRICAO`: `z.string().min(1, 'A descrição do grupo não pode ser vazia.').max(40, 'A descrição do grupo deve ter no máximo 40 caracteres.')`
* Criar a classe `CreateGroupDto` estendendo `ZodDto(CreateGroupSchema)` e anotada com `@ApiProperty`.

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateGroupSchema = z.object({
  GRU_DESCRICAO: z
    .string()
    .min(1, 'A descrição do grupo não pode ser vazia.')
    .max(40, 'A descrição do grupo deve ter no máximo 40 caracteres.'),
});

export class CreateGroupDto extends ZodDto(CreateGroupSchema) {
  @ApiProperty({ description: 'Descrição do grupo', example: 'Grupo Novo' })
  GRU_DESCRICAO: string;
}
```

#### [NEW] [update-group.dto.ts](file:///c:/dev/infoapi/src/modules/product/group/dto/update-group.dto.ts)
* Criar o arquivo `update-group.dto.ts` dentro de `src/modules/product/group/dto/`.
* Definir o schema Zod `UpdateGroupSchema` com a propriedade:
  * `GRU_DESCRICAO`: `z.string().min(1).max(40).optional()`
* Criar a classe `UpdateGroupDto` estendendo `ZodDto(UpdateGroupSchema)` e anotada com `@ApiPropertyOptional`.

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const UpdateGroupSchema = z.object({
  GRU_DESCRICAO: z
    .string()
    .min(1, 'A descrição do grupo não pode ser vazia.')
    .max(40, 'A descrição do grupo deve ter no máximo 40 caracteres.')
    .optional(),
});

export class UpdateGroupDto extends ZodDto(UpdateGroupSchema) {
  @ApiPropertyOptional({ description: 'Descrição do grupo', example: 'Grupo Atualizado' })
  GRU_DESCRICAO?: string;
}
```

---

### 2.2. Camada de Serviço

#### [MODIFY] [product-group.service.ts](file:///c:/dev/infoapi/src/modules/product/group/product-group.service.ts)
* Importar os DTOs, `NotFoundException` e `CreateGroupDto`.
* Implementar o método `getById(credentialsId: string, id: number)`:
  * Buscar um único grupo pelo `GRU_CODIGO` da tabela `grupospro`.
* Implementar o método `create(credentialsId: string, data: CreateGroupDto)`:
  * Executar a query SQL de inserção na tabela `grupospro` usando o generator `GEN_CODIGOGRU` para preencher `GRU_CODIGO`.
  * Retornar o registro criado com a cláusula `RETURNING GRU_CODIGO, GRU_DESCRICAO`.
* Implementar o método `update(credentialsId: string, id: number, data: UpdateGroupDto)`:
  * Buscar o grupo pelo ID usando `getById`. Caso não exista, lançar `NotFoundException('Grupo não encontrado')`.
  * Se `data.GRU_DESCRICAO` não for fornecido, retornar o grupo existente sem alterações.
  * Executar a query SQL de atualização: `UPDATE grupospro SET GRU_DESCRICAO = ? WHERE GRU_CODIGO = ?`.
  * Retornar o registro atualizado.

```typescript
  async getById(credentialsId: string, id: number) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
                      M.GRU_CODIGO, M.GRU_DESCRICAO
                      FROM grupospro M 
                      WHERE M.GRU_CODIGO = ?`;
      const params = [id];

      const startTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res[0]);
        });
      })) as any;
      const endTime = Date.now();

      this.logger.log(
        `Busca de grupo por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async create(credentialsId: string, data: CreateGroupDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `INSERT INTO grupospro (
                      GRU_DESCRICAO, GRU_CODIGO
                    ) VALUES (
                      ?, GEN_ID(GEN_CODIGOGRU, 1)
                    ) RETURNING GRU_CODIGO, GRU_DESCRICAO`;

      const params = [data.GRU_DESCRICAO];

      const startTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      })) as any;
      const endTime = Date.now();

      this.logger.log(
        `Grupo de produto criado. Tenant: ${credentialsId}, ID: ${result?.GRU_CODIGO}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async update(credentialsId: string, id: number, data: UpdateGroupDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const group = await this.getById(credentialsId, id);
      if (!group) {
        throw new NotFoundException('Grupo não encontrado');
      }

      if (!data.GRU_DESCRICAO) {
        return group;
      }

      const query = `UPDATE grupospro SET GRU_DESCRICAO = ? WHERE GRU_CODIGO = ?`;
      const params = [data.GRU_DESCRICAO, id];

      const startTime = Date.now();
      await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Grupo de produto atualizado. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return this.getById(credentialsId, id);
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
```

---

### 2.3. Camada de Controle

#### [MODIFY] [product-group.controller.ts](file:///c:/dev/infoapi/src/modules/product/group/product-group.controller.ts)
* Renomear o método `getBrands` para `getGroups` (correção de nomenclatura herdada do módulo de marcas).
* Importar `@Post()`, `@Patch()`, `@Body()`, `@Param()`, `ApiParam`, `CreateGroupDto` e `UpdateGroupDto`.
* Implementar o método `createGroup`:
  * Rota `POST /products/groups`.
  * Proteção: `'tenant.groups.create'`.
* Implementar o método `updateGroup`:
  * Rota `PATCH /products/groups/:id`.
  * Proteção: `'tenant.groups.update'`.

```typescript
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.groups.create'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar grupo de produto',
    description: 'Cria um novo grupo de produto associado ao tenant.',
    tags: ['Product / Group'],
  })
  @ApiResponse({
    status: 201,
    description: 'Grupo criado com sucesso.',
    type: ProductGroupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação ou de requisição.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  async createGroup(
    @Req() req: ReqWithAuthContext,
    @Body() body: CreateGroupDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.groupService.create(credentialsId, body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.groups.update'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar grupo de produto',
    description: 'Atualiza os dados de um grupo de produto existente no tenant.',
    tags: ['Product / Group'],
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Código do grupo (GRU_CODIGO) a ser atualizado',
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo atualizado com sucesso.',
    type: ProductGroupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação ou de requisição.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo não encontrado.',
  })
  async updateGroup(
    @Req() req: ReqWithAuthContext,
    @Param('id') id: number,
    @Body() body: UpdateGroupDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.groupService.update(credentialsId, Number(id), body);
  }
```

---

## 3. Plano de Testes Unitários

### 3.1. Testes do Service

#### [MODIFY] [product-group.service.spec.ts](file:///c:/dev/infoapi/src/modules/product/group/product-group.service.spec.ts)
* Adicionar blocos de testes para `create`, `getById` e `update`:
  * Validar inserção com generator correto.
  * Validar busca por ID existente e inexistente.
  * Validar atualização com sucesso, atualização vazia, e lançamento de exceção `NotFoundException` para ID inexistente.

### 3.2. Testes do Controller

#### [MODIFY] [product-group.controller.spec.ts](file:///c:/dev/infoapi/src/modules/product/group/product-group.controller.spec.ts)
* Registrar `create` e `update` no mock de `ProductGroupService`.
* Adicionar describe blocks para `createGroup` e `updateGroup`.

---

## 4. Plano de Verificação

### Testes Automatizados
* Executar os testes unitários afetados:
  ```bash
  npm.cmd run test src/modules/product/group/product-group.service.spec.ts
  npm.cmd run test src/modules/product/group/product-group.controller.spec.ts
  ```
* Executar a suite inteira para garantir que nada foi quebrado: `npm.cmd run test`.
* Validar formatação das alterações: `npm.cmd run format`.
