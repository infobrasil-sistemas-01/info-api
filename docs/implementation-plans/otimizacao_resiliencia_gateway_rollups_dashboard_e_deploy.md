# Plano de Implementação: Otimização de Resiliência do Gateway, Rollups do Dashboard e Isolamento de Deploy

## 1. Contexto e Objetivos

Investigações em produção revelaram que o cenário de "carregamento eterno" e indisponibilidade sem erros durante o deploy ocorreu devido à convergência de três fatores:
1. **Nginx com `proxy_read_timeout 300s`**: segura conexões por até 5 minutos sem emitir erro, fazendo o navegador travar em loading contínuo.
2. **Consultas analíticas pesadas no Dashboard (`request_logs` com >650k registros)**: a tabela `request_logs` carecia de índice em `created_at` isolado, forçando Sequential Scans de 650k linhas para calcular estatísticas agregadas (P95, counts, grupos) durante acessos a `/integration/admin`.
3. **Canibalização de CPU durante o `docker compose build`**: o processo de compilação TypeScript no host consumia 100% de CPU/IO da VM sem limites de prioridade, retardando as respostas da API e derrubando conexões em voo no momento do chaveamento Blue/Green.

Este plano define as intervenções arquiteturais para solucionar esses pontos de forma definitiva.

---

## 2. Escopo das Mudanças

### 2.1. Gateway Nginx (Fail-Fast)
- **Arquivo**: `nginx.conf.template`
- Alteração: Reduzir `proxy_read_timeout` e `proxy_send_timeout` de `300s` para `30s`.
- Aplicação imediata no container ativo `api-gateway` em produção.

### 2.2. Isolamento de Recursos e Drenagem no Deploy
- **Arquivo**: `deploy.sh`
- Alterações:
  - Aplicar `nice -n 19 ionice -c 3` no `docker compose build` para rebaixar a prioridade de CPU e I/O da compilação em favor dos containers ativos.
  - Adicionar intervalo de drenagem graciosa (`sleep 5`) entre o reload do Nginx e a parada do container antigo (`docker compose stop`), eliminando erros de `Connection reset by peer (502)`.

### 2.3. Otimização de Performance e Rollups do Dashboard (Abordagem A)
- **Banco de Dados**:
  - Adicionar índices cruciais em `request_logs`:
    - `created_at` (B-tree)
    - `(created_at, status)` (B-tree)
  - Criar o modelo `DashboardHourlyRollup` (`dashboard_hourly_rollups`) para persistência de agregações horárias consolidadas.
- **Serviço de Rollup e Dashboard**:
  - Criar `DashboardRollupService` com rotina agendada `@Cron('*/5 * * * *')` para pré-calcular buckets horários.
  - Otimizar `DashboardService` para consultar a tabela de rollups pré-agregados em intervalos horários/diários, caindo de 650k linhas para dezenas de linhas (< 5ms).

---

## 3. Plano de Verificação e Testes
1. Validar sintaxe e configuração do Nginx.
2. Executar testes unitários do NestJS (`npm run test`).
3. Aplicar a migração do banco no container Postgres de produção e testar a velocidade das queries.
4. Validar o chaveamento e deploy no servidor.
