# Correção de Quedas e Timeouts 504 no Gateway (Firebird Pools, Healthcheck e Unhandled Exceptions)

## Contexto e Causa Raiz
O Nginx retornou `504 Gateway Timeout` sem logs de erro na aplicação além do último log de ping (`Monitor check - API: UP ...`).
A análise do código identificou três vulnerabilidades críticas interdependentes:

1. **Vazamento de Conexões no Ping do Firebird (`TenantConnectionService.pingPool`)**:
   - `pingPool()` possui timeout de 3s. Se o Firebird do cliente demorar mais que 3s, o timeout rejeita a Promise, mas o driver `node-firebird` não cancela o `pool.get()` em andamento.
   - Quando o socket finalmente conecta, a Promise já foi rejeitada e a conexão obtida **nunca é liberada** (`db.detach()`), ficando vazada no pool.
   - Além disso, o `pingActivePools()` não destruía o pool ao detectar timeout, deixando o pool corrompido em memória.
   - A cada minuto o `StatusService.monitor()` executava `healthService.check(true)` (bypassing cache), forçando pings e esgotando as 5 conexões do pool.

2. **Acoplamento do Healthcheck do Docker com Bancos Remotos de Clientes**:
   - O `docker-compose.yml` checa `/api/v1/health` a cada 10s com timeout de 5s.
   - O `/api/v1/health` disparava ping em todos os Firebirds de clientes. Se a internet de um cliente estivesse lenta, o healthcheck do Docker falhava 3 vezes e marcava o container como `unhealthy`, degradando o roteamento do Nginx.

3. **Ausência de Listener para `unhandledRejection` e Encerramento Abrupto no `main.ts`**:
   - O Node.js 18+ encerra o processo em caso de `unhandledRejection` não tratada.
   - O `uncaughtException` executava `process.exit(1)` síncrono, matando o processo antes do Sentry/GlitchTip e buffers de log descarregarem via rede.

---

## Proposta de Solução

### 1. Camada de Conexão Firebird (`TenantConnectionService`)
- **Proteção contra conexões tardias no `getConnection` e `pingPool`**: Se o timeout de espera estourar antes do retorno de `pool.get()`, sinalizar estado e, assim que o callback do `node-firebird` for invocado, executar `db.detach()` imediatamente.
- **Auto-reciclagem no `pingActivePools`**: Se o ping de um pool falhar ou der timeout, acionar `destroyPool(credentialsId)` para purgar sockets mortos/pendentes.
- **Guarda de Concorrência**: Impedir múltiplos pings concorrentes simultâneos no mesmo pool.

### 2. Camada de Healthcheck e Monitoramento (`HealthService`, `HealthController`, `docker-compose.yml`)
- **Endpoint Leve de Liveness (`/api/v1/health/live`)**: Criar endpoint rápido que verifica apenas o status do processo e do PostgreSQL local, respondendo em < 10ms.
- **Docker Compose**: Atualizar o healthcheck dos containers `infoapi-blue` e `infoapi-green` para consumir `/api/v1/health/live`.
- **`StatusService.monitor()`**: Utilizar checagem leve (API + Postgres) sem forçar pings síncronos em todas as conexões remotas a cada 60s.

### 3. Camada de Resiliência do Processo (`main.ts`)
- Registrar `process.on('unhandledRejection')` capturando stack e enviando ao Sentry.
- Tratar erros comuns de sockets Firebird e rede (`ECONNRESET`, `EPIPE`, `ETIMEDOUT`, driver buffer bugs) para evitar que quedas de VPN de clientes derrubem o servidor de toda a empresa.

---

## Proposed Changes

### Infraestrutura e Banco
#### [MODIFY] [tenant-connection.service.ts](file:///c:/dev/info-api/src/infra/database/tenant-connection.service.ts)
- Corrigir race condition de timeout e vazamento no `getConnection()` e `pingPool()`.
- Adicionar auto-reciclagem de pools problemáticos no `pingActivePools()`.

#### [MODIFY] [health.service.ts](file:///c:/dev/info-api/src/modules/health/health.service.ts)
- Adicionar método `checkLiveness()` leve (Postgres + Uptime).

#### [MODIFY] [health.controller.ts](file:///c:/dev/info-api/src/modules/health/health.controller.ts)
- Adicionar rota `GET /api/v1/health/live`.

#### [MODIFY] [docker-compose.yml](file:///c:/dev/info-api/docker-compose.yml)
- Alterar healthcheck dos containers para `/api/v1/health/live`.

#### [MODIFY] [status.service.ts](file:///c:/dev/info-api/src/modules/status/status.service.ts)
- Usar `checkLiveness()` no monitor cron de 1 minuto.

#### [MODIFY] [main.ts](file:///c:/dev/info-api/src/main.ts)
- Adicionar listener de `unhandledRejection` e tratamento robusto de erros no `uncaughtException`.

### Testes
#### [MODIFY] [tenant-connection.service.spec.ts](file:///c:/dev/info-api/src/infra/database/tenant-connection.service.spec.ts)
- Adicionar testes de vazamento tardio no ping, descarte imediato e auto-reciclagem.

---

## Verification Plan

### Automated Tests
- Executar testes unitários do banco e health:
  ```bash
  npm run test -- tenant-connection.service.spec.ts
  ```
- Executar suíte completa de testes:
  ```bash
  npm run test
  ```
- Compilar o projeto:
  ```bash
  npm run build
  ```
