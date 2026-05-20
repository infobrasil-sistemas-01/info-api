# Plano de Implementação: POST /products/brands

Este documento descreve o planejamento técnico para a implementação do endpoint `POST /products/brands` no módulo de produtos da **Info Vendas API**.

---

## 1. Visão Geral

O objetivo é permitir a criação de novas marcas de produtos (`marcas` no banco de dados Firebird de cada tenant) através da API. Usaremos a permissão de criação de marcas já existente: `'tenant.brands.create'`.

A arquitetura seguirá o padrão modular do NestJS do projeto, com validação via **Zod** no DTO de entrada, acesso ao banco Firebird via `TenantConnectionService`, e cobertura de testes unitários tanto no Service quanto no Controller.

---

## 2. Alterações Propostas

### 2.1. DTO de Entrada (Novo)

#### [NEW] [create-brand.dto.ts](file:///c:/dev/infoapi/src/modules/product/brand/dto/create-brand.dto.ts)
* Criar a pasta `dto` dentro de `src/modules/product/brand/`.
* Criar o arquivo `create-brand.dto.ts`.
* Definir o schema Zod `CreateBrandSchema` com o campo:
  * `MAR_DESCRICAO`: `z.string().min(1).max(40)` (descrição da marca).
* Criar a classe `CreateBrandDto` estendendo `ZodDto(CreateBrandSchema)` e anotada com `@ApiProperty` para a documentação do Swagger.

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { ZodDto } from 'src/common/validation/zod-dto';
import { z } from 'zod';

export const CreateBrandSchema = z.object({
  MAR_DESCRICAO: z.string().min(1, 'A descrição da marca é obrigatória.').max(40, 'A descrição da marca deve ter no máximo 40 caracteres.'),
});

export class CreateBrandDto extends ZodDto(CreateBrandSchema) {
  @ApiProperty({ description: 'Descrição da marca', example: 'Marca Exemplo' })
  MAR_DESCRICAO: string;
}
```

---

### 2.2. Camada de Serviço

#### [MODIFY] [product-brand.service.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.service.ts)
* Importar o `CreateBrandDto`.
* Implementar o método `create(credentialsId: string, data: CreateBrandDto)`:
  * Obter conexão do tenant via `tenantConnectionService.getConnection(credentialsId)`.
  * Executar a query SQL de inserção na tabela `marcas` usando o generator `GEN_CODIGOMAR` para preencher `MAR_CODIGO`.
  * Usar a cláusula `RETURNING MAR_CODIGO, MAR_DESCRICAO` para obter o registro inserido diretamente do Firebird.
  * Liberar a conexão no bloco `finally` via `tenantConnectionService.releaseConnection(connection)`.

```typescript
  async create(credentialsId: string, data: CreateBrandDto) {
    const connection =
      await this.tenantConnectionService.getConnection(credentialsId);

    try {
      const query = `INSERT INTO marcas (
                      MAR_DESCRICAO, MAR_CODIGO
                    ) VALUES (
                      ?, GEN_ID(GEN_CODIGOMAR, 1)
                    ) RETURNING MAR_CODIGO, MAR_DESCRICAO`;

      const params = [data.MAR_DESCRICAO];

      const startTime = Date.now();
      const result = (await new Promise((resolve, reject) => {
        connection.query(query, params, (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      })) as any;
      const endTime = Date.now();

      this.logger.log(
        `Marca de produto criada. Tenant: ${credentialsId}, ID: ${result?.MAR_CODIGO}, Tempo SQL: ${
          endTime - startTime
        }ms`,
      );

      return result;
    } finally {
      this.tenantConnectionService.releaseConnection(connection);
    }
  }
```

---

### 2.3. Camada de Controle

#### [MODIFY] [product-brand.controller.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.controller.ts)
* Importar `@Post`, `@Body`, `CreateBrandDto` e `ProductBrandResponseDto`.
* Adicionar a rota `@Post()`.
* Proteger a rota usando `@UseGuards(JwtAuthGuard, PermissionsGuard)` (que já estão em uso na classe) e decorar com `@RequirePermissions({ allOf: ['tenant.brands.create'] })`.
* Adicionar anotações Swagger adequadas (`@ApiOperation`, `@ApiResponse`).
* Chamar o método `create` do service passando o `credentialsId` e o `body`.

```typescript
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.brands.create'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar marca de produto',
    description: 'Cria uma nova marca de produto associada ao tenant.',
    tags: ['Product / Brand'],
  })
  @ApiResponse({
    status: 201,
    description: 'Marca criada com sucesso.',
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
  async createBrand(
    @Req() req: ReqWithAuthContext,
    @Body() body: CreateBrandDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.brandService.create(credentialsId, body);
  }
```

---

### 2.4. Módulo de Produtos

* O arquivo [product.module.ts](file:///c:/dev/infoapi/src/modules/product/product.module.ts) não precisa ser modificado, pois `ProductBrandController` e `ProductBrandService` já estão devidamente declarados em `controllers` e `providers`.

---

## 3. Plano de Testes Unitários

### 3.1. Testes do Service

#### [MODIFY] [product-brand.service.spec.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.service.spec.ts)
* Adicionar um bloco `describe('create', () => { ... })` para testar o método `create`:
  * **Caso de sucesso:** Deve inserir uma nova marca com sucesso e retornar o objeto criado.
  * **Caso de erro:** Deve propagar a exceção gerada pela falha de conexão ou erro do banco de dados.

### 3.2. Testes do Controller

#### [MODIFY] [product-brand.controller.spec.ts](file:///c:/dev/infoapi/src/modules/product/brand/product-brand.controller.spec.ts)
* Atualizar o mock do `ProductBrandService` para incluir o método `create`.
* Adicionar um bloco `describe('createBrand', () => { ... })` para testar o método `createBrand`:
  * **Caso de sucesso:** Deve chamar o service com os parâmetros corretos (`credentialsId` e DTO) e retornar o objeto da marca criada.

---

## 4. Plano de Verificação

### Testes Automatizados
* Executar os testes unitários afetados:
  ```bash
  npm run test src/modules/product/brand/product-brand.service.spec.ts
  npm run test src/modules/product/brand/product-brand.controller.spec.ts
  ```
* Executar todos os testes unitários do projeto para garantir que nenhuma regressão foi introduzida:
  ```bash
  npm run test
  ```
