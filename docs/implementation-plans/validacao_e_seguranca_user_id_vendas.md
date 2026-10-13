# Validação e Segurança do Operador (`user_id` / `USU_CODIGO`) em Vendas

## 1. Contexto e Motivação

Atendendo às diretrizes arquiteturais para o recebimento de `USU_CODIGO` (`user_id`) no endpoint `POST /orders`:
1. **Abstração do Domínio:** Mantém-se o padrão RESTful/snake_case `user_id` no contrato (`PostOrderDto`), alinhado aos padrões da API.
2. **Defesa em Profundidade e Prevenção de Falsificação (OWASP BOLA):** Em contexto H2M (operadores humanos autenticados via JWT), caso o cliente envie `user_id` divergente do `usuCodigo` emitido no token, a API rejeitará imediatamente a requisição com `403 Forbidden`. Se omitido, o operador autenticado é assumido automaticamente.
3. **Integridade Referencial com Consulta Prévia:** Antes de abrir transação de gravação da venda, a API consulta a tabela `USUARIOS` no Firebird para validar a existência e atividade do operador (`USU_SITUACAO = 'A'` e sem demissão registrada em `FUN_DATADEMISSAO`), lançando `400 Bad Request` caso o operador seja inexistente ou esteja inativo.

---

## 2. Escopo das Alterações

### 2.1 Controller (`src/modules/order/order.controller.ts`)
- Adicionar validação de identidade em contexto `H2M`:
  - Se `isH2M` for verdadeiro e `dto.user_id` for informado, comparar com `usuCodigo` do token.
  - Se divergente, lançar `ForbiddenException('Operador não autorizado a registrar vendas em nome de outro usuário.')`.
- Se omitido em `H2M`, o `effectiveUserId` herda `usuCodigo`.

### 2.2 Service (`src/modules/order/order.service.ts`)
- Implementar o método privado `validateUser(connection, userId: number)`:
  - Consulta `USUARIOS` e `FUNCIONARIOS`:
    ```sql
    SELECT U.USU_CODIGO, U.USU_SITUACAO, F.FUN_DATADEMISSAO
    FROM USUARIOS U
    LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = U.FUN_CODIGO
    WHERE U.USU_CODIGO = ?
    ```
  - Lançar `BadRequestException` se não encontrado ou se inativo/desligado.
- Chamar `validateUser` no fluxo de `post` antes de abrir a transação de criação da venda (quando `orderData.user_id` for informado e diferente de 9999).

### 2.3 Contrato / DTO (`src/modules/order/dto/create-order.dto.ts`)
- Garantir descrição clara no `@ApiPropertyOptional` de `user_id` indicando que representa o código do usuário/operador (`USU_CODIGO`) e que em tokens H2M deve corresponder ao operador autenticado.

### 2.4 Testes Automatizados
- `src/modules/order/order.controller.spec.ts`:
  - Adicionar teste de rejeição com `403 Forbidden` quando operador H2M tenta registrar com `user_id` divergente.
  - Garantir que operador H2M com `user_id` coincidente passe com sucesso.
- `src/modules/order/order.service.spec.ts`:
  - Adicionar teste de validação de `validateUser`: aprovação com usuário ativo, rejeição com `400 Bad Request` para usuário inexistente e usuário inativo.
