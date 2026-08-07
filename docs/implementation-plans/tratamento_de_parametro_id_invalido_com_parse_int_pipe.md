# Tratamento de Parâmetro ID Inválido com ParseIntPipe

## Visão Geral

Atualmente, quando uma integração realiza uma requisição HTTP enviando `"undefined"` ou uma string não numérica como parâmetro de rota `:id` (exemplo: `GET /api/v1/clients/undefined`), o NestJS repassa essa string diretamente para o service sem tratamento prévio. Ao executar a consulta SQL no Firebird com `WHERE CLI_CODIGO = 'undefined'`, o banco de dados lança o erro:
`Dynamic SQL Error, SQL error code = -303, Conversion error from string "undefined"`
Isso resulta em um erro de servidor `500 Internal Server Error`.

O objetivo desta alteração é validar e interceptar parâmetros de rota numéricos utilizando o `ParseIntPipe` nativo do NestJS (e validação defensiva nos serviços), garantindo que requisições com IDs inválidos como `"undefined"` ou `"abc"` retornem imediatamente um status HTTP `400 Bad Request`.

## Usuário Requer Revisão

> [!IMPORTANT]
> A inclusão do `ParseIntPipe` altera o código de resposta HTTP de `500 Internal Server Error` para `400 Bad Request` quando integradores enviarem `undefined` ou strings não numéricas no caminho da URL. Esta é a conduta padrão e esperada para APIs REST.

## Mudanças Propostas

### 1. Módulo de Clientes (`src/modules/client/`)

#### [MODIFY] [client.controller.ts](file:///c:/dev/info-api/src/modules/client/client.controller.ts)
- Importar `ParseIntPipe` do `@nestjs/common`.
- Aplicar `ParseIntPipe` nos parâmetros `@Param('id', ParseIntPipe) id: number` das rotas `GET /api/v1/clients/:id` e `PATCH /api/v1/clients/:id`.

#### [MODIFY] [client.service.ts](file:///c:/dev/info-api/src/modules/client/client.service.ts)
- Adicionar validação defensiva em `getById` e `update` para checar `!id || Number.isNaN(Number(id)) || Number(id) <= 0`, lançando `BadRequestException('ID do cliente é inválido.')` caso um ID inválido seja fornecido.

#### [NEW] [client.controller.spec.ts](file:///c:/dev/info-api/src/modules/client/client.controller.spec.ts)
- Criar suíte de testes unitários do `ClientController` cobrindo chamadas válidas e invalidação via `ParseIntPipe` ou exceções de Bad Request.

---

### 2. Outros Controllers com ID Numérico no Path

Adicionar `ParseIntPipe` nos parâmetros `@Param('id', ParseIntPipe)` dos demais controllers que possuem IDs numéricos de entidade em rotas REST:

#### [MODIFY] [supplier.controller.ts](file:///c:/dev/info-api/src/modules/supplier/supplier.controller.ts)
#### [MODIFY] [employee.controller.ts](file:///c:/dev/info-api/src/modules/employee/employee.controller.ts)
#### [MODIFY] [delivery.controller.ts](file:///c:/dev/info-api/src/modules/delivery/delivery.controller.ts)
#### [MODIFY] [product.controller.ts](file:///c:/dev/info-api/src/modules/product/product.controller.ts)
#### [MODIFY] [product-brand.controller.ts](file:///c:/dev/info-api/src/modules/product/brand/product-brand.controller.ts)
#### [MODIFY] [product-group.controller.ts](file:///c:/dev/info-api/src/modules/product/group/product-group.controller.ts)
#### [MODIFY] [order.controller.ts](file:///c:/dev/info-api/src/modules/order/order.controller.ts)
#### [MODIFY] [account-payable.controller.ts](file:///c:/dev/info-api/src/modules/account-payable/account-payable.controller.ts)
#### [MODIFY] [service-provider.controller.ts](file:///c:/dev/info-api/src/modules/service-provider/service-provider.controller.ts)

---

## Plano de Verificação

### Testes Automatizados
- Executar os testes unitários do serviço e do controller de cliente:
  ```bash
  npm run test src/modules/client
  ```
- Executar a suíte completa de testes unitários para garantir zero regressões:
  ```bash
  npm run test
  ```

### Verificação Manual / Comportamental
- Validar que requisições com IDs válidos (ex: `1`, `100`) continuam funcionando com retorno `200 OK`.
- Validar que requisições com `undefined` (ex: `GET /api/v1/clients/undefined`) retornam `400 Bad Request` com a estrutura padronizada de erro.
