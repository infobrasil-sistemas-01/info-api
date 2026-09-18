# Plano de Implementação: Arquitetura H2M com STS Desacoplado e Adaptação da INFOAPI

Este documento estabelece o plano detalhado de implementação para suportar o fluxo de autenticação **H2M (Human-to-Machine)** com o **STS (Security Token Service)** central, mantendo a compatibilidade estrita com o fluxo **M2M (Machine-to-Machine)** existente.

> [!IMPORTANT]
> **DIRETRIZ DE EXECUÇÃO PASSO A PASSO**:
> Cada fase e cada passo abaixo serão executados **estritamente de forma isolada**. 
> Para cada passo, será apresentada uma explicação minuciosa do que foi alterado/adicionado, acompanhada de testes e validação, **aguardando ajustes e aprovação explícita do usuário** antes de avançar para o próximo passo.

---

## 1. Pré-Requisitos e Especificação dos Componentes

### 1.1. Banco Tenant (Firebird)
Estrutura necessária na base de dados de cada cliente:
1. **Tabela `USUARIOS`**:
   * **Nova Coluna**: `USU_SENHA_API VARCHAR(100)`
     * Armazena o hash `bcrypt` da senha do usuário para acesso via API/Web.
     * Nullable para permitir migração gradativa.
   * **Colunas Existentes Utilizadas**:
     * `USU_CODIGO` (INTEGER): Código do operador.
     * `USU_APELIDO` (VARCHAR): Login/Apelido do operador para autenticação.
     * `USU_SITUACAO` (CHAR(1)): Situação do usuário ('A' = Ativo).
     * `LOJ_CODIGO` (INTEGER): Loja de lotação do usuário.
     * `FUN_CODIGO` (INTEGER): Vínculo com a tabela de funcionários.
2. **Tabela `FUNCIONARIOS`**:
   * `FUN_CODIGO` (INTEGER): Identificador do funcionário.
   * `FUN_DATADEMISSAO` (DATE / TIMESTAMP): Data de rescisão/demissão. Se preenchida, o operador é considerado inativo.

---

### 1.2. Serviço STS: `info-api-sts` (Novo Repositório no Workspace)
O serviço central de autenticação será desenvolvido no diretório irmão `c:\dev\info-api-sts`.

* **Stack Tecnológica**:
  * **Framework**: NestJS + TypeScript
  * **ORM**: PrismaORM com PostgreSQL (banco próprio do STS)
  * **Porta Padrão (`PORT`)**: `3001` (para não colidir com a porta `3000` da `info-api`)
* **Banco Central (PostgreSQL do STS - Zero Firebird)**:
  * **Tabela `tenants`**:
    * `id` (UUID, PK)
    * `slug` (VARCHAR, UNIQUE): Subdomínio do cliente (ex: `empresa_a`).
    * `name` (VARCHAR): Razão social / Nome fantasia.
    * `credentials_id` (UUID): Identificador correspondente ao tenant no banco Registry da INFOAPI.
    * `info_api_url` (VARCHAR): URL base da INFOAPI (ex: `http://localhost:3000/api/v1`).
    * `m2m_client_id` e `m2m_client_secret` (ou Basic Auth): Credenciais M2M do tenant para o STS chamar a INFOAPI.
    * `status` (BOOLEAN): Ativo/Inativo.
  * **Tabela `refresh_tokens`**:
    * `id` (UUID, PK)
    * `token_hash` (VARCHAR): Hash SHA-256 do refresh token emitido.
    * `tenant_id` (UUID, FK -> tenants.id)
    * `usu_codigo` (INTEGER)
    * `fun_codigo` (INTEGER)
    * `store_id` (INTEGER)
    * `expires_at` (TIMESTAMP)
    * `revoked_at` (TIMESTAMP, Nullable)
    * `created_at` (TIMESTAMP)
    * `user_agent` (VARCHAR), `ip_address` (VARCHAR)

* **Criptografia e Par de Chaves RSA (RS256)**:
  * Chave Privada (`PRIVATE_KEY` RSA 2048/4096 bits): Utilizada exclusivamente pelo STS para assinar os tokens JWT.
  * Chave Pública (`PUBLIC_KEY` RSA): Exposta via endpoint `GET /.well-known/jwks.json` e compartilhada com a INFOAPI.

* **Endpoints do STS**:
  * `POST /auth/login`:
    * Recebe `{ tenantSlug, username, password }`.
    * Resolve o tenant e suas credenciais M2M.
    * Delega verificação para a INFOAPI: `POST /api/v1/auth/operator-verify` (via M2M).
    * Recebe `{ valid: true, usuCodigo: 104, funCodigo: 104, storeId: 1 }`.
    * Emite Access Token RS256 (TTL: 15 min) contendo:
      ```json
      {
        "sub": "104",
        "iss": "infovendas-sts",
        "credentialsId": "a1b2c3d4-...",
        "storeId": 1,
        "usu_codigo": 104,
        "fun_codigo": 104,
        "type": "H2M"
      }
      ```
    * Emite Refresh Token persistido no Postgres (TTL: 30 dias).
  * `POST /auth/refresh`:
    * Recebe `{ refreshToken }`.
    * Consulta status na INFOAPI: `GET /api/v1/auth/operator-status/:usuCodigo`.
    * Se ativo, rotaciona o Refresh Token e emite novo Access Token RS256.
  * `POST /auth/logout`: Revoga o Refresh Token no Postgres.
  * `GET /.well-known/jwks.json`: Chave pública para validação de clientes e APIs.

---

## 2. Ordem de Execução das Fases

```text
┌────────────────────────────────────────────────────────────────────────┐
│ FASE A: Implementação do Serviço Central STS (info-api-sts)           │
├────────────────────────────────────────────────────────────────────────┤
│ Passo A1: Setup do NestJS + PrismaORM + Env (Porta 3001)               │
│ Passo A2: Modelagem Prisma (Tenants e RefreshTokens) e Migrações       │
│ Passo A3: Módulo Criptográfico RSA (Geração de Chaves e Assinatura)    │
│ Passo A4: Endpoints de Login, Refresh, Logout e JWKS                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ FASE B: Adaptação e Blindagem da INFOAPI (info-api)                    │
├────────────────────────────────────────────────────────────────────────┤
│ Passo B1: Configuração de Ambiente (STS_PUBLIC_KEY e STS_ISSUER)       │
│ Passo B2: Estratégia Dual de Auth (RS256 H2M + HS256 M2M)              │
│ Passo B3: Endpoints de Verificação do Operador (/operator-verify)      │
│ Passo B4: Adaptação de Domínio (Preço por Loja em Produtos e Pedidos)   │
│ Passo B5: Testes Automatizados (Unitários e E2E) e Integração Final    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detalhamento dos Passos

### FASE A: Repositório `info-api-sts`

#### Passo A1: Setup do Projeto e Variáveis de Ambiente
* Inicialização do projeto NestJS no diretório `c:\dev\info-api-sts`.
* Configuração do schema de ambiente (Zod):
  * `PORT=3001`
  * `DATABASE_URL` (Postgres do STS)
  * `RSA_PRIVATE_KEY` e `RSA_PUBLIC_KEY`
  * `JWT_EXPIRES_IN=15m`, `REFRESH_TOKEN_DAYS=30`

#### Passo A2: Modelagem Prisma e Migrações
* Criação de `prisma/schema.prisma` com os modelos `Tenant` e `RefreshToken`.
* Execução das migrações e seed inicial para testes.

#### Passo A3: Módulo de Criptografia RSA
* Geração do par de chaves RSA 2048 bits.
* Serviço de assinatura RS256 e endpoint `GET /.well-known/jwks.json`.

#### Passo A4: Endpoints de Autenticação
* `POST /auth/login` integrando a chamada HTTP de verificação à INFOAPI.
* `POST /auth/refresh` com checagem de status na INFOAPI e rotação de refresh token.
* `POST /auth/logout` com revogação no banco.

---

### FASE B: Repositório `info-api`

#### Passo B1: Configuração de Variáveis de Ambiente
* Arquivos: `src/config/env/env.schema.ts`, `.env.example`.
* Inclusão de `STS_PUBLIC_KEY` e `STS_ISSUER`.

#### Passo B2: Estratégia Dual de Autenticação
* Arquivos: `src/modules/auth/strategies/jwt-h2m.strategy.ts`, `jwt-auth.guard.ts`.
* Configuração explícita de `algorithms: ['RS256']` (blindagem contra *Algorithm Confusion*).
* Padronização do `AuthenticatedUserContext` no `request.user`.

#### Passo B3: Endpoints de Verificação de Operador
* Arquivos: `src/modules/auth/auth.controller.ts`, `auth.service.ts`.
* `POST /api/v1/auth/operator-verify`: Recebe login/senha, valida `USU_SENHA_API` no Firebird e retorna dados do operador.
* `GET /api/v1/auth/operator-status/:usuCodigo`: Checagem rápida de bloqueio/demissão no Firebird.

#### Passo B4: Adaptação dos Módulos de Produtos e Pedidos
* Arquivos: `src/modules/product/`, `src/modules/order/`.
* Produtos: filtrar e aplicar tabela de preços pela loja do operador (`storeId`).
* Pedidos: gravar `USU_CODIGO`, `FUN_CODIGO` e `LOJ_CODIGO` do token H2M (ou `9999` para M2M).

#### Passo B5: Cobertura de Testes e Validação Final
* Testes unitários para ambas as estratégias e use-cases.
* Validação de ponta a ponta entre `info-api-sts` e `info-api`.

---

## 4. Relatório de Execução e Homologação E2E (Concluído)

### Resultados da Validação E2E (`scripts/test-e2e-auth.js`)
1. **Passo 1 (STS Login - H2M)**:
   * Requisição: `POST http://localhost:3001/auth/login` (`INFO-MOBILE` / `123456`).
   * Chamada interna: `POST http://host.docker.internal:3339/api/v1/auth/operator-verify` autenticada via Basic Auth M2M do Tenant.
   * Validação Firebird: Usuário ativo verificado, senha conferida via `bcrypt`.
   * **Resultado**: `200 OK` - Token de acesso assimétrico **RS256** assinado pelo STS + Refresh Token rotativo persistido no PostgreSQL.
2. **Passo 2 (INFOAPI - Consumo de Recursos H2M)**:
   * Requisição: `GET http://localhost:3339/api/v1/products?pageSize=2&storeId=1` portando o Bearer Token RS256.
   * Validação Criptográfica: `JwtH2mStrategy` consultando o JWKS RFC 7517 (`http://host.docker.internal:3001/.well-known/jwks.json`).
   * Autorização RBAC: `PermissionsGuard` e `PermissionResolver` mapeando o `credentialsId` do tenant corporativo.
   * **Resultado**: `200 OK` - Retornou produtos respeitando os limites da loja do operador.
3. **Passo 3 (INFOAPI - Status do Operador)**:
   * Requisição: `GET http://localhost:3339/api/v1/auth/operator-status/1`.
   * **Resultado**: `200 OK` (`{"active": true, "storeId": 1}`).
4. **Passo 4 (STS - Refresh Token)**:
   * Requisição: `POST http://localhost:3001/auth/refresh`.
   * **Resultado**: `200 OK` - Refresh token rotacionado e novo Access Token RS256 gerado.

### Testes de Regressão Automatizados
* **Test Suites**: 76 passados, 76 total (100%).
* **Testes Unitários**: 526 passados, 526 total (100%).
* **TypeScript Compilation**: 0 erros (`nest build` finalizado com sucesso).
