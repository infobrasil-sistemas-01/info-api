# ADR 003: Validação Sistemática de Limites Máximos (`max`) em Schemas Zod Alinhados ao Prisma Schema

- **Status:** Aceito
- **Data:** 2026-10-07
- **Autores:** Gabriel Bezerra / Time de Engenharia
- **Contexto de Aplicação:** Todos os módulos e esquemas de entrada (DTOs/Zod) persistidos via Prisma no PostgreSQL

---

## 1. Contexto e Problema

No ecossistema da `info-api`, dados administrativos, operacionais, autenticação, avisos e solicitações de integração são persistidos no PostgreSQL por meio do Prisma ORM (`prisma/schema.prisma`). No modelo de dados relacional, diversas colunas de texto possuem limites estritos de capacidade especificados através da anotação `@db.VarChar(N)`, tais como:
* `User.user`: `@db.VarChar(78)`
* `User.passwordHash`: `@db.VarChar(255)`
* `Role.name`: `@db.VarChar(50)`
* `Role.description`: `@db.VarChar(255)`
* `Newsletter.subject`: `@db.VarChar(255)`
* `Announcement.ctaText`: `@db.VarChar(50)`
* `Announcement.ctaLink`: `@db.VarChar(255)`
* `StatusLog.apiStatus` / `dbStatus`: `@db.VarChar(10)`

### O Incidente Arquitetural
Historicamente, alguns contratos de entrada em Zod validavam apenas a presença ou o tamanho mínimo (`.min(...)`), ou certos endpoints (como `/announcements`) recebiam payloads desprovidos de DTOs formais com Zod (`data: any`).

Quando um cliente ou integrador submetia uma requisição com caracteres excedendo a largura da coluna no banco:
1. O PostgreSQL abortava a instrução com o erro: `ERROR: value too long for type character varying(N)` (código SQLSTATE `22001`).
2. O Prisma Client interceptava a falha e gerava uma exceção com o código `P2000` (*The provided value for the column is too long for the column's type*).
3. Por se tratar de um erro não interceptado na fronteira de validação, a exceção borbulhava até o filtro global de exceções do NestJS, culminando em uma resposta **HTTP 500 Internal Server Error**.

Essa resposta HTTP 500 mascara um erro de entrada do cliente (que deveria ser HTTP 400 Bad Request), aciona alarmes falsos de monitoramento no Sentry e degrada a confiabilidade e métricas de observabilidade da API.

---

## 2. Decisão

Decidiu-se adotar o princípio de **validação rigorosa de fronteira (Fail-Fast na Camada HTTP)**, sincronizando sistematicamente as restrições de comprimento (`.max(N)`) em todos os schemas Zod com as definições de coluna do `prisma/schema.prisma`.

### 2.1. Mapeamento 1:1 entre Prisma Schema e Zod Schemas

Para cada coluna tipada como `@db.VarChar(N)` ou com limite conhecido de domínio:
1. **Autenticação (`login.dto.ts`):**
   - `username`: configurado com `.max(78, 'Usuário não pode ultrapassar 78 caracteres')`, espelhando `User.user` (`@db.VarChar(78)`).
   - `password`: configurado com `.max(255, 'Senha não pode ultrapassar 255 caracteres')`, espelhando `User.passwordHash` (`@db.VarChar(255)`).

2. **Newsletter (`send-newsletter.dto.ts`):**
   - `subject`: configurado com `.min(3).max(255, 'Assunto não pode ultrapassar 255 caracteres')`, espelhando `Newsletter.subject` (`@db.VarChar(255)`).

3. **Avisos (`announcement.dto.ts`):**
   - Criados `CreateAnnouncementSchema`, `UpdateAnnouncementSchema` e respectivas classes DTO.
   - `ctaText`: validado com `.max(50, 'Texto do CTA não pode ultrapassar 50 caracteres')`, espelhando `Announcement.ctaText` (`@db.VarChar(50)`).
   - `ctaLink`: validado com `.max(255, 'Link do CTA não pode ultrapassar 255 caracteres')`, espelhando `Announcement.ctaLink` (`@db.VarChar(255)`).
   - `text`: validado com `.min(1)`.

4. **Usuários e Perfis (`user.dto.ts` e `role.dto.ts`):**
   - `user`: mantido `.min(3).max(78)`.
   - `email`: adicionada salvaguarda `.max(255, 'E-mail não pode ultrapassar 255 caracteres')`.
   - `role.name`: mantido `.min(3).max(50)`.
   - `role.description`: mantido `.max(255)`.

5. **Credenciais e Integrações (`db-credentials.dto.ts` e `create-integration-request.dto.ts`):**
   - Delimitados comprimentos máximos em campos abertos de texto (`host`, `database`, `user`, `clientName`, `legalName`, `cnpj`, `fixedIp`, `objective`), prevenindo cargas abusivas em memória e I/O de banco.

### 2.2. Preservação de Metadata para o `ZodValidationPipe` via `ZodDto`

Identificou-se que DTOs declarados exclusivamente como *TypeScript type aliases* (`export type FooDto = z.infer<typeof FooSchema>`) sofrem apagamento de tipo (*type erasure*) durante o build para JavaScript (`Object`), impedindo o pipe global `ZodValidationPipe` de inspecionar `(metatype as any).schema`.

Portanto, padronizou-se que **todos os DTOs validados em rotas HTTP devem ser classes que estendem o utilitário `ZodDto(Schema)`** e importados como valores normais nos controllers:
```typescript
export class CreateAnnouncementDto extends ZodDto(CreateAnnouncementSchema) {}
```

---

## 3. Consequências e Trade-Offs

### Positivas
- **Eliminação de Erros HTTP 500:** Qualquer payload com valores excessivos é prontamente rejeitado pelo `ZodValidationPipe` com **HTTP 400 Bad Request** estruturado, antes de abrir transação ou enviar query ao PostgreSQL.
- **Feedback Imediato ao Consumidor:** A API passa a responder com mensagens amigáveis em português (`errors[].message`), indicando a propriedade exata e a quantidade máxima permitida.
- **Redução de Carga de I/O e Pool:** Rejeição na camada de aplicação evita envio de strings gigantes ao banco de dados e desperdício de conexões ativas.
- **Segurança contra DoS por Payload:** Mitiga tentativas de sobrecarga de memória via injeção de textos volumosos em rotas públicas como `/auth/login` e formulários de integração.

### Negativas / Trade-Offs Aceitos
- **Necessidade de Manutenção Sincronizada:** Futuras alterações na largura de colunas em `schema.prisma` exigirão a atualização correspondente no schema Zod (e vice-versa).
- **Tipagem Estrita em DTOs Opcionais:** Campos com `.optional()` nos schemas Zod exigem alinhamento preciso com propriedades opcionais nas classes DTO sem colisões de tipos no compilador TypeScript.
