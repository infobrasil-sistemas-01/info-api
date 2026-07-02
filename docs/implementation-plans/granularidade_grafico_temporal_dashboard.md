# Plano de Implementação - Granularidade Dinâmica no Gráfico Temporal do Dashboard

Este plano descreve o design e a arquitetura para permitir zoom mais granular (a cada 1 minuto, 15 minutos, 30 minutos, 1 hora ou por dia) no gráfico temporal do Dashboard de Administrador da Info Vendas API.

---

## 1. Visão Geral

Atualmente, o gráfico de evolução temporal do dashboard agrupa requisições apenas por dia ou por hora (se a faixa for <= 2 dias). As ferramentas de zoom do ApexCharts estão desabilitadas.

Propomos:
1. **No Backend**: Adicionar suporte a intervalos customizados (`1m`, `15m`, `30m`, `hour`, `day`) no serviço de evolução temporal e determinar automaticamente a melhor granularidade se nenhum intervalo for fornecido.
2. **No Frontend**:
   - Habilitar ferramentas de zoom e pan no ApexCharts.
   - Tratar o evento `zoomed` para fazer uma requisição mais granular ao backend para o intervalo de datas selecionado pelo zoom.
   - Adicionar filtros rápidos de períodos menores ("Última 1 hora" e "Últimas 6 horas") no dropdown de datas para carregar dados detalhados imediatamente.
   - Formatar de forma adaptativa o eixo X e tooltips do gráfico dependendo do intervalo exibido.

---

## 2. Mudanças Propostas

### Backend

#### [MODIFY] [dashboard.controller.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.controller.ts)
* Modificar a rota `GET /dashboard/time-series` para aceitar um parâmetro opcional de query `interval` (ex: `1m`, `15m`, `30m`, `hour`, `day`).

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
* Atualizar o método `getTimeSeries(startDate: Date, endDate: Date, interval?: string)`:
  * Se `interval` não for passado, calcular a granularidade ideal baseando-se na diferença de tempo:
    - Intervalo $\le$ 2 horas $\rightarrow$ `1m`
    - Intervalo $\le$ 12 horas $\rightarrow$ `15m`
    - Intervalo $\le$ 24 horas $\rightarrow$ `30m`
    - Intervalo $\le$ 3 dias $\rightarrow$ `hour`
    - Caso contrário $\rightarrow$ `day`
  * No PostgreSQL, gerar a expressão temporal adequada:
    - `1m` ou `minute` $\rightarrow$ `DATE_TRUNC('minute', created_at)`
    - `15m` $\rightarrow$ `to_timestamp(floor(extract(epoch from created_at) / 900) * 900) AT TIME ZONE 'UTC'`
    - `30m` $\rightarrow$ `to_timestamp(floor(extract(epoch from created_at) / 1800) * 1800) AT TIME ZONE 'UTC'`
    - `hour` $\rightarrow$ `DATE_TRUNC('hour', created_at)`
    - `day` $\rightarrow$ `DATE_TRUNC('day', created_at)`
  * Substituir o parâmetro posicional da query do `DATE_TRUNC` pela string SQL injetando com segurança o truncamento mapeado.

---

### Frontend

#### [MODIFY] [admin-components.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-components.js)
* Adicionar opções no dropdown de filtro de data (`#dashboard-date-filter`):
  ```html
  <option value="1h">Última 1 hora</option>
  <option value="6h">Últimas 6 horas</option>
  ```

#### [MODIFY] [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)
* **Adicionar novas faixas de datas** no cálculo do `fetchDashboard()`:
  - Se `dateFilter === '1h'`, buscar de 1 hora atrás.
  - Se `dateFilter === '6h'`, buscar de 6 horas atrás.
* **Habilitar o Toolbar de Zoom** no objeto de opções do ApexCharts (`tsOptions`):
  ```javascript
  toolbar: {
      show: true,
      tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
      },
      autoSelected: 'zoom'
  }
  ```
* **Adicionar o evento `zoomed`**:
  ```javascript
  events: {
      zoomed: async (chartContext, { xaxis }) => {
          if (xaxis.min && xaxis.max) {
              const startStr = new Date(xaxis.min).toISOString();
              const endStr = new Date(xaxis.max).toISOString();
              
              // Impedir loops infinitos
              if (State.currentZoomRange && 
                  Math.abs(State.currentZoomRange.min - xaxis.min) < 1000 && 
                  Math.abs(State.currentZoomRange.max - xaxis.max) < 1000) {
                  return;
              }
              State.currentZoomRange = { min: xaxis.min, max: xaxis.max };
              await Data.fetchZoomedTimeSeries(startStr, endStr);
          }
      }
  }
  ```
* **Implementar método de atualização parcial do gráfico**:
  - `fetchZoomedTimeSeries(startStr, endStr)`: Busca apenas a evolução temporal para a nova janela de tempo e atualiza a série de dados e rótulos do gráfico temporal.
* **Formatação Inteligente do Eixo X**:
  - Ajustar `tsCategories` para formatar os rótulos de tempo de forma dinâmica baseando-se no tamanho do intervalo de dados recebido:
    - $\le$ 24 horas: `HH:mm`
    - $\le$ 48 horas: `DD/MM HH:mm`
    - Caso contrário: `DD/MM`

---

## 3. Plano de Verificação

### Testes Automatizados
* Atualizar os testes unitários em [dashboard.service.spec.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.spec.ts) para validar o comportamento de `getTimeSeries` com as novas granularidades (`1m`, `15m`, `30m`).

### Verificação Manual
1. Abrir o Dashboard Administrativo.
2. Selecionar "Última 1 hora" e verificar se o gráfico exibe os pontos minuto a minuto.
3. Selecionar "Últimos 30 dias" (dados diários), arrastar para selecionar uma região pequena (zoom) e verificar se o gráfico atualiza trazendo dados horários ou de 30 minutos.
4. Clicar no botão de Recarregar (ou mudar o dropdown) e verificar se o zoom é redefinido.
