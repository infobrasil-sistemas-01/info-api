# Plano de Implementação - Subabas no Guia de Integração e Módulo de Guias em PDF

## 1. Visão Geral
Expandir o **Guia de Integração** no painel do cliente (`/integration/client`), transformando-o em um hub de documentação com subabas laterais:
1. **Primeiros Passos:** O conteúdo existente de onboarding (fluxo de autenticação, primeiras chamadas, refresh token, vídeo tutorial e prompt para IA).
2. **Guias em PDF:** Nova área dedicada à listagem e download de guias práticos em formato PDF para recriação de relatórios e rotinas do ERP via API, iniciando pelo relatório **L2.11.1 (Listagem de Giro de Estoque Físico - Entradas / Saídas)**.

Além disso, disponibilizar um modelo de dados no banco (`integration_guides`), endpoint para servir os arquivos PDF publicamente e script SQL com o primeiro insert.

---

## 2. Mudanças e Entregas

### 2.1 Renomeação do Arquivo PDF
- Renomear `docs/guides/guia_relatorio_giro_estoque.pdf` para `docs/guides/L2.11.1_guia_relatorio_giro_estoque.pdf`.
- Atualizar `scripts/generate-giro-estoque-pdf.js` para refletir o prefixo `L2.11.1_`.

### 2.2 Modelo de Dados no Prisma (`schema.prisma`)
Criar o modelo `IntegrationGuide`:
- `id` (UUID)
- `title` (VARCHAR 150)
- `code` (VARCHAR 50, ex: 'L2.11.1')
- `description` (TEXT)
- `category` (VARCHAR 100, ex: 'Listagens')
- `publicUrl` (VARCHAR 255)
- `active` (BOOLEAN, default true)
- `createdAt` e `updatedAt` (TIMESTAMP)

### 2.3 Endpoints no Backend
1. **Servir PDF público (`GET /integration/guides/:file`):**
   - Rota pública em `IntegrationRequestController` enviando o arquivo da pasta `docs/guides/` com `Content-Type: application/pdf` e `Content-Disposition: inline`.
2. **Listar Guias (`GET /api/v1/integration-guides` ou `GET /integration/api/guides`):**
   - Retorna a lista de guias cadastrados e ativos agrupados por categoria.

### 2.4 Interface do Cliente (`client.html` e `client.css`)
- Reestruturar `<section id="tab-guide">` em um layout responsivo com subabas laterais:
  - Sidebar lateral com botões de navegação:
    - `Primeiros Passos` (ícone `bx-rocket`)
    - `Guias em PDF` (ícone `bxs-file-pdf` com badge contador)
  - Painel de conteúdo alternável com animação suave de transição:
    - Subaba `Primeiros Passos`: conteúdo atual intacto.
    - Subaba `Guias em PDF`: visualização em grid com cards elegantes contendo badge de categoria, código, título, descrição e botão de ação "Visualizar PDF" / "Baixar".

### 2.5 Script SQL de Inserção
- Script SQL para inserção do primeiro registro na tabela `integration_guides`.
