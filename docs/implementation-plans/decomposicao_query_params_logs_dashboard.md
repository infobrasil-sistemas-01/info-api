# Plano de Implementação: Decomposição de Query Params nos Logs do Dashboard (Abordagem C)

Este plano documenta a refatoração visual e estrutural da tabela de logs de requisições HTTP do Dashboard Administrativo (`admin.html`), implementando a **Abordagem C (Decomposição Estrutural do Dado)** para prevenir overflow horizontal, truncamento indesejado e quebra de layout quando a requisição possui query strings extensas.

---

## 1. Problema Identificado

Quando requisições da API possuem parâmetros longos (ex.: `/api/v1/products?storeId=4&page=1&pageSize=20&priceTable=1&search=unibox+Top%C3%A1zio+Santorini`), a string contínua força o navegador a esticar a célula da tabela além do limite visual disponível. Como a tabela não possuía `table-layout: fixed` e o container estava restrito com corte ou rolagem parcial, as colunas à direita (especialmente "Usuário Chamador") eram empurradas para fora do viewport ou cortadas.

---

## 2. Solução Arquitetural (Abordagem C)

1. **Separação Estrutural de Path e Query:**
   - O endpoint é decomposto em seu **Path Base** (ex.: `/api/v1/products`) e sua **Query String**.
   - A coluna principal exibe estritamente o path base em destaque visual limpo e legível.
2. **Pill Interativa de Parâmetros:**
   - Se houver parâmetros de query, uma pill compacta (`?params (N)`) com ícone chevron é exibida ao lado do path.
3. **Sub-linha Expansível (Observability Accordion):**
   - Ao clicar na pill de parâmetros, uma sub-linha expansível (`colspan="6"`) é exibida logo abaixo da requisição no estilo Datadog / CloudWatch.
   - Apresenta tags individuais para cada parâmetro decodificado (`chave: valor`), URL bruta completa e botão de 1 clique para copiar a URL completa (`Copiar URL Completa`) com feedback visual.
4. **Blindagem de Layout com `table-layout: fixed`:**
   - Larguras explícitas em todas as colunas de tamanho previsível (Timestamp: 170px, Método: 75px, Status: 75px, Latência: 130px, Usuário: 230px).
   - A coluna de Endpoint consome o espaço fluido restante com `word-break: break-all`.
   - A coluna de Usuário recebe `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` com `title` acessível, garantindo que o tenant e email nunca sejam esticados nem cortados do viewport.
   - O container da tabela recebe `overflow-x: auto` e `overflow-y: auto`.

---

## 3. Arquivos Modificados

1. `src/modules/integration-request/templates/assets/admin-components.js`:
   - Adição das funções utilitárias `escapeHtml`, `toggleLogParams` e `copyToClipboard`.
   - Refatoração de `Components.DashboardRequestLogRow` para decomposição de URL e geração da sub-linha expansível.
   - Atualização do cabeçalho e estrutura da tabela em `Components.DashboardContent` com `table-layout: fixed` e novas larguras balanceadas.
2. `src/modules/integration-request/templates/admin.html`:
   - Atualização do parâmetro de cache buster dos scripts (`admin-components.js`).

---

## 4. Validação

- Execução dos testes automatizados do módulo de dashboard (`npm.cmd test -- src/modules/dashboard`).
- Validação do comportamento das tags com caracteres especiais via escape HTML seguro.
