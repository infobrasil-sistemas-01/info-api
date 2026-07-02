# Plano de Implementação: Endpoint GET /stores & Gestão de Permissões

Este documento descreve os passos, alterações e componentes necessários para implementar o endpoint `GET /stores` que consulta a tabela `LOJAS` no banco de dados Firebird (tenant), e integra o novo escopo/permissão ("Lojas") no sistema de RBAC e no formulário de solicitação de integração.

---

## 1. Escopo e Permissões (RBAC)

Para controlar o acesso ao novo endpoint de forma segura, criaremos a permissão `tenant.stores.view`.

### 1.1. Alteração no Catálogo de Permissões
* **Arquivo:** [permissions.catalog.ts](file:///c:/dev/infoapi/src/infra/rbac/catalog/permissions.catalog.ts)
* **Mudança:** Adicionar a definição da permissão sob o módulo `tenant`:
  ```typescript
  {
    key: 'tenant.stores.view',
    descricao: 'Visualizar lojas do tenant',
    module: 'tenant',
  }
  ```

### 1.2. Scripts SQL de Banco de Dados
Disponibilizaremos o script SQL para inserir a permissão no banco PostgreSQL (onde roda o painel do sistema) e associá-la à role **Admin**.

* **Arquivo:** [sync_permissions.sql](file:///c:/dev/infoapi/prisma/sync_permissions.sql)
  * Adicionar à lista de inserção:
    ```sql
    (gen_random_uuid(), 'tenant.stores.view', 'Visualizar lojas', 'Visualizar lojas do tenant')
    ```
* **Arquivo:** [seed_admin_permissions.sql](file:///c:/dev/infoapi/prisma/seed_admin_permissions.sql)
  * Adicionar à lista de inserção:
    ```sql
    (gen_random_uuid(), 'tenant.stores.view', 'Visualizar lojas do tenant', 'Visualizar lojas do tenant')
    ```
  * Adicionar `'tenant.stores.view'` na lista de `p."key" IN (...)` para vincular ao Admin.

---

## 2. Formulário de Solicitação de Integração

Integraremos o módulo de "Lojas" no fluxo de solicitação de novos clientes para que parceiros possam requerer acesso de leitura sobre essa entidade.

### 2.1. Formulário HTML (Frontend)
* **Arquivo:** [form.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/form.html)
* **Mudanças:**
  1. No select `#scope-module`, adicionar a opção `<option value="Lojas">Lojas</option>`.
  2. No objeto `moduleConfig`, adicionar as permissões permitidas (apenas leitura):
     ```javascript
     Lojas: { read: true, create: false, update: false, delete: false }
     ```

### 2.2. Traduções e Mapeamentos dos Arquivos Core
* **Arquivo:** [client-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/client-core.js)
  * Adicionar no objeto `Translations.modules`: `'stores': 'Lojas'`.
* **Arquivo:** [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)
  * Adicionar no objeto `LABEL_MAP`: `'stores': 'Lojas'`.

---

## 3. Implementação do Módulo Store (GET /stores)

Criaremos a estrutura padrão do NestJS para o módulo `store` no diretório `src/modules/store/`.

### 3.1. DTO de Resposta (Swagger)
* **Caminho:** [store-response.dto.ts](file:///c:/dev/infoapi/src/modules/store/dto/store-response.dto.ts)
* **Campos:**
  * `LOJ_CODIGO` (number): Código identificador da loja
  * `LOJ_NOME` (string): Razão social/Nome da loja
  * `LOJ_FANTASIA` (string): Nome fantasia da loja
  * `LOJ_CNPJ` (string): CNPJ da loja

### 3.2. Store Service
* **Caminho:** [store.service.ts](file:///c:/dev/infoapi/src/modules/store/store.service.ts)
* **Função:** Obter a conexão com o Firebird (tenant), executar a consulta paginada utilizando os parâmetros `page` e `pageSize`, permitindo filtros opcionais por `storeId` e `storeCnpj`, e retornar a listagem com logs de tempo de execução.
* **Consulta SQL:**
  ```sql
  SELECT FIRST ? SKIP ?
  LOJ_CODIGO, LOJ_NOME, LOJ_FANTASIA, LOJ_CNPJ
  FROM lojas loj
  -- Se storeId informado: WHERE loj.loj_codigo = ?
  -- Se storeCnpj informado: [AND/WHERE] loj.loj_cnpj = ?
  ORDER BY loj.loj_codigo
  ```

### 3.3. Store Controller
* **Caminho:** [store.controller.ts](file:///c:/dev/infoapi/src/modules/store/store.controller.ts)
* **Decorators:**
  * `@Controller('stores')`
  * `@UseGuards(JwtAuthGuard, PermissionsGuard)`
  * `@RequirePermissions({ allOf: ['tenant.stores.view'] })`
  * Integração completa com o Swagger (`@ApiBearerAuth()`, `@ApiOperation()`, `@ApiResponse()`, `@ApiQuery()`).
  * Suporte para Query parameters: `page`, `pageSize`, `storeId` (Código da loja), `storeCnpj` (CNPJ da loja).

### 3.4. Store Module & Registro Global
* **Caminho:** [store.module.ts](file:///c:/dev/infoapi/src/modules/store/store.module.ts)
  * Declara `StoreController`, exporta `StoreService`, importa `TenantConnectionModule`.
* **Arquivo:** [app.module.ts](file:///c:/dev/infoapi/src/app.module.ts)
  * Adicionar `StoreModule` na lista de imports do módulo principal.

---

## 4. Testes Unitários

Criaremos testes seguindo os padrões do projeto (uso de mocks, tratamento de erros, testes de edge cases).

* **Arquivos:**
  * `src/modules/store/store.service.spec.ts`
  * `src/modules/store/store.controller.spec.ts`

---

## 5. Plano de Verificação

### Testes Automatizados
- Execução de testes unitários locais:
  ```bash
  npm run test src/modules/store
  ```
- Execução do linter e formatação:
  ```bash
  npm run lint
  npm run format
  ```

### Verificação Manual
1. Iniciar o servidor de desenvolvimento.
2. Acessar a documentação do Swagger em `http://localhost:3000/api/docs` (ou respectivo path) e certificar que o endpoint `GET /stores` está listado com os schemas adequados.
3. Testar a requisição com token JWT válido contendo a permissão `tenant.stores.view`.
4. Validar o retorno da chamada HTTP.
