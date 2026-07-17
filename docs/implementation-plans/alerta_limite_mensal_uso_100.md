# Alerta de 100% do Limite Mensal de Uso

Este plano visa implementar um disparo automático de e-mail para usuários quando suas requisições mensais atingirem ou ultrapassarem 100% do limite total permitido pelo seu plano de integração (a requisição que fecha a cota). O e-mail utilizará a mesma identidade visual e terá um tema de alerta vermelho/crítico (100% de uso). Também será fornecido um suporte para disparo manual desse alerta por meio do painel de administração para usuários que atingiram o limite antes da implementação deste recurso.

## User Review Required

> [!IMPORTANT]
> **Envio Único Mensal**: Da mesma forma que o alerta de 80%, evitaremos o envio repetido de e-mails de alerta de 100% registrando a notificação como `MONTHLY_100` na tabela `UsageAlertLog` do banco de dados para o mês corrente.

> [!NOTE]
> **Tratamento de 100% no Interceptor**: O interceptor de limites (`PlanLimitInterceptor`) bloqueia requisições e retorna HTTP 429 se a contagem mensal do usuário já estiver igual ou acima do limite. A requisição que de fato "fecha a cota" (por exemplo, a 10,000ª requisição em um plano de 10,000) passará com sucesso pelo interceptor, será executada com sucesso e, ao logar a requisição com sucesso (`logRequest`), o total acumulado do mês chegará a exatamente 100% do limite. O `checkAndSendUsageAlert` será disparado assincronamente nessa requisição, detectando o consumo de 100% e enviando o e-mail de alerta. As requisições subsequentes serão bloqueadas pelo interceptor antes de registrar sucesso, evitando reenvios e loops.

## Open Questions

Não há dúvidas em aberto. O comportamento mapeado segue de forma análoga o do alerta de 80%, utilizando a tabela `UsageAlertLog` de maneira consistente.

## Proposed Changes

---

### Módulo de Planos (Plan Module)

#### [MODIFY] [plan.service.ts](file:///c:/dev/infoapi/src/modules/plan/plan.service.ts)
- Atualizar as assinaturas e comportamentos de `hasSentUsageAlertThisMonth` e `markUsageAlertSent` para aceitarem o tipo de alerta (`'MONTHLY_80' | 'MONTHLY_100'`).
- Modificar `checkAndSendUsageAlert(userId)` para verificar se o uso atual é maior ou igual a 100% (cota cheia) e disparar o alerta de 100% (`MONTHLY_100`). Caso contrário, se for `>= 80%`, dispara o alerta de 80% (`MONTHLY_80`).
- Modificar `sendManualUsageAlert(userId)` para obter a quantidade de requisições do mês e disparar o alerta apropriado:
  - Se consumo `>= 100%`: envia alerta de 100% (`MONTHLY_100`).
  - Se consumo `>= 80%` e `< 100%`: envia alerta de 80% (`MONTHLY_80`).
  - Se inferior a 80%: lança exceção informando que o consumo está abaixo do limite de alerta.
- Adaptar `generateUsageAlertHtml` para receber o percentual ou o tipo de alerta e mudar dinamicamente o tema visual para um visual vermelho/crítico (limite estourado e requisições suspensas) caso o percentual seja de 100%.

#### [MODIFY] [plan.service.spec.ts](file:///c:/dev/infoapi/src/modules/plan/plan.service.spec.ts)
- Atualizar os testes unitários do `PlanService` para refletir as alterações nas assinaturas de métodos de logs de alertas.
- Adicionar casos de testes para cobertura do alerta de 100% (disparo automático) e para o disparo manual de 100%.

---

### Módulo de Dashboard (Dashboard Module)

#### [MODIFY] [dashboard.service.ts](file:///c:/dev/infoapi/src/modules/dashboard/dashboard.service.ts)
- Atualizar a query SQL no método `getProactiveAlerts()` para calcular a flag `notified` de forma dinâmica baseada no consumo atual do usuário:
  - Se o consumo for `>= 100%`, a flag `notified` deve indicar se o log `MONTHLY_100` já foi disparado neste mês.
  - Se o consumo for `>= 80%` e `< 100%`, a flag `notified` deve indicar se o log `MONTHLY_80` já foi disparado neste mês.
  - Isso garante que usuários que bateram 100% e ainda não receberam o alerta de 100% fiquem com a flag `notified = false` no dashboard de admin, exibindo a opção de envio manual de e-mail (ícone de envelope para disparo manual).

## Verification Plan

### Automated Tests
- Executar os testes unitários do `PlanService`:
  ```bash
  npm run test src/modules/plan/plan.service.spec.ts
  ```

### Manual Verification
1. Criar ou alterar um usuário de teste associado a um plano (ex: Free, com 10.000 requisições mensais).
2. Simular consumo de exatamente 10.000 requisições de sucesso no banco de dados para o mês atual.
3. Chamar a última requisição que atinge o limite e validar que o e-mail de 100% é enviado pelo `EmailService`.
4. Validar no Dashboard de Admin que o usuário que já possui consumo of 100%, mas não teve o log `MONTHLY_100` disparado, exibe o ícone de envio manual, e que ao clicar no ícone o e-mail de 100% é enviado e o status de `notified` muda para `true` (ícone de enviado).
