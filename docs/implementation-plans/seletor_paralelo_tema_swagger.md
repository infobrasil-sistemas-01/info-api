# Plano de Implementação: Seletor Paralelo de Tema Claro/Escuro do Swagger UI

## 1. Contexto e Objetivo

O header unificado corporativo (`<info-api-header>`) deve ser mantido no topo da página de documentação (`/docs`), oferecendo a identidade visual e os links de navegação da InfoBrasil.

O Swagger UI possui seu próprio ecossistema de temas (seja pela classe nativa `dark-mode` do Swagger UI 5.x, seja por botões e extensões injetados na topbar nativa). O objetivo é conectar o seletor de tema do `<info-api-header>` como um **seletor paralelo**, que dispara exatamente o mesmo gatilho do seletor nativo do Swagger, sem poluir o Swagger claro com CSS invasivo nem quebrar o layout.

---

## 2. Diagnóstico das Tentativas Anteriores

1. **Tentativa 1 (Overrides manuais de CSS):** Mais de 200 linhas de CSS tentavam redefinir cada classe interna do Swagger UI, gerando conflitos de especificidade (texto escuro sobre fundo escuro e cards brancos deslocados).
2. **Tentativa 2 (Remoção da topbar com `display: none`):** Ao ocultar a topbar via CSS rígido, o botão/seletor nativo do Swagger deixou de ser renderizado e interagível.
3. **Tentativa 3 (Remoção do `<info-api-header>`):** Ao restaurar apenas a topbar antiga da 1.16.27, o header corporativo foi indevidamente removido.

---

## 3. Arquitetura da Solução

### 3.1. Header Corporativo no Topo
- O `<info-api-header>` é injetado no topo do `body` de `/docs`.
- Ele contém o botão de tema (`#theme-toggle-btn`), que atua como o **seletor paralelo**.

### 3.2. Preservação do DOM da Topbar Nativa
- A topbar nativa do Swagger (`.swagger-ui .topbar`) não deve ser destruída nem removida com `display: none !important`.
- Caso haja botões de tema instalados na topbar (nativos ou de extensões de navegador), eles permanecem vivos e acessíveis no DOM.

### 3.3. Gatilho Paralelo Bidirecional
Ao clicar no botão de tema do `<info-api-header>`:
1. **Busca e aciona o gatilho nativo:**
   O script procura elementos de alternância de tema no Swagger UI (ex: `button[aria-label*="dark" i]`, `button[title*="dark" i]`, `.dark-mode-toggle`, `.theme-toggle`, ou botões na `.topbar-wrapper`) e dispara `.click()`.
2. **Alternância direta de classe nativa:**
   Caso nenhum botão externo esteja presente, aciona o mecanismo nativo do Swagger UI 5.x:
   - Alterna a classe `dark-mode` no container `.swagger-ui`, `html` e `body`.
   - Define `color-scheme: light` ou `color-scheme: dark`.
3. **Sincronização de Estado:**
   - Salva a preferência em `localStorage.setItem('infoapi-theme', theme)`.
   - Mantém o `<info-api-header>` e o Swagger UI sempre no mesmo modo sincronizado.

### 3.4. Swagger Claro 100% Nativo
- No modo claro, nenhum CSS escuro é aplicado. O Swagger UI renderiza exatamente o seu layout de fábrica (fundo branco, contraste limpo, componentes nativos).

---

## 4. Etapas de Execução

1. Atualizar `src/config/swagger.ts`:
   - Configurar o `customJsCode` para que o evento `theme-changed` do `<info-api-header>` dispare a sincronização com o gatilho nativo do Swagger (`dark-mode` class e clique em botões nativos/extensões se existirem).
   - Manter a injeção do `<info-api-header>` no topo.
   - Ajustar o CSS para que no modo claro o Swagger permaneça 100% puro e no modo escuro respeite a classe nativa `dark-mode`.
2. Validar a compilação com `npm run build`.
3. Executar a suíte de testes com `npm run test`.
4. Commitar e fazer push para a branch `main`.
