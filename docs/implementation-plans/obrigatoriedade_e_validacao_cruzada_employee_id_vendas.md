# Obrigatoriedade de `employee_id` em Integrações M2M e Validação Cruzada com `user_id` em Vendas

## 1. Contexto e Motivação

Assim como o operador (`user_id` / `USU_CODIGO`), o funcionário/vendedor (`employee_id` / `FUN_CODIGO`) não deve depender de fallbacks legados como `9999`, pois compromete o cálculo de comissões, auditoria fiscal e integridade referencial nas bases de clientes do Firebird.

Além de tornar o campo `employee_id` obrigatório para integrações M2M (e validado/herdado do token em H2M), implementa-se uma **validação cruzada relacional**: o funcionário informado deve corresponder estritamente ao funcionário cadastrado no usuário/operador (`U.FUN_CODIGO = F.FUN_CODIGO`), impedindo divergências de comissão ou lançamento de vendas por operadores não autorizados.

---

## 2. Escopo das Alterações

### 2.1 Camada de Borda (`src/modules/order/order.controller.ts`)
- Em contexto **H2M**:
  - Se `dto.employee_id` for informado e divergente de `funCodigo` do token, rejeitar com `403 Forbidden` (`Operador não autorizado a registrar vendas em nome de outro funcionário.`).
  - Se omitido, assume o `funCodigo` do token.
- Em contexto **M2M**:
  - Se `dto.employee_id` for omitido, rejeitar com `400 Bad Request` (`Para integrações M2M/parceiros, é obrigatório informar o campo employee_id (código do funcionário/vendedor no ERP).`).
- O `effectiveEmployeeId` passa a ser estritamente `dto.employee_id!` em M2M.

### 2.2 Camada de Negócio (`src/modules/order/order.service.ts`)
- No método `post`:
  - Validar a presença obrigatória de `orderData.employee_id`.
  - Executar a validação prévia cruzada `validateUserAndEmployee(connection, orderData.user_id, orderData.employee_id)`.
- No método `validateUserAndEmployee`:
  - Consultar `USUARIOS U LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = U.FUN_CODIGO WHERE U.USU_CODIGO = ?`.
  - Validar se o usuário existe e está ativo (`U.USU_SITUACAO = 'A'`).
  - Validar se o usuário possui funcionário vinculado (`U.FUN_CODIGO IS NOT NULL`).
  - Validar se o `U.FUN_CODIGO` corresponde exatamente ao `orderData.employee_id`.
  - Validar se o funcionário está ativo e sem demissão (`F.FUN_SITUACAO = 'A'` e `F.FUN_DATADEMISSAO IS NULL`).
- No método `insertOrderOnDb`:
  - Erradicar o fallback `orderData.employee_id || 9999`, gravando estritamente `FUN_CODIGO: orderData.employee_id`.

### 2.3 Contrato Swagger e DTO (`src/modules/order/dto/create-order.dto.ts`)
- Atualizar a anotação `@ApiPropertyOptional` de `employee_id` detalhando a obrigatoriedade para M2M e o vínculo exigido com o operador.

### 2.4 Testes Automatizados
- `src/modules/order/order.controller.spec.ts`:
  - Testar rejeição com `400 Bad Request` quando M2M não envia `employee_id`.
  - Testar rejeição com `403 Forbidden` quando H2M tenta forjar outro `employee_id`.
  - Testar sucesso com `employee_id` válido em H2M e M2M.
- `src/modules/order/order.service.spec.ts`:
  - Testar rejeição se `employee_id` for omitido.
  - Testar rejeição se `U.FUN_CODIGO` for diferente de `employee_id`.
  - Testar rejeição se o usuário não tiver funcionário vinculado.
  - Testar rejeição se o funcionário estiver inativo ou demitido.
  - Testar sucesso com par `(user_id, employee_id)` válido e correspondente.
