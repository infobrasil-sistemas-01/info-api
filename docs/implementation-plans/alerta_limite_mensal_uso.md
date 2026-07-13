# Alerta de 80% do Limite Mensal de Uso

Este plano visa implementar um disparo automático de e-mail para usuários quando suas requisições mensais atingirem ou ultrapassarem 80% do limite total permitido pelo seu plano de integração. O e-mail utilizará a mesma identidade visual da Newsletter do sistema e fornecerá recomendações práticas (como otimização de consultas e upgrade de planos).

## User Review Required

> [!IMPORTANT]
> - **Evitando Spam**: Para evitar que o usuário receba um e-mail a cada requisição após atingir 80% de uso, manteremos o controle de disparos em um arquivo JSON local em `.tmp/usage-alerts.json` (que é ignorado pelo Git). Isso nos permite registrar de forma persistente que um alerta de 80% já foi enviado para aquele usuário no mês atual, resistindo a restarts do servidor.
> - **Execução Assíncrona**: O disparo do e-mail e a verificação do limite de uso ocorrerão de forma assíncrona logo após o registro bem-sucedido de cada requisição. Isso garante impacto zero na latência das APIs do cliente.

## Open Questions

Não há dúvidas em aberto. O plano de execução foi estruturado com segurança.

## Proposed Changes

---

### Módulo de Planos (Plan Module)

#### [MODIFY] [plan.service.ts](file:///c:/dev/infoapi/src/modules/plan/plan.service.ts)
- Importar `EmailService`, `EnvService`, `Logger`, além dos pacotes padrão `fs` e `path`.
- Adicionar um `Logger` interno e injetar `EmailService` e `EnvService` no construtor.
- Implementar as funções auxiliares `getApiVersion()` e `getLogoBase64()` para capturar o logotipo da marca e a versão da API.
- Criar a função `generateUsageAlertHtml(username, currentUsage, limit)` para montar o e-mail no mesmo estilo visual premium do Newsletter, contendo o alerta de 80% e links para ver a documentação (`/docs`) e os planos (`/integration`).
- Implementar a lógica de checagem contra spam: `hasSentUsageAlertThisMonth(userId)` e `markUsageAlertSent(userId)` utilizando o arquivo persistente `.tmp/usage-alerts.json`.
- Implementar `checkAndSendUsageAlert(userId)` que calcula o uso mensal do usuário, verifica se está entre 80% e 100% de uso, e dispara o e-mail se aplicável.
- Chamar `checkAndSendUsageAlert(userId)` de forma assíncrona dentro do método `logRequest(...)` sempre que a requisição for um sucesso.

#### [NEW] [plan.service.spec.ts](file:///c:/dev/infoapi/src/modules/plan/plan.service.spec.ts)
- Criar arquivo de testes unitários para o `PlanService`.
- Validar se o método `checkAndSendUsageAlert` dispara o e-mail corretamente apenas quando o limite ultrapassa 80% e que não reenvia o e-mail caso já tenha sido enviado no mês corrente.

## Verification Plan

### Automated Tests
- Executar os testes unitários do `PlanService` recém-criados:
  ```bash
  npm run test src/modules/plan/plan.service.spec.ts
  ```

### Manual Verification
1. Criar um usuário de teste associado a um plano específico (ex: Free, com 10.000 requisições mensais).
2. Simular inserções de requisições de sucesso para este usuário no mês atual de modo a ultrapassar 8.000 requisições (80%).
3. Verificar a geração do arquivo `.tmp/usage-alerts.json` com o registro de disparo.
4. Confirmar que o e-mail foi disparado via `EmailService` e que chamadas subsequentes não geram novos disparos.
