# Plano de Implementação: Painel de Logs HTTP (Estilo Sentry)

Este plano detalha a implementação de uma seção de auditoria e visualização em tempo real de logs de requisições HTTP diretamente no Dashboard do Administrador, similar à lista de eventos do Sentry.

---

## 1. Alterações Propostas

### 1.1 Backend (NestJS)

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
- Adicionar o método `getRequestLogs(startDate: Date, endDate: Date, limit = 50)` para obter as últimas requisições registradas no banco de dados.
- A consulta fará um JOIN com a tabela de `users` para capturar as informações do usuário chamador (username e email):
  ```typescript
  async getRequestLogs(startDate: Date, endDate: Date, limit = 50) {
    const query = `
      SELECT
        rl.created_at as "timestamp",
        rl.method as "method",
        rl.path as "path",
        rl.status as "status",
        rl.duration_ms as "durationMs",
        u.user as "username",
        u.email as "email"
      FROM request_logs rl
      JOIN users u ON rl.user_id = u.id
      WHERE rl.created_at >= $1 AND rl.created_at <= $2
        AND rl.path NOT LIKE '/api/v1/dashboard%'
        AND rl.path NOT LIKE '/api/v1/newsletter%'
      ORDER BY rl.created_at DESC
      LIMIT $3
    `;
    return this.prisma.$queryRawUnsafe<any[]>(query, startDate, endDate, limit);
  }
  ```

#### [MODIFY] [dashboard.controller.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.controller.ts)
- Expor o endpoint GET `/dashboard/request-logs` aceitando os parâmetros de período `startDate` e `endDate` (filtros temporais unificados do dashboard) e um `limit` opcional.

---

### 1.2 Frontend (Dashboard Admin)

#### [MODIFY] [admin-components.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-components.js)
1. **DashboardRequestLogRow**: Componente que renderiza uma linha individual de log HTTP com as seguintes colunas:
   - Timestamp (Formatado localmente)
   - Método HTTP (Pill colorido por tipo GET/POST/PATCH/DELETE)
   - Rota completa acessada pelo cliente
   - Código HTTP Status (Colorido: Verde para 2xx, Amarelo para 4xx, Vermelho para 5xx)
   - Tempo de resposta em milissegundos
   - Usuário chamador (Nome e Email)
2. **DashboardContent**:
   - Adicionar o parâmetro `requestLogs` na assinatura da função.
   - Renderizar o novo bloco de logs (`Log de Requisições HTTP (Real-Time)`) abaixo das tabelas auxiliares.

#### [MODIFY] [admin-core.js](file:///c:/dev/infoapi/src/modules/integration-request/templates/assets/admin-core.js)
- Adicionar a chamada de rede ao novo endpoint em `fetchDashboard()` enviando o range temporal selecionado.
- Repassar o array de `requestLogs` ao gerar o template usando `Components.DashboardContent`.

---

## 2. Plano de Verificação

### 2.1 Testes Automatizados
- Criar teste unitário em `dashboard.service.spec.ts` validando o retorno do método `getRequestLogs()` e seus parâmetros de paginação/limitação.
- Executar os testes via `npm.cmd run test`.

### 2.2 Verificação Manual
1. Efetuar chamadas às APIs de Contas a Pagar/Receber com diferentes rotas e observar a inserção em tempo real na listagem do final do dashboard do administrador.
2. Alterar o filtro temporal (Última hora, 7 dias, etc.) e verificar se a lista de logs respeita o filtro selecionado.
