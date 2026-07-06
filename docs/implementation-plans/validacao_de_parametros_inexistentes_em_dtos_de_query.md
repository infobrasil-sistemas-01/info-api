# Validação de Parâmetros Inexistentes em Query DTOs

## Objetivo

Implementar a validação de parâmetros de consulta (Query Parameters) inexistentes/inválidos em todos os endpoints de consulta da API. Atualmente, se um cliente enviar um parâmetro inexistente (por exemplo, em português como `pagina` ou `tamanho` em vez de `page` ou `pageSize`), o NestJS e o Zod silenciosamente ignoram o parâmetro e retornam o resultado sem o filtro correspondente. 

Com essa alteração, qualquer parâmetro de query enviado que não esteja explicitamente mapeado no DTO de query correspondente resultará em um erro HTTP `400 Bad Request`. O erro trará uma mensagem amigável indicando qual parâmetro específico é inválido e sugerindo ao cliente que consulte a documentação para verificar os campos válidos, sem adivinhar os nomes (especialmente evitando usar tradutores automáticos como Google Tradutor).

---

## Modificações Propostas

### 1. Infraestrutura Global de Validação

#### [MODIFY] [zod-validation.pipe.ts](file:///c:/dev/infoapi/src/common/validation/zod-validation.pipe.ts)
- Adicionar detecção de parâmetro do tipo `'query'` (`metadata.type === 'query'`).
- Tornar o schema do Zod strict (`schema.strict()`) dinamicamente antes do parse, se for um schema de objeto do Zod que suporta `.strict()`.
- Capturar erros com código `unrecognized_keys` (`ZodIssueCode.unrecognized_keys`) e mapear cada chave não reconhecida para uma mensagem de erro em português amigável e instrutiva:
  > `"O parâmetro '${key}' não existe nesta consulta. Por favor, consulte a documentação da API para verificar os parâmetros válidos (e evite usar o Google Tradutor)."`

---

### 2. Conversão de DTOs Legados para ZodDto

Atualmente, quase todos os query DTOs utilizam `ZodDto`, exceto as rotas de Contas a Pagar (`AccountPayable`) e Contas a Receber (`AccountReceivable`). Iremos converter ambos para garantir consistência e para que a validação estrita funcione neles automaticamente.

#### [MODIFY] [account-payable-query.dto.ts](file:///c:/dev/infoapi/src/modules/account-payable/dto/account-payable-query.dto.ts)
- Redefinir a classe `AccountPayableQueryDto` para estender `ZodDto(AccountPayableQuerySchema)`.
- Criar o schema correspondente `AccountPayableQuerySchema` usando `z.object` e tipando adequadamente os campos (`page`, `pageSize`, `storeId`, `supplierId`, `situation` via `z.nativeEnum(AccountPayableSituation)`, `startDate`, `endDate`).

#### [NEW] [get-account-receivables-query.dto.ts](file:///c:/dev/infoapi/src/modules/account-receivable/dto/get-account-receivables-query.dto.ts)
- Criar o DTO `GetAccountReceivablesQueryDto` que estende `ZodDto(GetAccountReceivablesQuerySchema)`.
- Definir o schema `GetAccountReceivablesQuerySchema` cobrindo todos os filtros existentes da rota de Contas a Receber (`page`, `pageSize`, `storeId`, `clientId`, `arId`, `situation`, `startDate`, `endDate`).

#### [MODIFY] [account-receivable.controller.ts](file:///c:/dev/infoapi/src/modules/account-receivable/account-receivable.controller.ts)
- Importar e utilizar o novo DTO `GetAccountReceivablesQueryDto` no lugar da tipagem inline atual de `@Query() params`.

---

### 3. Testes Unitários

#### [NEW] [zod-validation.pipe.spec.ts](file:///c:/dev/infoapi/src/common/validation/zod-validation.pipe.spec.ts)
- Criar arquivo de testes unitários dedicado para a `ZodValidationPipe` para testar:
  1. Validação bem-sucedida de parâmetros válidos em query/body.
  2. Validação padrão de body (ignora parâmetros extras por padrão/não falha).
  3. Validação de query (falha se houver parâmetros não declarados e gera o erro HTTP 400 estruturado com a mensagem esperada).

---

## Plano de Verificação

### Testes Automatizados
- Executar os testes unitários do projeto para garantir que nenhuma regressão foi introduzida:
  ```bash
  npm run test
  ```
- Criar e rodar o teste unitário de `ZodValidationPipe` para garantir que o comportamento da validação estrita e a formatação da mensagem de erro funcionam como esperado.

### Verificação Manual
- Iniciar a aplicação localmente:
  ```bash
  npm run start:dev
  ```
- Executar chamadas HTTP de teste (usando `curl` ou ferramenta similar) para os endpoints de query (ex: `/api/v1/client`, `/api/v1/supplier`):
  1. Com parâmetros corretos: deve retornar `200 OK`.
  2. Com parâmetros inválidos (ex: `/api/v1/client?pagina=2` ou `/api/v1/client?random=abc`): deve retornar `400 Bad Request` com o erro detalhado e a mensagem amigável solicitada.
