# Plano de Implementação: Conversa, Respostas e Fechamento no Feature Requests

Este documento detalha o planejamento técnico e a arquitetura para suportar threads de conversa contínuas em solicitações de funcionalidades (`FeatureRequest`), criação da tabela auxiliar de mensagens no banco de dados PostgreSQL, distinção de status com enum (`PENDING`, `ANSWERED`, `RESOLVED`), fechamento de ticket, exibição do número do ticket (primeiro quadrante do UUID) e fluxo de notificações por e-mail com link direto para a solicitação.

---

## 1. Visão Geral e Requisitos

### 1.1. Contexto
Anteriormente, o módulo de solicitações de funcionalidades suportava apenas uma pergunta única do cliente e uma resposta única do administrador (`requestText` e `responseText`). Para permitir alinhamentos técnicos, dúvidas adicionais e encerramento formal da demanda, transformamos a solicitação em um sistema de tickets com conversa bidirecional e ciclo de vida completo.

### 1.2. Requisitos Principais
1. **Número do Ticket Exposto:**
   - Expor o número identificador do ticket baseado no primeiro quadrante do UUID (`id.slice(0, 8).toUpperCase()`, ex: `#A1B2C3D4`).
   - Apresentar o número nas telas do cliente, no painel admin, nas respostas da API (`ticketNumber`) e nos assuntos dos e-mails.
2. **Status com Enum Formal (`FeatureRequestStatus`):**
   - `PENDING` (Pendente / Em Análise): Ticket aberto ou com réplica do cliente aguardando análise da equipe.
   - `ANSWERED` (Respondido): Equipe InfoBrasil respondeu na conversa, aguardando manifestação do cliente.
   - `RESOLVED` (Resolvido / Fechado): O ticket foi formalmente concluído/resolvido pela equipe. **Respondido != Resolvido**. O status `RESOLVED` fecha o ticket para novas mensagens normais, registrando `resolved_at`.
3. **Tabela Auxiliar para Conversa (`feature_request_messages`):**
   - Armazenar o histórico de mensagens trocadas no ticket (`id`, `feature_request_id`, `sender_id`, `message`, `created_at`).
4. **Ciclo de Conversa e Notificações por E-mail:**
   - **Quando o Admin envia uma mensagem:** Notificar o cliente por e-mail com o número do ticket no assunto, a mensagem e **link direto para o ticket no Portal do Cliente** (`/integration/client#requests`).
   - **Quando o Cliente envia uma mensagem:** Notificar o suporte por e-mail com o número do ticket no assunto, a mensagem do cliente e **link direto para o ticket no Painel Administrativo** (`/integration/admin#requests`).
   - **Quando o Ticket é Marcado como Resolvido:** Notificar o cliente informando a resolução/fechamento do ticket com link para consulta.
5. **Interfaces (UI):**
   - **Portal do Cliente (`client.html`):** Card do ticket exibindo o número (`#A1B2C3D4`), badge de status colorido (`Pendente`, `Respondido`, `Resolvido`), timeline de conversa e campo de envio de mensagens (desabilitado se o ticket estiver fechado).
   - **Painel Administrativo (`admin.html` / `admin-core.js` / `admin-components.js`):** Modal de conversa exibindo número do ticket, histórico completo, campo para nova mensagem do suporte e botão para **"Marcar como Resolvido (Fechar Ticket)"**.

---

## 2. Modelagem de Dados (Prisma ORM & Migration)

### 2.1. Alterações no `prisma/schema.prisma`

```prisma
enum FeatureRequestStatus {
  PENDING
  ANSWERED
  RESOLVED
}

model FeatureRequest {
  id           String               @id @default(uuid())
  userId       String               @map("user_id")
  requestText  String               @map("request_text") @db.Text
  responseText String?              @map("response_text") @db.Text
  status       FeatureRequestStatus @default(PENDING)
  createdAt    DateTime             @default(now()) @map("created_at")
  updatedAt    DateTime             @updatedAt @map("updated_at")
  answeredAt   DateTime?            @map("answered_at")
  resolvedAt   DateTime?            @map("resolved_at")
  user         User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages     FeatureRequestMessage[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("feature_requests")
}

model FeatureRequestMessage {
  id               String         @id @default(uuid())
  featureRequestId String         @map("feature_request_id")
  senderId         String         @map("sender_id")
  message          String         @db.Text
  createdAt        DateTime       @default(now()) @map("created_at")
  featureRequest   FeatureRequest @relation(fields: [featureRequestId], references: [id], onDelete: Cascade)
  sender           User           @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@index([featureRequestId, createdAt])
  @@index([senderId])
  @@map("feature_request_messages")
}
```

---

## 3. Endpoints e Regras de Negócio

### 3.1. DTOs
- `CreateFeatureRequestMessageDto`:
  - `message`: string (obrigatório, trim, mín. 1 caractere, máx. 5000).
- `ResolveFeatureRequestDto` (opcionalmente com justificativa/nota de fechamento).

### 3.2. Endpoints da API
- `POST /api/v1/feature-requests/:id/messages`
  - Se ticket já estiver `RESOLVED`, lança `BadRequestException('Este ticket já foi resolvido e está fechado para novas mensagens.')`.
  - Se admin responder: muda status para `ANSWERED` e atualiza `answeredAt`.
  - Se cliente responder: muda status para `PENDING` (reabrindo para atenção do suporte).
  - Notifica por e-mail a outra parte interessada com o número do ticket no assunto e link direto.
- `PATCH /api/v1/feature-requests/:id/resolve`
  - Apenas Admin (`integration-request.approve`).
  - Muda status para `RESOLVED`, preenche `resolvedAt = NOW()`.
  - Notifica o cliente por e-mail de que a solicitação `#A1B2C3D4` foi concluída/resolvida.
- `GET /api/v1/feature-requests/:id`
  - Retorna o ticket detalhado incluindo `ticketNumber` (`#A1B2C3D4`) e todas as mensagens ordenadas cronologicamente com dados do autor (`sender`).
- `GET /api/v1/feature-requests` e `GET /api/v1/feature-requests/my`
  - Retornam lista com `ticketNumber` e contagem/últimas mensagens.

---

## 4. Interfaces e Experiência Visual

1. **Cliente (`client.html`):**
   - Header do card: `Ticket #A1B2C3D4` com badge (`Em Análise`, `Respondido`, `Resolvido`).
   - Chat/Timeline das mensagens.
   - Se o status for `RESOLVED`: exibe banner discreto `Ticket Resolvido e Encerrado` com ícone de cadeado/check verde.
2. **Admin (`admin.html` / `admin-components.js` / `admin-core.js`):**
   - Modal com título `Ticket #A1B2C3D4 - Conversa`.
   - Botão de ação direta: `Resolver Ticket` (verde) e envio contínuo de mensagens.
