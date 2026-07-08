# Plano de Implementação: Melhorias no Dossiê Geral do Dashboard

Este plano detalha as melhorias no Dossiê Geral (Internal Dossier) em formato PDF para torná-lo operacional e comercialmente completo, incorporando dados relevantes que atualmente estão ausentes no PDF, mas já estão disponíveis no sistema.

---

## 1. Justificativa das Inclusões

Após análise técnica do Dossiê Geral, constatou-se que as seguintes informações relevantes estavam ausentes no PDF final:

1. **Clientes Ativos (`activeUsers`):** Embora seja retornado por `getSummary`, a quantidade de usuários únicos que consumiram as APIs no período não é exibida. Essa é uma métrica essencial para acompanhamento comercial e de crescimento.
2. **Evolução Temporal do Consumo (Gráfico SVG):** Ao contrário do relatório de cliente, o dossiê interno não contém um gráfico de consumo temporal. Ter uma visualização gráfica do tráfego diário global ajuda a identificar picos de carga ou períodos de instabilidade.
3. **Distribuição por Plano Comercial (`planDistribution`):** Permite ver qual fatia das requisições gerais pertence a cada categoria de plano (ex: Bronze, Ouro, etc.), crucial para planejamento comercial e de capacidade de infraestrutura.
4. **Integridade da Telemetria (Heartbeat do `log-processor`):** Mostra a saúde do consumidor de logs em tempo real. Se o `log-processor` estiver inativo, as métricas do dashboard estarão congeladas ou desatualizadas, o que torna essa informação de saúde operacional indispensável.

---

## 2. Alterações Propostas

### 2.1 Módulo de Dashboard

#### [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)

* Atualizar o método `getDossierData` para o tipo `'internal'`:
  ```typescript
  const [summary, topUsers, topEndpoints, statusDistribution, databaseLoad, proactiveAlerts, planDistribution, timeSeries, heartbeat] = await Promise.all([
    this.getSummary(startDate, endDate),
    this.getTopUsers(startDate, endDate, 10),
    this.getTopEndpoints(startDate, endDate, 10),
    this.getStatusDistribution(startDate, endDate),
    this.getDatabaseLoad(startDate, endDate, 10),
    this.getProactiveAlerts(),
    this.getPlanDistribution(startDate, endDate),
    this.getTimeSeries(startDate, endDate),
    this.getHeartbeatStatus(),
  ]);

  return {
    type: 'internal',
    summary,
    topUsers,
    topEndpoints,
    statusDistribution,
    databaseLoad,
    proactiveAlerts,
    planDistribution,
    timeSeries,
    heartbeat,
  };
  ```

#### [dossier-pdf.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dossier-pdf.service.ts)

* Atualizar o método `renderInternalHtml` para renderizar as novas informações:
  * **Card de Clientes Ativos**: Inserir na seção do Resumo Operacional Global.
  * **Gráfico Temporal**: Utilizar `generateTimeSeriesSvg(data.timeSeries)` para exibir o gráfico de consumo geral.
  * **Distribuição de Planos**: Adicionar tabela com dados de `data.planDistribution` e percentual de participação de tráfego.
  * **Status de Telemetria**: Adicionar na interface visual a indicação do status do `log-processor` (Ativo/Inativo e data/hora do último pulso).

---

## 3. Plano de Verificação

### 3.1 Testes Automatizados
* Atualizar mocks em `dossier-pdf.service.spec.ts` para prover os dados de `planDistribution`, `timeSeries` e `heartbeat` no caso de teste correspondente ao tipo `'internal'`.
* Executar testes unitários:
  ```bash
  npm run test -- src/modules/dashboard
  ```

### 3.2 Verificação Manual
1. Efetuar chamada local via Swagger ou Postman:
   `GET /api/v1/dashboard/dossier?type=internal`
2. Validar visualmente o PDF e confirmar a inserção do card de Clientes Ativos, do gráfico SVG, da distribuição comercial e do indicador de saúde do log-processor.
