# Mitigação de Quedas e Timeouts 504 (Firebird Pools, Query Timeout & TCP Keep-Alive)

## Contexto e Causa Raiz
Nos fins de semana e períodos de baixa atividade, conexões TCP mantidas pelo pool do `node-firebird` tornam-se "zumbis" (half-open) devido a encerramento silencioso por firewalls/NAT ou reinicialização de servidores locais de clientes. Quando novas requisições chegam:
1. O socket Firebird tenta enviar a query sem timeout explícito e fica travado indefinidamente na pilha TCP do Node.js.
2. A Promise nunca resolve/rejeita, o bloco `finally { releaseConnection() }` nunca é executado e o pool de conexões se esgota.
3. O Nginx atinge seu `proxy_read_timeout` (300s) e retorna `504 Gateway Timeout`.
4. O Sentry não registra erro 500 porque a requisição não falhou com exceção tratada no NestJS — ela continuou pendente no Node.js.

## Proposta de Solução (3 Camadas)

### 1. Camada de Conexão / Rede: TCP Keep-Alive e Connect Timeout
- Configurar parâmetros de kernel `sysctls` no `docker-compose.yml` (`net.ipv4.tcp_keepalive_time=60`, `net.ipv4.tcp_keepalive_intvl=10`, `net.ipv4.tcp_keepalive_probes=5`) nos serviços `infoapi-blue` e `infoapi-green`. Isso força o envio de probes de keepalive a cada 10s após 60s ociosos, detectando conexões mortas em ~50s ao invés do padrão Linux de 2 horas.
- Configurar `connectTimeout: 7000` (7s) nas opções de criação do pool (`FirebirdService`), evitando travamento na abertura de novos sockets para servidores offline.

### 2. Camada de Pool: TTL de Inatividade e Limpeza Periódica
- No `TenantConnectionService`, rastrear o timestamp do último uso (`lastUsedAt`) de cada pool em `poolCache`.
- Criar rotina periódica de higienização (ex: a cada 5 minutos): pools inativos por mais de 15 minutos são destruídos de forma graciosa (`pool.destroy()`) e removidos da memória.
- Implementar `OnModuleInit` e `OnModuleDestroy` no serviço para gerenciar o ciclo de vida do timer e garantir shutdown limpo.

### 3. Camada de Aplicação: Wrapper Seguro com Timeout de Query e Auto-Reciclagem
- Adicionar no `TenantConnectionService`:
  - `queryWithTimeout(connection, query, params, timeoutMs = 25000)`: Wrapper seguro com `setTimeout` que rejeita se a consulta passar de 25s (bem antes dos 300s do Nginx).
  - `query<T>(credentialsId, sql, params, timeoutMs = 25000)`: Método de conveniência que obtém a conexão, roda com timeout, auto-recicla o pool se houver timeout (destruindo sockets travados) e devolve a conexão no `finally`.
- Atualizar os serviços de negócio existentes para usar a execução com timeout seguro.

---

## User Review Required

> [!IMPORTANT]
> **Definição de Tempos Limites Recomendados:**
> - Timeout de consulta SQL padrão: **25 segundos** (evita atingir o timeout de 300s do Nginx e gera erro 500 imediato rastreável no Sentry).
> - TTL de inatividade do pool: **15 minutos** sem requisições para aquele tenant antes de fechar o pool.
> - Intervalo de verificação de expiração: **a cada 5 minutos**.

---

## Proposed Changes

### Infraestrutura de Conexão e Banco

#### [MODIFY] [docker-compose.yml](file:///c:/dev/info-api/docker-compose.yml)
- Adicionar `sysctls` nos serviços `infoapi-blue` e `infoapi-green` para TCP Keep-Alive agressivo.

#### [MODIFY] [firebird.service.ts](file:///c:/dev/info-api/src/infra/firebird/firebird.service.ts)
- Adicionar `connectTimeout: 7000` nas opções padrão passadas para `firebird.pool(...)`.

#### [MODIFY] [tenant-connection.service.ts](file:///c:/dev/info-api/src/infra/database/tenant-connection.service.ts)
- Rastreamento de `lastUsedAt` por tenant (`Map<string, number>`).
- Implementação de rotina de limpeza de pools inativos (`evictIdlePools`).
- Implementação de `queryWithTimeout` e `query` com detecção de timeout de socket e reciclagem de pool (`destroyPool`).
- Implementação de interfaces `OnModuleInit` e `OnModuleDestroy`.

### Camada de Módulos e Serviços

#### [MODIFY] Serviços que realizam queries Firebird (`ClientService`, `ProductService`, etc.)
- Refatorar a execução de queries SQL para utilizar o helper seguro com timeout.

### Testes Automatizados

#### [MODIFY] [tenant-connection.service.spec.ts](file:///c:/dev/info-api/src/infra/database/tenant-connection.service.spec.ts)
- Testar descarte de pool por inatividade (TTL).
- Testar rejeição por timeout em `queryWithTimeout`.
- Testar auto-reciclagem do pool quando uma query estoura o timeout.

---

## Verification Plan

### Automated Tests
- Executar testes unitários do módulo de banco:
  ```bash
  npm run test -- tenant-connection.service.spec.ts
  ```
- Executar suíte completa de testes unitários:
  ```bash
  npm run test
  ```
- Executar validação de tipos e build:
  ```bash
  npm run build
  ```

### Manual Verification
- Simular uma query suspensa ou com atraso para validar o disparo do timeout e descarte gracioso da conexão.
- Verificar que o `HealthService` e as rotas da API continuam operando normalmente sem vazamento de memória ou socket descriptors.
