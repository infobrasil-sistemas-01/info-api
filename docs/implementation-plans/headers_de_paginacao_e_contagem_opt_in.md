# Plano de Implementação: Headers de Paginação e Contagem Opt-in

## Contexto e Objetivo

Atualmente, os endpoints de consulta ampla retornam apenas o array direto de itens (sem informações de total de registros, total de páginas ou página atual). Como a API já possui integradores externos em produção, **não podemos alterar a estrutura do corpo da resposta JSON** (breaking change).

Para solucionar essa limitação com alta eficiência, segurança e elegância arquitetural:
1. Os metadados de paginação serão trafegados via **Headers HTTP** (`X-Total-Count`, `X-Total-Pages`, `X-Current-Page`, `X-Per-Page`).
2. O cálculo da contagem (`COUNT(*)`) será **estritamente opt-in** através do cabeçalho de requisição `X-Request-Count: true`, impedindo sobrecarga de I/O e CPU em clientes legados.
3. A camada de apresentação (desempacotamento de dados e formatação dos headers) será isolada em um **NestJS Interceptor**, sem poluir controllers com `@Res()` e sem expor o banco a queries desnecessárias.
4. As rotas serão documentadas no **Swagger/OpenAPI** e o **CORS** será ajustado no `main.ts` para expor os headers aos clientes de navegador.

---

## Decisões Arquiteturais

| Componente | Decisão | Racional |
| :--- | :--- | :--- |
| **Transporte** | Headers HTTP `X-*` | Preserva retrocompatibilidade do JSON para clientes existentes (RTT = 1). |
| **Ativação** | Header `X-Request-Count: true` | Protege o banco Firebird/PostgreSQL de rodar `COUNT(*)` em 100% das chamadas legadas. |
| **Envelope Interno** | `PaginatedResponse<T>` (`class`) | Permite checagem via `instanceof`, prevenindo que objetos com campo `data` sejam desempacotados por engano. |
| **Extração no Controller** | `@IncludeCount()` Custom Decorator | Normaliza e tipa a leitura do header (`boolean`), eliminando boilerplate em controllers. |
| **Cálculo de Páginas** | No Interceptor | Mantém a responsabilidade matemática e HTTP na camada de apresentação (SRP). Padrão `limit = 100`, `total = 0 => pages = 0`. |
| **CORS** | `exposedHeaders` no `main.ts` | Garante que SPAs e browsers consigam ler os headers `X-*` sem bloqueio de segurança. |

---

## Arquivos e Modificações Propostas

### 1. Camada Comum / Core (Novos Arquivos)

#### [NEW] [paginated-response.ts](file:///c:/dev/info-api/src/common/pagination/paginated-response.ts)
* Classe genérica `PaginatedResponse<T>`:
  ```typescript
  export class PaginatedResponse<T> {
    constructor(
      public readonly data: T[],
      public readonly total?: number,
      public readonly page?: number,
      public readonly pageSize?: number,
    ) {}

    static create<T>(params: {
      data: T[];
      total?: number;
      page?: number;
      pageSize?: number;
    }): PaginatedResponse<T> {
      return new PaginatedResponse(params.data, params.total, params.page, params.pageSize);
    }
  }
  ```

#### [NEW] [include-count.decorator.ts](file:///c:/dev/info-api/src/common/decorators/include-count.decorator.ts)
* Custom Parameter Decorator do NestJS para extrair `X-Request-Count`:
  * Lê `req.headers['x-request-count']`.
  * Trata maiúsculas/minúsculas e strings comuns (`'true'`, `'1'`).
  * Retorna `true` se solicitado, ou `false` caso ausente/inválido.

#### [NEW] [pagination-headers.interceptor.ts](file:///c:/dev/info-api/src/common/interceptors/pagination-headers.interceptor.ts)
* Interceptor global ou modular:
  * Inspeciona o retorno com `data instanceof PaginatedResponse`.
  * Se for instância de `PaginatedResponse`:
    * Se `data.total !== undefined`:
      * Calcula `pageSize = data.pageSize && data.pageSize > 0 ? data.pageSize : 100`.
      * Calcula `totalPages = data.total === 0 ? 0 : Math.ceil(data.total / pageSize)`.
      * `res.setHeader('X-Total-Count', String(data.total))`.
      * `res.setHeader('X-Total-Pages', String(totalPages))`.
      * `res.setHeader('X-Current-Page', String(data.page || 1))`.
      * `res.setHeader('X-Per-Page', String(pageSize))`.
    * Retorna para o cliente apenas `data.data` (desempacotamento seguro do array original).
  * Se não for instância de `PaginatedResponse`, devolve a resposta intacta.

---

### 2. Configuração Global e Infraestrutura

#### [MODIFY] [main.ts](file:///c:/dev/info-api/src/main.ts)
* Atualizar `app.enableCors()`:
  ```typescript
  app.enableCors({
    exposedHeaders: [
      'X-Total-Count',
      'X-Total-Pages',
      'X-Current-Page',
      'X-Per-Page',
      'X-Api-Version',
    ],
  });
  ```
* Registrar o interceptor globalmente via `app.useGlobalInterceptors(new PaginationHeadersInterceptor())`.

---

### 3. Módulo Piloto: Produtos (Exemplo de Integração)

#### [MODIFY] [product.controller.ts](file:///c:/dev/info-api/src/modules/product/product.controller.ts)
* Injetar o decorator `@IncludeCount() includeCount: boolean` no método `getProducts()`.
* Adicionar documentação OpenAPI/Swagger:
  * `@ApiHeader({ name: 'X-Request-Count', required: false, description: 'Quando "true", calcula e retorna os headers de paginação (X-Total-Count, X-Total-Pages, etc.)' })`
  * Descrever os headers na resposta 200 do Swagger.
* Passar `includeCount` para `this.productService.get(...)`.

#### [MODIFY] [product.service.ts](file:///c:/dev/info-api/src/modules/product/product.service.ts)
* Aceitar `includeCount?: boolean` no método `get`.
* Se `includeCount === true`:
  * Executar a query de dados e a query de contagem (`COUNT(*)`) com as mesmas condições de filtro.
  * Retornar `new PaginatedResponse(products, total, page, pageSize)`.
* Se `includeCount === false` ou omitido:
  * Executar apenas a query normal de dados (`LIMIT/OFFSET` ou `FIRST/SKIP`).
  * Retornar `new PaginatedResponse(products)`.

---

### 4. Testes Automatizados

#### [NEW] [pagination-headers.interceptor.spec.ts](file:///c:/dev/info-api/src/common/interceptors/pagination-headers.interceptor.spec.ts)
* Testar quando a resposta é `PaginatedResponse` com total:
  * Valida injeção dos 4 headers `X-*`.
  * Valida cálculo de `totalPages` para total = 0 (deve retornar 0).
  * Valida cálculo de `totalPages` com fallback de limit quando não fornecido.
  * Valida se o body final retornado é estritamente o array puro (`data.data`).
* Testar quando a resposta é `PaginatedResponse` sem total (`includeCount = false`):
  * Valida que nenhum header `X-Total-*` é injetado.
  * Valida que o body final é desempacotado para o array puro.
* Testar quando a resposta é um objeto comum (ex: `{ data: '2026-09-25' }` ou entidade simples):
  * Valida que o objeto não é alterado e nenhum header de paginação é inserido.

#### [NEW] [include-count.decorator.spec.ts](file:///c:/dev/info-api/src/common/decorators/include-count.decorator.spec.ts)
* Testar extração com `'true'`, `'TRUE'`, `'1'`, `'false'`, `undefined`.

---

## Verificação e Validação

1. **Testes Unitários:** Executar `npm run test` cobrindo o interceptor, decorator e o serviço de produtos.
2. **Lint & Formatação:** Executar `npm run lint` e `npm run format`.
3. **Build:** Executar `npm run build` para garantir conformidade de tipagem TypeScript.
4. **Verificação Swagger:** Acessar a documentação gerada e validar a visibilidade do header `X-Request-Count` e dos headers de resposta.
