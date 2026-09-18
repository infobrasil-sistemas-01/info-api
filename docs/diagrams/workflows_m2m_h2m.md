# Workflows de Autenticação e Integração: M2M vs. H2M

Este documento detalha os dois fluxos de integração suportados pela **INFOAPI**:
1. **Workflow M2M (Machine-to-Machine)**: Fluxo atual utilizado por integrações de sistemas externos (e-commerce, ERPs terceiros, bots).
2. **Workflow H2M (Human-to-Machine)**: Nova arquitetura para o Frontend Infovendas, com serviço central atuando como Identity Provider / STS (Security Token Service) desacoplado.

---

## 1. Workflow M2M (Machine-to-Machine - Atual)

### Características
* **Ator**: Sistema ou serviço externo automatizado.
* **Autenticação**: `Basic Auth` (usuário e senha de API registrados no Postgres Registry).
* **Criptografia do Token**: Simétrica (`HS256`) com segredo compartilhado (`JWT_SECRET`).
* **Operador no Firebird**: Usuário fixo de sistema/integração (`9999`).
* **Canal**: Direto entre o cliente e a INFOAPI.

### Diagrama de Sequência (M2M)

```mermaid
sequenceDiagram
    autonumber
    participant Client as Cliente Externo / M2M<br/>(E-commerce, Cron, API)
    participant InfoAPI as INFOAPI<br/>(NestJS)
    participant Registry as Banco Registry<br/>(PostgreSQL)
    participant TenantDB as Banco Tenant<br/>(Firebird)

    Note over Client,InfoAPI: 1. Autenticação da Aplicação / Máquina
    Client->>InfoAPI: POST /api/v1/auth/login<br/>Header: Authorization Basic (username:password)
    InfoAPI->>Registry: Consulta usuário API (User + PasswordHash Argon2)
    Registry-->>InfoAPI: Dados do usuário + credentialsId (UUID)
    InfoAPI->>InfoAPI: Assina Access Token (HS256 com JWT_SECRET)<br/>Payload: { userId, credentialsId, type: 'M2M' }
    InfoAPI-->>Client: 200 OK { accessToken, refreshToken }

    Note over Client,TenantDB: 2. Execução de Requisições de Negócio
    Client->>InfoAPI: POST /api/v1/orders<br/>Header: Authorization Bearer <Token HS256>
    InfoAPI->>InfoAPI: JwtStrategy (HS256) valida assinatura
    InfoAPI->>InfoAPI: Identifica M2M -> Operador fixo = 9999
    InfoAPI->>Registry: Resolve pool de conexão pelo credentialsId
    InfoAPI->>TenantDB: INSERT INTO PEDIDOS (..., USU_CODIGO = 9999)
    TenantDB-->>InfoAPI: Pedido Criado
    InfoAPI-->>Client: 201 Created { orderId }
```

---

## 2. Workflow H2M (Human-to-Machine - Nova Arquitetura)

### Características
* **Ator**: Vendedor físico operando a interface web (Frontend Infovendas).
* **Resolução de Tenant**: Automática via subdomínio (`empresa.infovendas.com.br`).
* **Identity Provider / STS**: Backend Central gerencia as credenciais dos tenants e autentica o usuário humano contra o banco do cliente.
* **Criptografia do Token**: Assimétrica (`RS256`). O Backend Central assina com a **Chave Privada**; a INFOAPI valida com a **Chave Pública** (em memória, sem consultar banco).
* **Operador e Loja no Firebird**: Dinâmico, extraído diretamente das claims do JWT (`usu_codigo`, `fun_codigo`, `storeId`/`LOJ_CODIGO`). O `storeId` amarra a tabela de preços do vendedor na consulta de produtos e a loja física de emissão no pedido.
* **Ciclo de Vida & Revogação**: Access Token stateless de curta duração (15 min) + Refresh Token revogável com validação de status ativo e data de demissão (`FUN_DEMISSAO`) no banco do tenant a cada renovação.
* **Fluxo de Negócio**: **Direto** do Frontend para a INFOAPI (sem proxy de dados ou gargalo no Backend Central).

### Diagrama de Sequência (H2M)

```mermaid
sequenceDiagram
    autonumber
    actor Vendedor as Vendedor (Browser)
    participant Front as Frontend Infovendas<br/>(empresa.infovendas.com.br)
    participant STS as Backend Central (STS)<br/>(Identity Provider)
    participant InfoAPI as INFOAPI<br/>(Resource Server)
    participant TenantDB as Banco Tenant<br/>(Firebird)

    Note over Vendedor,TenantDB: 1. Login do Operador Humano (Delegação Segura)
    Vendedor->>Front: Acessa via subdomínio + digita usuário e senha
    Front->>STS: POST /auth/login<br/>Body: { tenantSlug: "empresa", username, password }
    STS->>STS: Resolve credenciais M2M da INFOAPI do tenant "empresa"
    STS->>InfoAPI: POST /api/v1/auth/operator-verify<br/>Header: Bearer M2M | Body: { username, password }
    InfoAPI->>TenantDB: Valida USU_SENHA_API (bcrypt) + checa STATUS e FUN_DEMISSAO
    TenantDB-->>InfoAPI: Usuário Ativo (USU: 104, FUN: 104, LOJA: 1)
    InfoAPI-->>STS: 200 OK { valid: true, usuCodigo: 104, funCodigo: 104, storeId: 1 }
    STS->>STS: Gera Refresh Token (persistido no Postgres Central)
    STS->>STS: Assina Access Token com Chave Privada (RS256)<br/>Payload: { sub, credentialsId, storeId: 1, usu_codigo: 104, fun_codigo: 104, type: 'H2M' }
    STS-->>Front: 200 OK { accessToken (RS256), refreshToken }

    Note over Front,TenantDB: 2. Consulta de Catálogo (Preço da Loja do Vendedor)
    Front->>InfoAPI: GET /api/v1/products?search=item<br/>Header: Authorization Bearer <Token RS256>
    InfoAPI->>InfoAPI: JwtStrategy valida RS256 e extrai storeId = 1
    InfoAPI->>TenantDB: SELECT PRODUTOS ... WHERE LOJ_CODIGO = 1 (Aplica tabela de preço da loja)
    TenantDB-->>InfoAPI: Produtos com preços específicos da Loja 1
    InfoAPI-->>Front: 200 OK [ { id, name, price, storeId: 1 } ]

    Note over Front,TenantDB: 3. Operação de Venda (Gravação do Pedido)
    Front->>InfoAPI: POST /api/v1/orders<br/>Header: Authorization Bearer <Token RS256>
    InfoAPI->>InfoAPI: JwtStrategy valida RS256 e extrai credentialsId, storeId = 1, usu_codigo = 104
    InfoAPI->>TenantDB: INSERT INTO PEDIDOS (..., LOJ_CODIGO = 1, USU_CODIGO = 104, FUN_CODIGO = 104)
    TenantDB-->>InfoAPI: Pedido Criado com autoria e loja do vendedor
    InfoAPI-->>Front: 201 Created { orderId }

    Note over Front,TenantDB: 4. Renovação de Sessão (Refresh Token - a cada 15 min)
    Front->>STS: POST /auth/refresh<br/>Body: { refreshToken }
    STS->>STS: Valida se o Refresh Token não foi revogado no Postgres Central
    STS->>InfoAPI: GET /api/v1/auth/operator-status/:usuCodigo<br/>Header: Bearer M2M
    InfoAPI->>TenantDB: Checagem rápida: Usuário inativo ou FUN_DEMISSAO preenchido?
    alt Usuário demitido / inativo
        TenantDB-->>InfoAPI: Demitido / Bloqueado
        InfoAPI-->>STS: 200 OK { active: false }
        STS->>STS: Revoga Refresh Token
        STS-->>Front: 401 Unauthorized (Sessão Encerrada)
    else Usuário ativo
        TenantDB-->>InfoAPI: Usuário Ativo
        InfoAPI-->>STS: 200 OK { active: true, storeId: 1 }
        STS->>STS: Rotaciona Refresh Token + Emite novo Access Token (RS256)
        STS-->>Front: 200 OK { accessToken, newRefreshToken }
    end
```

---

## 3. Matriz Comparativa de Arquitetura

| Dimensão | Workflow M2M (Atual) | Workflow H2M (Novo) |
| :--- | :--- | :--- |
| **Origem da Requisição** | Servidores externos / Backends | Navegador do Vendedor (SPA) |
| **Ponto de Autenticação** | `POST /api/v1/auth/login` (INFOAPI) | `POST /auth/login` (Backend Central STS) |
| **Algoritmo do JWT** | `HS256` (Segredo simétrico) | `RS256` (Par de chaves pública / privada) |
| **Validação na INFOAPI** | Segredo local `JWT_SECRET` | Chave Pública (`PUBLIC_KEY` / JWKS) |
| **Identificação do Operador** | Fixo de integração (`9999`) | Dinâmico via claims (`usu_codigo`, `fun_codigo`) |
| **Resolução de Loja / Preço** | Fixo no cadastro da API ou query param | Injetado via claim `storeId` (tabela de preço da loja) |
| **Multitenancy** | `credentialsId` atrelado ao `User` da API | `credentialsId` emitido no token após lookup do subdomínio |
| **Tráfego de Negócio (`/orders`)** | Direto na INFOAPI | **Direto na INFOAPI** (sem intermediário) |
| **Revogação de Sessão** | Via expiração do JWT | Imediata no refresh através de checagem no Firebird |
