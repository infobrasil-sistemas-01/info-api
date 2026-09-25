# ADR 002: Paginação via Cabeçalhos HTTP (`X-*`) e Contagem Total Opt-in (`X-Request-Count`)

- **Status:** Aceito
- **Data:** 2026-09-25
- **Autores:** Gabriel Bezerra / Time de Engenharia
- **Contexto de Aplicação:** Endpoints de listagem ampla (`GET /products`, `GET /orders`, etc.)

---

## 1. Contexto e Problema

Historicamente, os endpoints de listagem da `info-api` foram concebidos retornando diretamente um array JSON puro de entidades (`[{...}, {...}]`). Embora o backend suportasse paginação técnica (`page` e `pageSize` traduzidos para `FIRST/SKIP` no Firebird), a API **não informava metadados de paginação** aos consumidores (quantos registros existem no total, quantidade total de páginas e página atual).

Com a API em estágio avançado de produção, integradores parceiros, aplicações web e sistemas de retaguarda já consomem diariamente esses endpoints. Isso impôs restrições arquiteturais severas:

1. **Inadmissibilidade de *Breaking Changes*:** Alterar o contrato da resposta para um envelope JSON (ex: `{ data: [...], meta: { total, pages, ... } }`) quebraria sumariamente 100% dos clientes e integrações legadas que esperam um array na raiz do payload.
2. **Inviabilidade de Endpoints Separados de Estatística (`/stats` ou `/count`):** A hipótese inicial de criar um endpoint dedicado para contagem acarretaria:
   - **Duplicação de Round-Trips (RTT = 2):** Forçaria o cliente a orquestrar duas chamadas HTTP para cada transição de tela.
   - **Inconsistência de Dados e Condições de Corrida (*Race Conditions*):** Em cenários concorrentes de inserção/alteração, a contagem retornada no `/stats` divergiria dos dados trazidos pela listagem milissegundos depois.
   - **Sobrecarga de Conexões:** Dobraria o volume de tráfego e o consumo do pool de conexões do banco de dados.
3. **Custo Computacional do `COUNT(*)` no Firebird e PostgreSQL:** Em bases relacionais sob MVCC, `COUNT(*)` com múltiplos `JOIN`s e cláusulas de filtro é uma operação que varre índices/páginas e verifica visibilidade de transações (custo não-O(1)). Executar a contagem obrigatoriamente em todas as chamadas penalizaria o tempo de resposta e o banco para consumidores legados que sequer utilizam paginação estruturada.

---

## 2. Decisão

Decidiu-se adotar uma arquitetura de metadados em **Cabeçalhos HTTP (RFC 8288 / Padrão RESTful)** combinada com ativação **estritamente opt-in** e orquestração desacoplada via **NestJS Interceptors**.

### 2.1. Transporte de Metadados nos Headers de Resposta
O corpo da resposta (`body`) permanece **100% inalterado** (o array JSON original `T[]`). Os metadados de paginação são injetados exclusivamente no cabeçalho HTTP da resposta:
* `X-Total-Count`: Total absoluto de registros encontrados considerando os filtros aplicados.
* `X-Total-Pages`: Quantidade total de páginas calculadas.
* `X-Current-Page`: Página atualmente solicitada e retornada.
* `X-Per-Page`: Limite de registros por página aplicado na consulta.

### 2.2. Contagem Estritamente Opt-in via `X-Request-Count: true`
Para blindar o banco de dados contra *slow queries* desnecessárias, o cálculo do `COUNT(*)` só é acionado se a requisição contiver explicitamente o cabeçalho:
* `X-Request-Count: true` (ou `1`, `yes`, tratado de forma *case-insensitive*).
* Na ausência do cabeçalho ou quando `false`, a query de contagem **não é enviada ao banco de dados**, mantendo o consumo computacional original.

### 2.3. Envelope Interno de Domínio (`PaginatedResponse<T>`)
Para que o serviço consiga entregar dados e metadados ao framework sem misturar HTTP com regras de negócio, criou-se a classe `PaginatedResponse<T>` em `src/common/pagination/paginated-response.ts`.
* O uso explícito de uma `class` (e não de uma `interface`) viabiliza a verificação em tempo de execução via `instanceof PaginatedResponse`, prevenindo o desempacotamento acidental de objetos corporativos que contenham a propriedade legítima `data`.

### 2.4. Interceptor Global de Paginação (`PaginationHeadersInterceptor`)
Criou-se o `PaginationHeadersInterceptor` em `src/common/interceptors/pagination-headers.interceptor.ts`, registrado globalmente no `AppModule`:
1. Intercepta o fluxo de saída da requisição.
2. Identifica instâncias de `PaginatedResponse`.
3. Se `body.total` estiver definido, calcula `totalPages = total === 0 ? 0 : Math.ceil(total / pageSize)` (com salvaguarda de fallback `pageSize = 100` contra divisão por zero) e injeta os headers `X-*` no objeto de resposta nativo.
4. Desempacota transparentemente o payload, retornando apenas `body.data` para o cliente HTTP.

### 2.5. Custom Param Decorator (`@IncludeCount()`)
Criou-se o decorator `@IncludeCount()` em `src/common/decorators/include-count.decorator.ts` para que os controllers recebam um booleano limpo e tipado, sem acoplamento a headers brutos do Express.

### 2.6. Exposição Explícita no CORS (`main.ts`)
Configurou-se `exposedHeaders` no `app.enableCors()` para permitir que aplicações frontend SPA e chamadas de navegador leiam os cabeçalhos `X-Total-Count`, `X-Total-Pages`, `X-Current-Page`, `X-Per-Page` e `X-Api-Version` sem bloqueios de segurança do navegador.

---

## 3. Consequências e Trade-Offs

### Positivas
- **Zero Breaking Changes:** Compatibilidade retroativa absoluta com todas as integrações legadas existentes em produção.
- **Proteção de I/O e CPU do Banco de Dados:** Nenhuma consulta de contagem adicional é disparada sem intenção expressa do cliente (*opt-in*).
- **Consistência e Menor Latência:** Elimina o problema de *race condition* e mantém uma única viagem de rede (RTT = 1) para obtenção de dados e contadores.
- **Separação de Responsabilidades (SRP):** Services cuidam apenas de banco e regras; Controllers cuidam de roteamento; o Interceptor cuida do protocolo HTTP e da apresentação.
- **Documentação Clara:** Todos os novos cabeçalhos de entrada e saída são documentados no Swagger via `@ApiHeader` e `@ApiResponse({ headers })`.

### Negativas / Trade-Offs Aceitos
- **Headers Proprietários vs. Envelope Rico:** Consumidores de APIs modernos frequentemente preferem envelopes no corpo (`{ data, pagination }`). A decisão por cabeçalhos foi um compromisso consciente para não gerar quebra de contrato sem versionamento de rota (`v2`).
- **Necessidade de Separação de Parâmetros SQL nos Services:** Ao implementar em novos módulos, os desenvolvedores devem ter atenção para separar os `filterParams` (aplicáveis à cláusula `WHERE`) dos parâmetros de paginação (`pageSize` e `skip`), garantindo que o Firebird não sofra erro de *parameter mismatch* na query de contagem.
