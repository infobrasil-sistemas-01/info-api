# Especificação Técnica do Serviço STS (`info-api-sts`)

Este documento consolida todas as diretrizes técnicas e de arquitetura para a construção do **`info-api-sts`**, o serviço central de identidade e emissão de tokens (Security Token Service) para o ecossistema de vendas.

---

## 1. Visão Geral e Stack Tecnológica

* **Repositório**: `c:\dev\info-api-sts`
* **Tecnologias**:
  * **Runtime**: Node.js 20+ com TypeScript
  * **Framework**: NestJS
  * **ORM**: Prisma ORM com PostgreSQL (banco próprio e isolado do STS)
  * **Porta HTTP**: `3001` (para convivência local simultânea com a `info-api` na porta `3000`)
  * **Criptografia**: Assinatura assimétrica de tokens via **RSA (RS256)**

---

## 2. Modelagem do Banco de Dados (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Tenant {
  id              String   @id @default(uuid())
  slug            String   @unique // Subdomínio do cliente (ex: "matriz", "empresa-a")
  name            String   // Nome da empresa / Razão social
  credentialsId   String   @map("credentials_id") // UUID do tenant no banco Registry da INFOAPI
  infoApiUrl      String   @default("http://localhost:3000/api/v1") @map("info_api_url")
  m2mClientId     String   @map("m2m_client_id")     // Usuário/Client de API na INFOAPI
  m2mClientSecret String   @map("m2m_client_secret") // Senha do Client de API na INFOAPI
  status          Boolean  @default(true)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  refreshTokens   RefreshToken[]

  @@map("tenants")
}

model RefreshToken {
  id          String    @id @default(uuid())
  tokenHash   String    @unique @map("token_hash") // Hash SHA-256 do token opaco
  tenantId    String    @map("tenant_id")
  usuCodigo   Int       @map("usu_codigo")
  funCodigo   Int?      @map("fun_codigo")
  storeId     Int?      @map("store_id")
  expiresAt   DateTime  @map("expires_at")
  revokedAt   DateTime? @map("revoked_at")
  userAgent   String?   @map("user_agent")
  ipAddress   String?   @map("ip_address")
  createdAt   DateTime  @default(now()) @map("created_at")

  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, usuCodigo])
  @@map("refresh_tokens")
}
```

---

## 3. Variáveis de Ambiente (`.env` e Schema Zod)

```typescript
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  
  // Par de chaves RSA em formato PEM (ou caminho para os arquivos .pem)
  RSA_PRIVATE_KEY: z.string().min(1, 'Chave privada RSA obrigatória para assinar tokens'),
  RSA_PUBLIC_KEY: z.string().min(1, 'Chave pública RSA obrigatória'),
  
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().default(30),
});

export type Env = z.infer<typeof envSchema>;
```

### Script para Gerar o Par de Chaves RSA (OpenSSL / Terminal)
```bash
# Gera a chave privada de 2048 bits
openssl genrsa -out private.pem 2048

# Extrai a chave pública correspondente
openssl rsa -in private.pem -pubout -out public.pem
```

---

## 4. Endpoints e Regras de Negócio

### 4.1. `POST /auth/login`
Autentica o vendedor e emite as credenciais de sessão.

* **Payload de Entrada**:
  ```json
  {
    "tenantSlug": "empresa-a",
    "username": "joao.silva",
    "password": "SenhaSegura123@"
  }
  ```
* **Fluxo de Execução**:
  1. Busca no PostgreSQL do STS o tenant pelo `slug` (`status = true`). Se não achar: `404 Tenant não encontrado`.
  2. Obtém as credenciais M2M do tenant (`m2mClientId` e `m2mClientSecret`).
  3. Dispara chamada HTTP para a INFOAPI:
     * `POST ${tenant.infoApiUrl}/auth/operator-verify`
     * Header: `Authorization: Basic base64(m2mClientId:m2mClientSecret)`
     * Body: `{ "username": "joao.silva", "password": "SenhaSegura123@" }`
  4. Se a INFOAPI retornar erro ou `valid: false`: retorna `401 Credenciais inválidas`.
  5. Se a INFOAPI retornar `{ valid: true, usuCodigo: 104, funCodigo: 104, storeId: 1 }`:
     * Gera string randômica segura (crypto.randomBytes) para o Refresh Token;
     * Salva o hash SHA-256 do Refresh Token na tabela `refresh_tokens`;
     * Assina o Access Token com a `RSA_PRIVATE_KEY` usando o algoritmo `RS256`:
       ```json
       {
         "sub": "104",
         "iss": "infovendas-sts",
         "credentialsId": "tenant-uuid",
         "storeId": 1,
         "usu_codigo": 104,
         "fun_codigo": 104,
         "type": "H2M"
       }
       ```
  6. Retorna:
     ```json
     {
       "accessToken": "ey...",
       "refreshToken": "raw_opaque_refresh_token",
       "user": {
         "usuCodigo": 104,
         "funCodigo": 104,
         "storeId": 1
       }
     }
     ```

---

### 4.2. `POST /auth/refresh`
Renova o Access Token com validação no banco do cliente.

* **Payload de Entrada**:
  ```json
  {
    "refreshToken": "raw_opaque_refresh_token"
  }
  ```
* **Fluxo de Execução**:
  1. Calcula o SHA-256 do token recebido e busca em `refresh_tokens`.
  2. Valida se `revokedAt == null` e `expiresAt > now()`. Se inválido: `401 Unauthorized`.
  3. Dispara checagem na INFOAPI:
     * `GET ${tenant.infoApiUrl}/auth/operator-status/${tokenRecord.usuCodigo}`
     * Header: `Authorization: Basic base64(m2mClientId:m2mClientSecret)`
  4. Se a INFOAPI indicar `active: false` (bloqueado ou demitido):
     * Marca `revokedAt = now()` na tabela `refresh_tokens`;
     * Retorna `401 Unauthorized (Vendedor inativo ou demitido)`.
  5. Se `active: true`:
     * Revoga o refresh token anterior e gera um novo (rotação segura);
     * Emite novo Access Token RS256 com os dados atualizados de `storeId`;
     * Retorna `{ accessToken, refreshToken }`.

---

### 4.3. `POST /auth/logout`
Revoga a sessão imediatamente.
* **Payload**: `{ "refreshToken": "..." }`
* **Ação**: Marca `revokedAt = now()` para o hash correspondente. Retorna `204 No Content`.

---

### 4.4. `GET /.well-known/jwks.json`
Expõe a chave pública RSA no formato padrão JWKS (RFC 7517) para que qualquer consumidor possa validar os tokens gerados.
