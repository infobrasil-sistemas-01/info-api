# Retorno de `USU_CODIGO` nos Endpoints de Funcionários (`GET /employees`)

## 1. Contexto e Motivação

Com a obrigatoriedade de informar o `user_id` (`USU_CODIGO`) nas rotas de criação de pedidos (`POST /orders`) para integrações M2M/parceiros, torna-se essencial expor o código do operador associado a cada funcionário/vendedor.

No banco Firebird, os operadores estão cadastrados na tabela `USUARIOS` vinculados a `FUNCIONARIOS` através da chave estrangeira `U.FUN_CODIGO = F.FUN_CODIGO`. Ao retornar `USU_CODIGO` nas consultas de funcionários, os integradores conseguem mapear os vendedores do PDV diretamente aos respectivos operadores de sistema para registrar as vendas.

---

## 2. Escopo das Alterações

### 2.1 Camada de Serviço (`src/modules/employee/employee.service.ts`)
- No método `get`:
  - Incluir `U.USU_CODIGO` na projeção `SELECT`.
  - Adicionar `LEFT JOIN usuarios U ON U.FUN_CODIGO = F.FUN_CODIGO`.
- No método `getById`:
  - Incluir `U.USU_CODIGO` na projeção `SELECT`.
  - Adicionar `LEFT JOIN usuarios U ON U.FUN_CODIGO = F.FUN_CODIGO`.

### 2.2 DTO de Resposta (`src/modules/employee/dto/employee-response.dto.ts`)
- Adicionar o campo `USU_CODIGO` em `EmployeeResponseDto` (que é herdado por `EmployeeDetailResponseDto`):
  ```typescript
  @ApiPropertyOptional({
    example: 1,
    description: 'Código do usuário/operador do sistema associado ao funcionário (USU_CODIGO)',
  })
  USU_CODIGO?: number;
  ```

### 2.3 Testes Automatizados (`src/modules/employee/employee.service.spec.ts`)
- Atualizar os testes unitários garantindo que as queries SQL contenham `U.USU_CODIGO` e o `LEFT JOIN usuarios U`.

---

## 3. Critérios de Sucesso
- `npm run test -- src/modules/employee` passando com 100% de sucesso.
- Compilação do NestJS (`npm run build`) sem erros.
