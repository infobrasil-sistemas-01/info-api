# Plano de Implementação: Validação Sistemática de `max` em Schemas Zod Alinhados ao Prisma Schema

## 1. Visão Geral e Objetivo

O objetivo central desta intervenção é **eliminar erros HTTP 500 gerados por estouro de limite de caracteres em colunas do banco de dados (PostgreSQL gerenciado via Prisma Client)**.

Quando um cliente da API envia uma string cujo tamanho ultrapassa a capacidade definida na anotação `@db.VarChar(N)` do modelo Prisma:
1. O banco PostgreSQL rejeita o comando com erro: `value too long for type character varying(N)` (SQLSTATE `22001`).
2. O Prisma Client repassa a falha com o código `P2000` (*The provided value for the column is too long for the column's type*).
3. A camada de aplicação NestJS captura a exceção não tratada no filtro global e devolve **HTTP 500 Internal Server Error**, expondo falha interna e gerando ruído desnecessário no monitoramento (Sentry/logs).

A solução arquitetural sistemática consiste em validar o limite superior (`.max(N)`) na fronteira da aplicação (camada HTTP / `ZodValidationPipe`), respondendo imediatamente com **HTTP 400 Bad Request** estruturado e autoexplicativo antes de qualquer comunicação com o banco de dados.

---

## 2. Mapeamento Sistemático: Zod Schema vs. Prisma Schema

A tabela a seguir documenta todos os campos de entidades persistidas via Prisma no PostgreSQL (`prisma/schema.prisma`), seus limites de armazenamento e os respectivos esquemas Zod associados:

| Modelo Prisma (`schema.prisma`) | Campo no Banco / Tipo Prisma | Restrição de Coluna | Arquivo / Schema Zod | Campo Zod | Validação Atual | Nova Validação (`max`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`User`** | `user` (`String`) | `@db.VarChar(78)` | `src/modules/user/dto/user.dto.ts`<br>`CreateUserSchema` | `user` | `.min(3).max(78)` | Mantido `.max(78)` |
| **`User`** | `user` (`String`) | `@db.VarChar(78)` | `src/modules/auth/dto/login.dto.ts`<br>`loginSchema` | `username` | `.min(1)` | **Adicionado `.max(78)`** |
| **`User`** | `passwordHash` (`String`) | `@db.VarChar(255)` | `src/modules/user/dto/user.dto.ts`<br>`CreateUserSchema` | `password` | `.min(6).max(255)` | Mantido `.max(255)` |
| **`User`** | `passwordHash` (`String`) | `@db.VarChar(255)` | `src/modules/auth/dto/login.dto.ts`<br>`loginSchema` | `password` | `.min(6)` | **Adicionado `.max(255)`** |
| **`User`** | `email` (`String?`) | `text` (RFC 5321: 254) | `src/modules/user/dto/user.dto.ts`<br>`CreateUserSchema` | `email` | `z.email()` | **Adicionado `.max(255)`** |
| **`Role`** | `name` (`String`) | `@db.VarChar(50)` | `src/modules/role/dto/role.dto.ts`<br>`CreateRoleSchema` | `name` | `.min(3).max(50)` | Mantido `.max(50)` |
| **`Role`** | `description` (`String?`) | `@db.VarChar(255)` | `src/modules/role/dto/role.dto.ts`<br>`CreateRoleSchema` | `description` | `.max(255)` | Mantido `.max(255)` |
| **`Permission`** | `key` (`String`) | `@db.VarChar(100)` | Catálogo interno / Script | `key` | Truncado a 100 | N/A (Sem entrada pública) |
| **`Permission`** | `name` (`String`) | `@db.VarChar(50)` | Catálogo interno / Script | `name` | `.slice(0, 50)` | Mantido |
| **`Permission`** | `description` (`String?`) | `@db.VarChar(255)` | Catálogo interno / Script | `description` | Catálogo | Mantido |
| **`Newsletter`** | `subject` (`String`) | `@db.VarChar(255)` | `src/modules/newsletter/dto/send-newsletter.dto.ts`<br>`SendNewsletterSchema` | `subject` | `.min(3)` | **Adicionado `.max(255)`** |
| **`Announcement`** | `ctaText` (`String?`) | `@db.VarChar(50)` | `src/modules/announcement/dto/announcement.dto.ts`<br>`CreateAnnouncementSchema` | `ctaText` | Inexistente (`any`) | **Criado DTO com `.max(50)`** |
| **`Announcement`** | `ctaLink` (`String?`) | `@db.VarChar(255)` | `src/modules/announcement/dto/announcement.dto.ts`<br>`CreateAnnouncementSchema` | `ctaLink` | Inexistente (`any`) | **Criado DTO com `.max(255)`** |
| **`Announcement`** | `text` (`String`) | `@db.Text` | `src/modules/announcement/dto/announcement.dto.ts`<br>`CreateAnnouncementSchema` | `text` | Inexistente (`any`) | **Criado DTO com `.min(1)`** |
| **`DbCredentials`** | `host`, `database`, `user` | `text` | `src/modules/db-credentials/dto/db-credentials.dto.ts`<br>`CreateDbCredentialsSchema` | `host`, `database`, `user` | `.min(1)` | **Adicionado `.max(255)`** |
| **`IntegrationRequest`**| `clientName`, `legalName` | `text` | `src/modules/integration-request/dto/create-integration-request.dto.ts`<br>`CreateIntegrationRequestSchema` | `clientName`, `legalName` | `.min(3)` | **Adicionado `.max(255)`** |
| **`IntegrationRequest`**| `cnpj` (`String?`) | `text` | `src/modules/integration-request/dto/create-integration-request.dto.ts`<br>`CreateIntegrationRequestSchema` | `cnpj` | Opcional | **Adicionado `.max(20)`** |
| **`IntegrationRequest`**| `fixedIp` (`String?`) | `text` | `src/modules/integration-request/dto/create-integration-request.dto.ts`<br>`CreateIntegrationRequestSchema` | `fixedIp` | Opcional | **Adicionado `.max(45)`** |
| **`IntegrationRequest`**| `objective` (`String`) | `text` | `src/modules/integration-request/dto/create-integration-request.dto.ts`<br>`CreateIntegrationRequestSchema` | `objective` | `.min(10)` | **Adicionado `.max(5000)`** |
| **`FeatureRequest`** | `requestText` (`String`) | `@db.Text` | `src/modules/feature-request/dto/create-feature-request.dto.ts`<br>`CreateFeatureRequestSchema` | `requestText` | `.min(5).max(5000)` | Mantido `.max(5000)` |
| **`FeatureRequest`** | `responseText` (`String?`) | `@db.Text` | `src/modules/feature-request/dto/respond-feature-request.dto.ts`<br>`RespondFeatureRequestSchema` | `responseText` | `.min(2).max(5000)` | Mantido `.max(5000)` |
| **`FeatureRequestMessage`**| `message` (`String`) | `@db.Text` | `src/modules/feature-request/dto/create-feature-request-message.dto.ts`<br>`CreateFeatureRequestMessageSchema` | `message` | `.trim().min(1).max(5000)` | Mantido `.max(5000)` |

---

## 3. Plano de Ação e Etapas de Execução

1. **Atualização do DTO de Autenticação (`login.dto.ts`):**
   - Incluir `.max(78, 'Usuário não pode ultrapassar 78 caracteres')` no campo `username`.
   - Incluir `.max(255, 'Senha não pode ultrapassar 255 caracteres')` no campo `password`.
   - Atualizar suíte de testes unitários `src/modules/auth/dto/login.dto.spec.ts`.

2. **Atualização do DTO de Newsletter (`send-newsletter.dto.ts`):**
   - Incluir `.max(255, 'Assunto não pode ultrapassar 255 caracteres')` no campo `subject`.
   - Criar suíte de testes unitários `src/modules/newsletter/dto/send-newsletter.dto.spec.ts`.

3. **Criação de DTO Formal para Avisos (`announcement.dto.ts`):**
   - Criar `CreateAnnouncementSchema` e `UpdateAnnouncementSchema` com `ctaText` max 50 e `ctaLink` max 255.
   - Criar classes `CreateAnnouncementDto` e `UpdateAnnouncementDto` estendendo `ZodDto`.
   - Acoplar os DTOs nos métodos `create` e `update` do `AnnouncementController`.
   - Criar suíte de testes unitários `src/modules/announcement/dto/announcement.dto.spec.ts`.

4. **Padronização dos DTOs de Usuário e Roles:**
   - Garantir que `CreateUserDto` e `UpdateUserDto` estendam `ZodDto` para execução em tempo de execução via `ZodValidationPipe`.
   - Incluir `.max(255)` no email de `CreateUserSchema`.
   - Garantir que `CreateRoleDto` e `UpdateRoleDto` estendam `ZodDto`.
   - Criar testes unitários para `user.dto.spec.ts` e `role.dto.spec.ts`.

5. **Ajuste de Limites de Proteção em Credenciais e Solicitações de Integração:**
   - Adicionar limites em `CreateDbCredentialsSchema` e `CreateIntegrationRequestSchema`.
   - Garantir extensão `ZodDto` em `CreateDbCredentialsDto`.

6. **Validação da Suíte de Testes Global:**
   - Rodar `npm.cmd run test` para assegurar 100% de cobertura e zero quebra.

7. **Registro da Decisão Arquitetural (ADR 003):**
   - Documentar em `docs/adrs/003_validacao_sistematica_de_limites_de_campos_zod_prisma.md`.
