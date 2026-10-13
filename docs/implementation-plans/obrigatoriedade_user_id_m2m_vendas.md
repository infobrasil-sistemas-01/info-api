# Obrigatoriedade de `user_id` em Integrações M2M e Erradicação de Fallback em Vendas

## 1. Contexto e Motivação

Historicamente, o endpoint `POST /orders` permitia que integrações de máquina (M2M) omitissem o operador (`user_id`), aplicando um fallback silencioso para `employee_id` ou o usuário fixo `9999`. 

No entanto, o usuário `9999` não é garantido em todas as bases de dados de clientes/tenants do Firebird, gerando falhas intermitentes de violação de integridade referencial de chave estrangeira em tempo de execução. Além disso, mascarar a autoria da venda fere os princípios de auditoria fiscal e rastreabilidade operacional do ERP.

Com o alinhamento prévio junto ao parceiro integrador, estabelece-se a regra estrita de que toda venda via M2M deve conter o código do operador (`user_id`).

---

## 2. Escopo das Alterações

### 2.1 Camada de Borda (`src/modules/order/order.controller.ts`)
- Se a requisição for do tipo **M2M** (`!isH2M`) e `dto.user_id` não for informado:
  - Lançar `BadRequestException('Para integrações M2M/parceiros, é obrigatório informar o campo user_id (código do operador no ERP).')`.
- O `effectiveUserId` é derivado estritamente como:
  - H2M: `usuCodigo` (extraído do token).
  - M2M: `dto.user_id` (fornecido e validado no payload).

### 2.2 Camada de Negócio (`src/modules/order/order.service.ts`)
- No método `post`:
  - Validar a presença de `orderData.user_id`. Se ausente, lançar `BadRequestException('O campo user_id (código do operador no ERP) é obrigatório.')`.
  - Executar a consulta prévia `validateUser` para certificar existência e status ativo no Firebird.
- No método `insertOrderOnDb`:
  - Erradicar o fallback legado `orderData.user_id || orderData.employee_id || 9999`.
  - Atribuir estritamente `USU_CODIGO: orderData.user_id`.

### 2.3 Contrato Swagger e DTO (`src/modules/order/dto/create-order.dto.ts`)
- Atualizar anotação do campo `user_id` informando que é obrigatório para chamadas M2M e contextual em H2M.

### 2.4 Testes Automatizados
- `src/modules/order/order.controller.spec.ts`:
  - Testar rejeição com `400 Bad Request` quando M2M não envia `user_id`.
  - Testar aceitação e repasse quando M2M envia `user_id` customizado.
- `src/modules/order/order.service.spec.ts`:
  - Testar que a ausência de `user_id` no service lança `BadRequestException`.
  - Garantir inserção de `USU_CODIGO` estritamente com `user_id`.

---

## 3. Critérios de Sucesso
- Suíte de testes do módulo de pedidos (`npm run test -- src/modules/order`) passando com 100% de sucesso.
- Compilação do NestJS (`npm run build`) sem erros de tipagem.
