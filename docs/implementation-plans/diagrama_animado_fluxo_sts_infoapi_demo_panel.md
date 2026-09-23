# Plano de Implementação: Diagrama Animado e Interativo de Fluxo STS vs InfoAPI no Painel de Vendas

Este documento detalha o plano arquitetural e de interface para a criação de um componente visual dinâmico, animado com SVG e CSS, integrado ao `demo-sales-panel`. O componente demonstra de forma didática e executiva o ciclo completo de comunicação entre o Terminal PDV, o **Security Token Service (STS :3001)**, o **Gateway InfoAPI (:3339)** e a **Base Firebird do Tenant**.

---

## 1. Objetivos e Escopo

1. **Topologia Visual em SVG**:
   - Desenhar 4 atores arquiteturais em SVG com conectores bidirecionais:
     1. **PDV Web Client** (Terminal do Operador)
     2. **STS (:3001)** (Security Token Service - RS256, JWKS, Refresh)
     3. **InfoAPI Gateway (:3339)** (Validação de Token em Memória, Guards RBAC, Pool Firebird)
     4. **Firebird Tenant DB** (Banco relacional local da loja/cliente)
2. **Máquina de Estados Didática (Stepper / Sequenciador Interativo)**:
   - Apresentar o fluxo em etapas controláveis (Play, Pausa, Próximo, Anterior, Reset, Velocidade 1x/2x).
   - Destaque animado de fluxo usando CSS keyframes (`stroke-dashoffset`, partículas SVG e halos de iluminação).
3. **Inspeção de Pacotes e Flags de Destino**:
   - Cada passo exibirá cards com:
     - **Flag visual de Destino**: `[STS :3001]` (Badge Roxo / Indigo) vs `[INFOAPI :3339]` (Badge Esmeralda / Verde).
     - **Método HTTP e Rota**: ex.: `POST /auth/login`, `POST /auth/operator-verify`, `POST /orders`.
     - **Headers e Tokens**: Visualização de claims do JWT RS256 decodificado (`storeId`, `operatorId`, `credentialsId`).
     - **Explicação de Arquitetura**: O que acontece nos bastidores (ex: "Por que a InfoAPI não consulta o STS para validar o token").
4. **Modo Híbrido (Didático + Reativo a Ações Reais)**:
   - Além do modo passo a passo guiado, o componente escutará os eventos do `app.js` (Login, Carga de Produtos, Finalização de Pedido, Silent Refresh) e atualizará a animação quando o operador usar o PDV real.

---

## 2. Etapas do Sequenciador Arquitetural

| Passo | Nome da Etapa | Origem ➔ Destino | Flag | Endpoint / Ação | Rationale de Arquitetura |
|---|---|---|---|---|---|
| **01** | **Login Operador (H2M)** | PDV ➔ **STS** | `[STS]` | `POST :3001/auth/login` | O PDV envia `slug`, `username` e `password`. Zero senhas salvas no cliente. |
| **02** | **Verificação Operador (M2M)** | STS ➔ **InfoAPI** ➔ **Firebird** | `[API]` | `POST :3339/api/v1/auth/operator-verify` | STS bate na InfoAPI via M2M; InfoAPI aloca pool Firebird e valida hash bcrypt da `USU_SENHA_API`. |
| **03** | **Emissão de Par RS256** | STS ➔ **PDV** | `[STS]` | Retorno HTTP 200 | STS assina JWT com chave privada RSA-2048 contendo `storeId` e `credentialsId`, além de `refreshToken`. |
| **04** | **Catálogo & Status** | PDV ➔ **InfoAPI** | `[API]` | `GET :3339/api/v1/products` | InfoAPI valida assinatura do token em memória (cache JWKS) sem bater no STS e busca dados no Firebird. |
| **05** | **Gravação de Venda** | PDV ➔ **InfoAPI** ➔ **Firebird** | `[API]` | `POST :3339/api/v1/orders` | Gateway extrai filial do token, abre transação ACID no Firebird e insere cabeçalho, itens e parcelas. |
| **06** | **Silent Refresh** | PDV ➔ **STS** | `[STS]` | `POST :3001/auth/refresh` | Ao expirar o token de 15m (401), PDV renova no STS sem deslogar o operador nem interromper a venda. |

---

## 3. Estrutura de Arquivos e Componentes

### 3.1. Novos Arquivos e Modificações

1. **`demo-sales-panel/architecture-flow.js` [NOVO]**:
   - Módulo responsável pelo estado da máquina de passos (`steps`), renderização do SVG animado, controle de reprodução (play/pause/step) e inspeção de payloads.
   - Interface de comunicação pub/sub com o `app.js` para sincronização em tempo real.
2. **`demo-sales-panel/architecture-flow.css` [NOVO]**:
   - Estilos dedicados: nó SVG, animações de linhas tracejadas pulsantes (`@keyframes flowDash`), partículas (`@keyframes particlePulse`), drawer responsivo e visual moderno em tema dark/glassmorphism alinhado ao PDV.
3. **`demo-sales-panel/index.html` [MODIFICAR]**:
   - Inclusão do botão de acionamento no header (`[⚡ Fluxo da Arquitetura STS / API]`).
   - Inclusão da estrutura do Drawer/Modal interativo contendo a visualização SVG e painel de inspeção de requisição.
4. **`demo-sales-panel/app.js` [MODIFICAR]**:
   - Emissão de ganchos nos métodos `handleLogin`, `silentRefresh`, `loadProducts`, `submitOrder` para permitir o modo reativo no visualizador.

---

## 4. Design da Interface do Drawer / Modal

- **Header do Visualizador**:
  - Título: *Simulador de Fluxo Arquitetural • STS & InfoAPI*
  - Controles: `[◀ Anterior]` `[▶ Play / Pause]` `[Próximo ▶]` `[Reset ↺]` | Seletor de Velocidade (1x / 2x).
  - Indicador de Etapa: `Passo X de 6: <Nome do Passo>`.
- **Área Central (SVG Canvas)**:
  - 4 cards vetoriais estilizados (PDV, STS, InfoAPI, Firebird).
  - Curvas de Bézier suaves com setas direcionais conectando os pontos de rede.
  - Linha ativa acesa com gradiente dinâmico e partícula de pulso trafegando da origem ao destino.
- **Painel de Inspeção do Pacote (Inferior / Lateral)**:
  - Badge em destaque: `DESTINO: STS :3001` (Roxo) ou `DESTINO: INFOAPI :3339` (Verde).
  - Caixa de rota com método: `POST http://localhost:3001/auth/login`.
  - Headers inspecionáveis (ex.: `Authorization: Bearer eyJhbGciOiJSUzI1NiIs...`).
  - Request Body / Response Body formatado em JSON colapsável.
  - Card explicativo: *Nota do Arquiteto* (por que este passo foi desenhado assim e que garantia de segurança/resiliência ele oferece).

---

## 5. Plano de Validação e Testes

1. **Validação Visual e de Animação**:
   - Executar o servidor estático da demo (`node demo-sales-panel/serve-sales-panel.mjs`).
   - Testar o avanço passo a passo manual (Next/Prev) e autoplay contínuo.
   - Confirmar se as animações SVG (`stroke-dashoffset`) e partículas fluem sem saltos ou jank.
2. **Validação das Flags de Rota**:
   - Verificar se todos os endpoints para `:3001` exibem a flag roxa `[STS]` e endpoints para `:3339` exibem a flag verde `[API]`.
3. **Validação de Responsividade e Integração**:
   - Testar em resoluções de desktop e telas de PDV (1366x768 até 1920x1080).
   - Testar gatilho reativo ao efetuar uma venda real no PDV para garantir que não há interferência nas rotas normais de negócio.
