# ADR 001: Resolução e Validação Condicional de Loja (`storeId`) por Contexto de Autenticação (H2M vs M2M)

- **Status:** Aceito
- **Data:** 2026-09-24
- **Autores:** Gabriel Bezerra / Time de Engenharia
- **Contexto de Aplicação:** `GET /products` (módulo de produtos)

---

## 1. Contexto e Problema

Originalmente, a consulta de produtos (`GET /products`) exigia obrigatoriamente o parâmetro de consulta `storeId` no DTO (`GetProductsQueryDto`) para determinar em qual filial buscar estoques e preços.

Com a evolução da arquitetura de autenticação da `info-api` e a separação dos perfis de acesso:
1. **H2M (*Human-to-Machine*):** Operadores e vendedores logados via STS (Single Sign-On / PDV), cujo token JWT já carrega o identificador da loja à qual o operador pertence (`tokenStoreId`).
2. **M2M (*Machine-to-Machine*):** Integrações diretas entre sistemas, parceiros ou serviços de retaguarda (autenticação por credenciais de integração).

Exigir que o frontend envie `storeId` para operadores H2M criava atrito desnecessário e abria margem para o cliente enviar uma filial divergente daquela em que o operador tem permissão de operar. Por outro lado, adotar um fallback ingênuo ou silencioso (ex: `query.storeId || tokenStoreId || 1`) geraria duas falhas arquiteturais graves:
- **Sobrescrita silenciosa (*Silent Parameter Swallowing*):** Se o operador da Loja 1 tentasse consultar a Loja 2, a API responderia com sucesso (`200 OK`) entregando os dados da Loja 1, induzindo a interface e o operador ao erro de leitura de estoque.
- **Quebra de isolamento multiloja em M2M:** Uma integração sem `storeId` consultaria silenciosamente a Loja 1 como padrão, potencialmente vazando preços e estoques de um tenant/franquia não contratado.

---

## 2. Decisão

Decidiu-se estruturar a resolução e a validação do `storeId` em dois níveis complementares:

### 2.1. Flexibilização no Contrato de Entrada (DTO)
O campo `storeId` no schema Zod (`GetProductsQuerySchema`) e no DTO (`GetProductsQueryDto`) torna-se **opcional** (`z.coerce.number().int().optional()`).

A documentação via Swagger (`@ApiPropertyOptional`) foi ajustada para explicitar as regras de negócio de acordo com o tipo de credencial:
> *"Código da loja para buscar os estoques dos produtos. Obrigatório para integrações M2M. Para operadores (H2M), é opcional e assume a loja vinculada ao usuário (se informado, deve ser idêntico à loja do operador)."*

### 2.2. Validação Contextual e Princípio Fail-Fast no Controller
A camada de transporte HTTP (`ProductController`) é responsável por traduzir o contexto de autorização (`req.authContext`) antes de delegar para o `ProductService`:

1. **Quando `type === 'H2M'`:**
   - O `storeId` é derivado diretamente do `tokenStoreId`.
   - Se o cliente enviar explicitamente um `query.storeId` diferente do `tokenStoreId`, a API rejeita a requisição imediatamente com **`403 Forbidden`** (*"Operador não autorizado a consultar dados de outra filial"*), em conformidade com o princípio de autorização da RFC 9110.

2. **Quando `type === 'M2M'` (ou qualquer integração externa):**
   - O `query.storeId` torna-se estritamente obrigatório.
   - Se ausente, a API rejeita imediatamente com **`400 Bad Request`** (*"O parâmetro storeId é obrigatório para integrações diretas (M2M)"*).

### 2.3. Desacoplamento da Camada de Domínio/Serviço
O `ProductService.get` continua recebendo um `storeId: number` primitivo já validado e higienizado. O serviço não toma conhecimento de tokens, JWT, cookies ou regras de transporte HTTP.

---

## 3. Consequências e Trade-Offs

### Positivas
- **Previsibilidade e Segurança (Fail-Fast):** Nenhuma filial é consultada "por acidente" ou com coerção silenciosa. O integrador ou frontend é notificado na hora caso cometa um erro de escopo.
- **Ergonomia no Frontend H2M:** Operadores não precisam injetar ou persistir manualmente o ID da loja nas chamadas de catálogo; a identidade vem atrelada ao token criptográfico.
- **Isolamento de Responsabilidades:** O `ProductService` permanece coeso e fácil de testar isoladamente, sem acoplamento com o modelo de autenticação.
- **Compatibilidade Retroativa:** Clientes M2M existentes que já enviavam `storeId` continuam funcionando sem interrupção (*non-breaking change*).

### Negativas / Débitos Aceitos
- **Divergência OpenAPI vs. Runtime M2M:** Ferramentas de geração estática de código no frontend/M2M enxergarão `storeId` como opcional na tipagem TypeScript gerada, dependendo da leitura da documentação textual ou do erro 400 em tempo de integração/teste.
- **Replicação Futura:** A mesma decisão deve ser estendida para outros endpoints que dependem de escopo de filial (como `GET /products/id/:id` e `GET /products/barcode/:barcode`) para manter a coerência de design em todo o módulo.
