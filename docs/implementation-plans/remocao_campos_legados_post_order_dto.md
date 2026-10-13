# Remoção de Campos Legados no PostOrderDto (`id`, `has_invoice`, `has_payment`)

## 1. Contexto e Motivação

A retirada de tais campos dá-se pela irrelevância dos mesmos, devido à mudança de propósito da API, que partiu de um uso particular para um mais amplo e geral, com múltiplas possibilidades.

Historicamente, o endpoint `POST /orders` foi concebido inicialmente para atender a uma integração específica com um e-commerce parceiro (commit `0a65444`). Nesse cenário original:
- O campo `id` representava o ID externo do pedido na plataforma terceira (gravado em `VEN_ID_ECOMMERCE` e `VEN_NUMSITE` no Firebird).
- Os campos `has_invoice` e `has_payment` sinalizavam o estado financeiro/fiscal na plataforma de origem, mas nunca chegaram a ser persistidos ou processados pelas rotas de pedidos do ERP.

Com a evolução da API para uma camada universal de integração para múltiplos clientes e canais (PDV, plataformas B2B, outros ERPs, CRMs e e-commerces diversos), exigir esses campos tornou-se obsoleto e restritivo. A chave primária oficial da venda é atribuída pelo próprio gerador do ERP Firebird (`GEN_ID(GEN_NUMEROVEN, 1)`), e as informações financeiras e fiscais possuem fluxos e regras próprios.

---

## 2. Escopo das Alterações

### 2.1 Schema Zod e DTO (`src/modules/order/dto/create-order.dto.ts`)
- Remover do `PostOrderSchema`:
  - `id: z.number()`
  - `has_payment: z.boolean()`
  - `has_invoice: z.boolean()`
- Remover da classe `PostOrderDto`:
  - Propriedade `id` e seu decorador `@ApiProperty`
  - Propriedade `has_payment` e seu decorador `@ApiProperty`
  - Propriedade `has_invoice` e seu decorador `@ApiProperty`

### 2.2 Camada de Serviço (`src/modules/order/order.service.ts`)
- Em `insertOrderOnDb`:
  - Definir `VEN_ID_ECOMMERCE` e `VEN_NUMSITE` como `null` na inserção padrão de venda.
- No tratamento de erro do commit de transação:
  - Substituir a interpolação `orderData.id` por `order?.VEN_NUMERO ?? ''`.

### 2.3 Testes Automatizados
- `src/modules/order/dto/create-order.dto.spec.ts`:
  - Limpar do `validOrder` os campos `id`, `has_payment` e `has_invoice`.
  - Remover cenários de obrigatoriedade e tipagem para esses 3 campos.
- `src/modules/order/order.service.spec.ts`:
  - Remover `id`, `has_payment`, `has_invoice` dos objetos de teste e mocks.
- `src/modules/order/order.controller.spec.ts`:
  - Remover `dto.id`, `dto.has_payment`, `dto.has_invoice` dos testes unitários do controller.
- `test/app.e2e-spec.ts`:
  - Remover os 3 campos do payload de teste E2E de criação de pedido.

---

## 3. Critérios de Sucesso
- `npm run build` compila com 0 erros de tipagem TypeScript.
- Suíte completa de testes unitários (`npm run test`) passa com sucesso.
- O contrato Swagger (`/api/docs`) não expõe mais os campos como obrigatórios/existentes no payload de criação de pedidos.
