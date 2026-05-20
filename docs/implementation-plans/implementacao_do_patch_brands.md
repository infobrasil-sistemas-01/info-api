# Plano de Implementação: PATCH /products/brands/:id

Este documento descreve o planejamento técnico para a implementação do endpoint `PATCH /products/brands/:id` no módulo de produtos da **Info Vendas API**.

---

## 1. Visão Geral

O objetivo é permitir a atualização de marcas de produtos existentes (`marcas` no banco de dados Firebird de cada tenant) através da API. Usaremos a permissão de atualização de marcas já existente: `'tenant.brands.update'`.

A arquitetura seguirá o padrão modular do NestJS do projeto, com validação via **Zod** no DTO de entrada (`UpdateBrandDto`), acesso ao banco Firebird via `TenantConnectionService`, tratamento de erro com `NotFoundException` caso a marca não exista, e testes unitários no Service e no Controller.

---

## 2. Alterações Propostas

### 2.1. DTO de Entrada (Novo)

#### [NEW] [update-brand.dto.ts](file:///c:/dev/infoapi/src/modules/product/brand/dto/update-brand.dto.ts)
* Criar o arquivo `update-brand.dto.ts` dentro de `src/modules/product/brand/dto/`.
* Definir o schema Zod `UpdateBrandSchema` com o campo opcional:
  * `MAR_DESCRICAO`: `z.string().min(1).max(40).optional()` (descrição da marca).
* Criar a classe `UpdateBrandDto` estendendo `ZodDto(UpdateBrandSchema)` e anotada com `@ApiPropertyOptional`.

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const UpdateBrandSchema = z.object({
  MAR_DESCRICAO: z
    .string()
    .min(1, 'A descrição da marca não pode ser vazia.')
    .max(40, 'A descrição da marca deve ter no máximo 40 caracteres.')
    .optional(),
});

export class UpdateBrandDto extends ZodDto(UpdateBrandSchema) {
  @ApiPropertyOptional({ description: 'Descrição da marca', example: 'Marca Atualizada' })
  MAR_DESCRICAO?: string;
}
```

---

### 2.2. Camada de Serviço

#### [MODIFY] [product-brand.service.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.service.ts)
* Importar o `UpdateBrandDto` e `NotFoundException`.
* Implementar o método `getById(credentialsId: string, id: number)`:
  * Obter conexão e buscar uma única marca por `MAR_CODIGO`.
* Implementar o método `update(credentialsId: string, id: number, data: UpdateBrandDto)`:
  * Buscar a marca pelo ID usando `getById`. Caso não exista, lançar `NotFoundException('Marca não encontrada')`.
  * Se `data.MAR_DESCRICAO` não for fornecido, retornar a marca existente sem alterações.
  * Executar a query SQL de atualização: `UPDATE marcas SET MAR_DESCRICAO = ? WHERE MAR_CODIGO = ?`.
  * Retornar o registro atualizado.

```typescript
  async getById(credentialsId: string, id: number) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `SELECT 
                      M.MAR_CODIGO, M.MAR_DESCRICAO
                      FROM marcas M 
                      WHERE M.MAR_CODIGO = ?`;
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
        `Busca de marca por ID executada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }

  async update(credentialsId: string, id: number, data: UpdateBrandDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const brand = await this.getById(credentialsId, id);
      if (!brand) {
        throw new NotFoundException('Marca não encontrada');
      }

      if (!data.MAR_DESCRICAO) {
        return brand;
      }

      const query = `UPDATE marcas SET MAR_DESCRICAO = ? WHERE MAR_CODIGO = ?`;
      const params = [data.MAR_DESCRICAO, id];

      const startTime = Date.now();
      await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
      const endTime = Date.now();

      this.logger.log(
        `Marca de produto atualizada. Tenant: ${credentialsId}, ID: ${id}, Tempo SQL: ${
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

#### [MODIFY] [product-brand.controller.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.controller.ts)
* Importar `@Patch`, `@Param`, `UpdateBrandDto` e `ApiParam`.
* Adicionar a rota `@Patch(':id')`.
* Proteger a rota usando `@UseGuards(JwtAuthGuard, PermissionsGuard)` e decorar com `@RequirePermissions({ allOf: ['tenant.brands.update'] })`.
* Adicionar anotações Swagger adequadas (`@ApiOperation`, `@ApiParam`, `@ApiResponse`).
* Chamar o método `update` do service passando o `credentialsId`, o `id` e o `body`.

```typescript
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.brands.update'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar marca de produto',
    description: 'Atualiza os dados de uma marca de produto existente no tenant.',
    tags: ['Product / Brand'],
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Código da marca (MAR_CODIGO) a ser atualizada',
  })
  @ApiResponse({
    status: 200,
    description: 'Marca atualizada com sucesso.',
    type: ProductBrandResponseDto,
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
    description: 'Marca não encontrada.',
  })
  async updateBrand(
    @Req() req: ReqWithAuthContext,
    @Param('id') id: number,
    @Body() body: UpdateBrandDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.brandService.update(credentialsId, Number(id), body);
  }
```

---

## 3. Plano de Testes Unitários

### 3.1. Testes do Service

#### [MODIFY] [product-brand.service.spec.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.service.spec.ts)
* Importar `UpdateBrandDto` e `NotFoundException`.
* Adicionar um bloco `describe('getById', () => { ... })`:
  * Validar busca por ID com sucesso.
* Adicionar um bloco `describe('update', () => { ... })`:
  * **Caso de sucesso:** Deve atualizar a marca com sucesso e retornar o objeto atualizado.
  * **Caso de não encontrada:** Deve lançar `NotFoundException` se a marca não existir.

### 3.2. Testes do Controller

#### [MODIFY] [product-brand.controller.spec.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.controller.spec.ts)
* Atualizar o mock do `ProductBrandService` para incluir os métodos `getById` e `update`.
* Adicionar um bloco `describe('updateBrand', () => { ... })`:
  * **Caso de sucesso:** Deve chamar o service com os parâmetros corretos (`credentialsId`, `id` e DTO) e retornar o objeto atualizado.

---

## 4. Plano de Verificação

### Testes Automatizados
* Executar os testes unitários afetados:
  ```bash
  npm.cmd run test src/modules/product/brand/product-brand.service.spec.ts
  npm.cmd run test src/modules/product/brand/product-brand.controller.spec.ts
  ```
* Executar todos os testes unitários da API.
