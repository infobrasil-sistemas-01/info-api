# Plano de Implementação: Latência e Rastreio de Saúde (Backup do Sentry)

Este plano descreve a arquitetura e os passos para implementar a captura de tempo de resposta (latência) de requisições e o monitoramento de saúde do processador em segundo plano (Heartbeat), integrando essas métricas diretamente no Dashboard do Admin.

---

## 1. Grau de Complexidade e Impacto no Código Existente

- **Grau de Complexidade: Médio-Baixo**
  - A maior parte do código envolve queries SQL adicionais no PostgreSQL e renderização no frontend.
  - A captura de tempo de resposta é trivial usando a API nativa de alta precisão `process.hrtime()` do Node.js.
- **Impacto no Código Existente: Baixo**
  - O `PlanLimitInterceptor` existente apenas ganhará lógica de cálculo de tempo ao finalizar a requisição (usando `rxjs/operators` `tap` ou similar).
  - O esquema do banco de dados sofrerá uma migração incremental para adicionar a coluna de latência (`duration_ms`) e a tabela de `SystemHeartbeat`.

---

## 2. Alterações Propostas

### 2.1 Banco de Dados (Prisma Schema)

#### [MODIFY] [schema.prisma](file:///c:/dev/infoapi/prisma/schema.prisma)
1. **RequestLog**: Adicionar a coluna opcional `durationMs` para armazenar o tempo de resposta em milissegundos.
   ```prisma
   model RequestLog {
     ...
     durationMs Float? @map("duration_ms")
   }
   ```
2. **SystemHeartbeat**: Nova tabela para monitoramento de batimento cardíaco (Heartbeat) de processos.
   ```prisma
   model SystemHeartbeat {
     id        String   @id @default(uuid())
     service   String   @unique
     timestamp DateTime @updatedAt @map("timestamp")

     @@map("system_heartbeats")
   }
   ```

---

### 2.2 Backend (NestJS)

#### [MODIFY] [plan-limit.interceptor.ts](file:///c:/dev/infoapi/src/modules/plan/interceptors/plan-limit.interceptor.ts)
- Utilizar `process.hrtime()` antes de prosseguir com o fluxo da requisição.
- Utilizar o operador `tap` do RxJS no método intercept para obter o tempo final e calcular a diferença:
  ```typescript
  const startTime = process.hrtime();
  return next.handle().pipe(
    tap(() => {
      const diff = process.hrtime(startTime);
      const durationMs = parseFloat((diff[0] * 1e3 + diff[1] / 1e6).toFixed(2));
      // Grava o log de forma assíncrona com durationMs
      this.planService.logRequest(userId, method, path, status, ip, durationMs);
    })
  );
  ```

#### [NEW] Heartbeat Cron Job no [status.service.ts](file:///c:/dev/infoapi/src/modules/status/status.service.ts)
- Implementar a atualização a cada 1 minuto do status de saúde do processador/worker em segundo plano:
  ```typescript
  @Cron(CronExpression.EVERY_MINUTE)
  async updateConsumerHeartbeat() {
    await this.prisma.systemHeartbeat.upsert({
      where: { service: 'log-processor' },
      update: { timestamp: new Date() },
      create: { service: 'log-processor', timestamp: new Date() },
    });
  }
  ```

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
- **getSummary**: Calcular a latência P95 (Percentil 95) do período:
  ```sql
  SELECT PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) as "p95Latency"
  FROM request_logs WHERE ...
  ```
- **getTopEndpoints**: Retornar a latência média e P95 por endpoint:
  ```sql
  SELECT
    method,
    path,
    COUNT(id) as "totalRequests",
    ROUND(AVG(duration_ms)::numeric, 2)::float as "avgLatency",
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms)::float as "p95Latency"
  FROM request_logs WHERE ...
  ```
- **getHeartbeatStatus**: Criar método para obter a saúde do consumer:
  ```typescript
  async getHeartbeatStatus() {
    const hb = await this.prisma.systemHeartbeat.findUnique({ where: { service: 'log-processor' } });
    if (!hb) return { status: 'INACTIVE', lastSeen: null };
    const diffMin = (new Date().getTime() - hb.timestamp.getTime()) / (1000 * 60);
    return {
      status: diffMin <= 2 ? 'ACTIVE' : 'INACTIVE',
      lastSeen: hb.timestamp,
    };
  }
  ```

#### [MODIFY] [dashboard.controller.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.controller.ts)
- Expor o endpoint `/dashboard/heartbeat` para consultar o status de saúde do consumer em tempo real.

---

### 2.3 Frontend (Dashboard Admin)

#### [MODIFY] [admin-components.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-components.js)
1. **Card de Latência Média (p95)**: Adicionar um novo card executivo na primeira linha exibindo o Percentil 95 da latência das APIs (ex: `145 ms`).
2. **Heartbeat Status**: Adicionar no topo do dashboard ou barra de status um indicador visual (bolinha verde/vermelha) indicando a saúde do consumer:
   - 🟢 `Processador Ativo` (se status for ACTIVE).
   - 🔴 `Processador Inativo` (se status for INACTIVE).
3. **Nova Tabela de Desempenho de Rotas**: Exibir na tabela de Top Endpoints a latência média e a latência P95 ao lado de cada rota.

#### [MODIFY] [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)
- Solicitar os dados de `/dashboard/heartbeat` no carregamento e atualização do painel.
- Passar os dados de saúde do consumer para o gerador de componentes e aplicar atualizações dinâmicas no DOM.

---

## 3. Plano de Verificação

### 3.1 Testes Automatizados
- Ajustar os testes unitários do `DashboardService` e do `PlanLimitInterceptor` para contemplar a passagem da latência.
- Rodar a suíte inteira via `npm.cmd run test`.

### 3.2 Verificação Manual
1. Abrir a aplicação e realizar requisições na API.
2. Confirmar no banco de dados se a coluna `duration_ms` nas tabelas `request_logs` está sendo preenchida com valores precisos (ex: `12.45`).
3. Verificar no painel de administração se a bolinha de status do consumer está verde e se o card de latência P95 é atualizado conforme novos acessos são realizados.
