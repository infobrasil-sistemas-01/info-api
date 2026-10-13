# Plano de Implementação: Tema Dark Completo no Swagger UI e Seletor de Tema no Header

## 1. Contexto e Objetivo
Resolver o problema de contraste e quebra visual no Swagger UI (onde containers nativos como `.scheme-container` exibem fundo branco rígido) e entregar uma experiência com tema escuro (Dark Theme) completo, consistente com a paleta da InfoAPI. Além disso, disponibilizar um seletor interativo de tema (Claro / Escuro) integrado no Web Component unificado `<info-api-header>`, persistido via `localStorage`.

## 2. Decisões Arquiteturais

### 2.1. Swagger UI Dark Theme Nativo
- Em vez de depender de arquivos externos de CDN que podem falhar ou ter latência, embutir um conjunto de regras CSS completas cobrindo:
  - Container de Servidores e Autenticação (`.scheme-container`, selects, `.btn.authorize`).
  - Cabeçalho e metadados (`.info .title`, descrições, links).
  - Blocos de operações HTTP (tags, summaries, paths, métodos, responses).
  - Modais de autorização (`.dialog-ux .modal-ux`, inputs de credenciais, botões).
  - Schemas e Models (`section.models`, `.model-box`).
- As regras são ativadas por padrão ou via `body.theme-dark` / `html[data-theme='dark']`.

### 2.2. Seletor de Tema no `<info-api-header>`
- Adicionar botão de toggle no header com ícones SVG alternados (Sol ☀️ para modo escuro ativo, Lua 🌙 para modo claro ativo).
- Persistência da preferência do usuário em `localStorage.getItem('infoapi-theme')` (default: `'dark'`).
- Propagação do tema no host:
  - `document.documentElement.setAttribute('data-theme', theme)`
  - `document.body.classList.toggle('theme-dark', theme === 'dark')`
  - `document.body.classList.toggle('theme-light', theme === 'light')`
  - Disparo de evento `theme-changed` (com `composed: true`) para o ecossistema.

## 3. Plano de Ação
1. **Atualizar `src/config/info-header.component.ts` e `src/modules/integration-request/templates/assets/info-header.js`**:
   - Incluir o botão de alternância de tema na barra de ações do header (desktop e mobile drawer).
   - Implementar estilos e lógica de ciclo de vida para sincronizar com `localStorage` e atualizar o DOM da página.
2. **Atualizar `src/config/swagger.ts`**:
   - Expandir `customCss` com o tema dark completo para o Swagger UI.
   - Suportar comutação entre modo escuro e claro de forma harmoniosa.
3. **Validação**:
   - Compilação com `npm run build`.
   - Teste unitário e validação via requisição HTTP local.
