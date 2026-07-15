# Plano de Implementação: Exibir Consumo de Limite por Minuto no Dashboard de Clientes

Este plano de alteração descreve as modificações necessárias para incluir a métrica de consumo de requisições por minuto (`minuteRequests` / `planReqMin`) para cada usuário/cliente na listagem de "Top Usuários" no Painel do Administrador. A informação será exibida em uma coluna dedicada de forma compacta utilizando um mini gráfico de rosca feito puramente em SVG com lógica de cores dinâmica (verde, laranja para 80%+ e vermelho para 100%+), com os valores numéricos exibidos ao lado.

---

## 1. Alterações Propostas

### 1.1 Módulo de Dashboard (`src/modules/dashboard`)

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
- Modificar o método `getTopUsers`:
  - Selecionar o limite de requisições por minuto do plano do usuário (`COALESCE(p.req_min, 30)::int as "planReqMin"`).
  - Adicionar uma subquery SQL para contar as requisições do usuário feitas no último minuto (`minuteRequests`), desconsiderando status 429 e rotas internas (dashboard/newsletter).
  - Incluir `p.req_min` na cláusula `GROUP BY`.

---

### 1.2 Módulo de Frontend / Dashboard Admin (`src/modules/integration-request`)

#### [MODIFY] [admin-components.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-components.js)
- Modificar o cabeçalho da tabela de "Top Usuários" em `DashboardContent` para incluir a coluna `Cota/Minuto` (largura ideal: 140px).
- Modificar o componente `DashboardTopUserRow`:
  - Adicionar uma célula `<td>` correspondente à coluna `Cota/Minuto`.
  - Calcular o percentual de uso por minuto do cliente.
  - Renderizar um mini gráfico de rosca em SVG circular (`stroke-dasharray` de acordo com a porcentagem) com cor dinâmica:
    - Vermelho (`#ef4444`) se >= 100%
    - Laranja (`#f59e0b`) se >= 80%
    - Verde (`#10b981`) se < 80%
  - Exibir os valores numéricos `atual / limite` ao lado do mini gráfico com formatação de cores correspondente.

---

## 2. Plano de Verificação

### 2.1 Testes Automatizados
- Executar os testes unitários do serviço do dashboard para garantir que continuam passando:
  ```bash
  npm run test src/modules/dashboard/dashboard.service.spec.ts
  ```

### 2.2 Verificação Manual
1. Abrir o Dashboard Administrativo da InfoAPI.
2. Na tabela "Top Usuários (Maior Consumo)", verificar a nova coluna "Cota/Minuto" exibindo o mini gráfico de rosca em SVG e a contagem ao lado.
3. Fazer algumas requisições simuladas e verificar se o gráfico e o número de requisições por minuto são atualizados corretamente.
