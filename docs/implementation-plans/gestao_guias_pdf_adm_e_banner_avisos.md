# Plano de Implementação: Gestão de Guias em PDF no ADM e Banner Centralizado no Cliente

## 1. Visão Geral
Este plano descreve a implementação da aba de gestão de "Guias em PDF" no painel administrativo (`/integration/admin`), com suporte a listagem, criação, edição, ativação/desativação e exclusão, além da reformulação completa dos avisos no portal do cliente (`/integration/client`), transformando o antigo banner estreito de topo em um hero banner mais alto, posicionado abaixo do header e com conteúdo e botão centralizados.

---

## 2. Dívida Técnica Arquitetural: MinIO / Object Storage
> [!WARNING]
> **Dívida Técnica Registrada:**
> Atualmente, a persistência de arquivos físicos PDF adotará a **Abordagem 1** (armazenamento local em `docs/guides/` com metadados na tabela `integration_guides` do PostgreSQL).
> 
> **Evolução Planejada (MinIO / S3):**
> Em versão futura, a infraestrutura deve migrar para um storage de objetos compatível com S3 (MinIO auto-hospedado ou bucket gerenciado como AWS S3 / Cloudflare R2 / GCP). 
> **Impacto da dívida:** Em ambientes Docker sem volume compartilhado persistente ou em escala horizontal de réplicas, uploads locais em runtime exigem sincronização de volume no host. A migração para MinIO resolverá o desacoplamento e tornará a aplicação 100% *stateless* (Fator VI do 12-Factor App).

---

## 3. Escopo das Alterações

### A. Gestão de Guias em PDF no Painel ADM (`/integration/admin`)
1. **Backend (API NestJS)**:
   - `GET /integration/api/admin/guides`: Retorna a listagem completa de guias cadastrados no banco (ativos e inativos), com ordenação e paginação/filtros.
   - `POST /integration/api/admin/guides`: Criação de novo guia (título, código, descrição, categoria, URL ou arquivo).
   - `PATCH /integration/api/admin/guides/:id`: Atualização de campos e status `active`.
   - `DELETE /integration/api/admin/guides/:id`: Exclusão de guia.
2. **Frontend ADM (`admin.html`, `admin-core.js`, `admin-components.js`, `admin.css`)**:
   - Inclusão da aba **"Guias PDF"** (`#tab-guides`) na barra de navegação superior do ADM.
   - Componente de tabela (`Components.GuideTable` e `Components.GuideRow`):
     - Código (`L2.11.1`), Título, Categoria, Caminho/Link, Status (badge Ativo/Inativo), Ações (Editar, Toggle Ativo, Excluir, Abrir PDF).
   - Modal de criação/edição (`#guide-modal`):
     - Formulário para Título, Código, Categoria, Descrição, URL pública do arquivo PDF e Toggle Ativo.
     - Suporte a upload direto de arquivo PDF ou inserção de URL.

### B. Novo Banner de Avisos Centralizado no Cliente (`/integration/client`)
1. **Posicionamento**:
   - Mover `#announcement-bar` para **abaixo do `<header>`**, antes do `<main class="dashboard">`.
   - Alinhamento dentro da mesma largura máxima do container central (`max-width: 1200px; margin: 16px auto 0;`).
2. **Design & Estilo**:
   - Layout de card/banner mais alto (`min-height: auto; padding: 24px 32px; border-radius: 16px;`).
   - Todo o conteúdo **centralizado**:
     - Ícone temático centralizado em destaque no topo.
     - Texto do aviso centralizado com largura de leitura agradável (max ~850px).
     - Botão de ação (CTA) centralizado abaixo do texto em destaque.
     - Botão de fechar `(x)` posicionado discretamente no canto superior direito do banner.
     - Setas de navegação de slide (`<` e `>`) discretas e elegantes nas laterais do card.

---

## 4. Plano de Validação
- Compilar o backend com `npm run build`.
- Testar endpoints administrativos com tokens JWT válidos de suporte/admin.
- Testar criação, edição, toggle de ativo e exclusão de guia pelo painel ADM.
- Validar layout do cliente em desktop e mobile (responsividade e sem saltos visuais).
