# Plano de Implementação - Painel de Notificações (Lidas e Não Lidas)

Adicionar um painel moderno e interativo de notificações (com abas de "Não Lidas" e "Lidas") na Área do Cliente (`client.html`), permitindo que usuários vejam avisos passados e gerenciem seus avisos atuais diretamente do header.

## Alterações Propostas

### 1. Backend (NestJS API)

#### [MODIFY] [announcement.controller.ts](file:///c:/dev/infoapi/src/modules/announcement/announcement.controller.ts)
- Adicionar um novo endpoint `@Get('read')` para retornar as notificações que o usuário atual já visualizou (lidas).
- Este endpoint chamará o serviço `announcementService.findReadForUser(user.sub)`.

#### [MODIFY] [announcement.service.ts](file:///c:/dev/infoapi/src/modules/announcement/announcement.service.ts)
- Implementar o método `findReadForUser(userId: string)`.
- A query buscará avisos ativos (`active: true`) com filtros de data adequados, onde existam registros de visualização correspondentes ao usuário (`views: { some: { userId } }`).

---

### 2. Frontend (Área do Cliente)

#### [MODIFY] [client.html](file:///c:/dev/infoapi/src/modules/integration-request/templates/client.html)
- **Header**: Adicionar um botão de notificações (`btn-notifications`) ao lado do botão de documentação (`Docs`), contendo um ícone de sino e um badge vermelho flutuante (`#notifications-badge`) para indicar o total de mensagens não lidas.
- **Drawer**: Criar a estrutura HTML para um painel lateral retrátil (`notifications-drawer`) com:
  - Header contendo título e botão de fechar (`x`).
  - Abas "Não Lidas" e "Lidas" para alternar visualização.
  - Lista de itens (`#notifications-list`) dinamicamente renderizados.
  - Overlay de fundo escuro e embaçado (`#drawer-overlay`) para interações suaves.

#### [MODIFY] [client.css](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/client.css)
- Adicionar estilos para o botão de notificações e o badge flutuante.
- Estilizar o drawer lateral com efeito de glassmorphism premium (`backdrop-filter: blur(20px)`), sombras profundas e transições suaves de entrada/saída (`transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1)`).
- Adicionar layouts baseados em Flexbox para os cards de aviso no painel, suportando cores diferenciadas para cada tipo (`info`, `warning`, `alert`, `doc`).
- Estilizar o botão de visto/check (`btn-mark-read`) no painel "Não Lidas", aplicando micro-animações de hover/escala.
- Adicionar suporte a scroll independente na lista de avisos.

#### [MODIFY] [client-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/client-core.js)
- **Estado**: Adicionar arrays `UI.unreadAnnouncements` e `UI.readAnnouncements`, além de controlar a aba ativa do drawer (`UI.activeDrawerTab = 'unread'`).
- **Comunicação e API**:
  - Atualizar `UI.loadAnnouncements` para buscar tanto as não lidas quanto as lidas concorrentemente.
  - Atualizar o badge flutuante e o estado das abas com as contagens dinâmicas.
- **Renderização**:
  - Atualizar a barra de avisos do topo (`UI.renderAnnouncements`) para usar `UI.unreadAnnouncements`.
  - Criar `UI.renderNotificationsDrawer()` para exibir avisos na aba ativa do drawer.
  - Se for "Não Lidas", cada item exibirá o botão "visto" (ícone de check `bx bx-check`), que chamará `UI.dismissAnnouncementById(ann.id)`.
  - Se for "Lidas", o botão de check não será exibido.
- **Interações**:
  - Criar `UI.toggleNotificationsMenu(open)` para abrir ou fechar o painel lateral com animações CSS.
  - Criar `UI.switchDrawerTab(tabId)` para alternar entre as abas e re-renderizar a lista apropriada.
  - Criar `UI.dismissAnnouncementById(id)` para realizar a requisição POST de visualização, remover o item da lista otimisticamente e sincronizar instantaneamente o slider do topo e a lista do drawer.

---

## Plano de Verificação

### Testes Manuais
1. **Login & Inicialização**: Verificar se o badge de notificações exibe o total correto de avisos não lidas ao logar.
2. **Abertura do Drawer**: Clicar no sino no header e verificar se o painel lateral desliza suavemente da direita para a esquerda e o overlay escurece a tela.
3. **Alternância de Abas**: Mudar entre as abas "Não Lidas" e "Lidas" e confirmar que as listagens correspondentes são exibidas corretamente.
4. **Marcar como Lida (Check no Drawer)**: Clicar no ícone de check em uma notificação não lida. Verificar se:
   - O aviso é removido imediatamente da aba "Não Lidas".
   - O aviso aparece na aba "Lidas".
   - A barra de avisos no topo é atualizada correspondente (removendo ou alterando o slide).
   - O badge no header decrementa.
5. **Fechar pelo Topo (X no Slider)**: Fechar um aviso pelo slider do topo e verificar se a alteração se reflete imediatamente no drawer lateral (reduzindo a contagem e movendo para a aba Lidas).
6. **Responsividade**: Validar se o painel lateral é amigável em telas menores (mobile).
