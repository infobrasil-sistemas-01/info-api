# Header Sticky e Colado nas Laterais ao Rolar

Este plano propõe alterações na estrutura HTML e estilos CSS dos painéis de Administração (`admin.html`) e do Cliente (`client.html`) para fazer com que os cabeçalhos (`header`) se comportem de forma fluida e premium ao rolar a página:
1. Começarão flutuando levemente com margens e cantos arredondados (`border-radius`).
2. Ao rolar a página (`scrollY > 0`), subirão, se expandirão até as laterais da tela e se fixarão no topo (`top: 0`), perdendo os cantos arredondados para um visual totalmente integrado ao topo (sem "flutuar" no meio do conteúdo).
3. O conteúdo interno do cabeçalho continuará centralizado (max-width de 1200px) para alinhar-se perfeitamente com os painéis em resoluções de tela grandes.

## User Review Required

> [!IMPORTANT]
> - **Mudança Estrutural no Admin**: O `<header>` do painel de administração atualmente está dentro da div `.dashboard` (que possui `padding: 40px 20px;` e `max-width: 1280px`). Para permitir que ele se expanda a 100% de largura da viewport, precisamos movê-lo para fora da div `.dashboard` (diretamente dentro de `#admin-wrapper`). Nossos testes mostram que isso não afeta os scripts JS de controle do admin, pois nenhum deles busca o header dependendo dessa relação de parentesco direta com o container `.dashboard`.
> - **Transição de Estilos**: As transições de cantos arredondados (`border-radius: 20px` para `0`), margem (`margin-top: 20px` para `0`), sombra e fundo serão suavizadas via CSS `transition` (0.3s cubic-bezier) para proporcionar um efeito visual premium e agradável.

## Open Questions

Não há dúvidas em aberto. O escopo das alterações foi mapeado e validado.

## Proposed Changes

---

### Interface do Admin (Painel de Administração)

#### [MODIFY] [admin.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/admin.html)
- Mover o elemento `<header>` para fora de `<div id="admin-content" class="dashboard">` e colocá-lo como primeiro filho de `<div id="admin-wrapper" class="hidden">`.
- Adicionar um listener de evento `scroll` na tag `<script>` ao final do arquivo para gerenciar a classe `scrolled` no cabeçalho quando o usuário rolar a página.

#### [MODIFY] [admin.css](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin.css)
- Adicionar `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);` no seletor `header`.
- Mudar a margem inicial do `header` para `20px auto 32px` (para que ele comece flutuando a 20px do topo).
- Ajustar o container interno `.header-content` para ter `max-width: 1200px` e `margin: 0 auto` para manter o conteúdo alinhado.
- Adicionar a classe `header.scrolled` com as seguintes propriedades:
  ```css
  header.scrolled {
      top: 0;
      max-width: 100%;
      border-radius: 0;
      margin-top: 0;
      border-color: transparent transparent var(--border) transparent;
      background: rgba(12, 31, 24, 0.95);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
  ```

---

### Interface do Cliente (Área do Cliente)

#### [MODIFY] [client.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/client.html)
- Adicionar um listener de evento `scroll` ao final do bloco de `<script>` existente para gerenciar a classe `scrolled` no cabeçalho do cliente.

#### [MODIFY] [client.css](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/client.css)
- Adicionar `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);` no seletor `header`.
- Mudar a margem inicial do `header` para `20px auto 0` (iniciando o topo flutuante a 20px).
- Ajustar o container interno `.header-content` para ter `max-width: 1200px` e `margin: 0 auto`.
- Adicionar a classe `header.scrolled` com as mesmas regras:
  ```css
  header.scrolled {
      top: 0;
      max-width: 100%;
      border-radius: 0;
      margin-top: 0;
      border-color: transparent transparent var(--border) transparent;
      background: rgba(12, 31, 24, 0.95);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
  ```

## Verification Plan

### Automated Tests
Não existem testes automatizados específicos para o layout e scroll do cabeçalho HTML estático no projeto. A validação será visual e interativa.

### Manual Verification
1. Abrir o painel Admin e o painel Cliente.
2. Rolar a página para baixo e observar a animação de transição suave do header:
   - A margem do topo diminui até encaixar no topo (0px).
   - O cabeçalho se expande até tocar as bordas esquerda e direita do navegador.
   - O arredondamento das bordas (`border-radius`) diminui gradualmente até ficar reto (0px).
   - O conteúdo do header (logo, menu, avatar) permanece centralizado na tela.
3. Rolar de volta para o topo (scrollY = 0) e certificar que o header volta ao estado flutuante inicial arredondado.
