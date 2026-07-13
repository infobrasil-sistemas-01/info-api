# Padronização do GET Geral de Contas a Receber

Este plano de implementação descreve as alterações realizadas para padronizar o método `get` geral do módulo de Contas a Receber (`AccountReceivable`), alinhando-o com os padrões estabelecidos na `Info Vendas API`.

## Objetivos

1. **Assinatura Uniforme**: Adequar a assinatura do método `get` de `AccountReceivableService` para aceitar os parâmetros padrões de controle: `storeId` e `pageSize`.
2. **Filtragem por Loja**: Incluir a cláusula de filtragem por loja no SQL executado no banco Firebird utilizando `cli.loj_codigo = ?`.
3. **Paginação Dinâmica**: Remover o tamanho de página estático (`pageSize = 25`) e torná-lo dinâmico por meio do parâmetro `pageSize`.
4. **Log de Auditoria Unificado**: Padronizar a mensagem de log emitida ao final da busca para incluir todos os parâmetros de paginação e filtragem.
5. **Atualização da Camada de Controle**: Enriquecer o `AccountReceivableController` com os novos parâmetros de consulta e os decorators Swagger (`@ApiQuery`) correspondentes.
6. **Integridade da Suíte de Testes**: Ajustar e atualizar 100% dos testes unitários e de integração correspondentes, assegurando que o comportamento continue operando perfeitamente e sem quebras.

## Alterações Realizadas

### 1. `AccountReceivableService`

- Atualização da assinatura do método `get` para:
  ```typescript
  async get(
    credentialsId: string,
    storeId: number = 1,
    page: number = 1,
    pageSize: number = 100,
    clientId?: number,
    arId?: number,
    situation?: string,
    startDate?: string,
    endDate?: string
  )
  ```
- Adicionada validação de `pageSize < 1`.
- Ajustada a consulta SQL para incluir a junção e o filtro `WHERE cli.loj_codigo = ?` associado ao parâmetro `storeId`.
- Atualizado o log estruturado:
  ```typescript
  this.logger.log(
    `Busca de Contas a Receber executada. Tenant: ${credentialsId}, Filtros: ${JSON.stringify({
      storeId,
      page,
      pageSize,
      clientId,
      arId,
      situation,
      startDate,
      endDate,
    })}, Itens: ${result.length}, Tempo SQL: ${queryEndTime - queryStartTime}ms`
  );
  ```

### 2. `AccountReceivableController`

- Adicionados decorators `@ApiQuery` para `storeId` (default 1) e `pageSize` (default 10).
- Atualizado o tipo do parâmetro do método de controle `get` para capturar `storeId` e `pageSize`.
- Passados os parâmetros de forma posicional e ordenada na chamada para o serviço.

### 3. Testes Unitários e Correções

- Atualizados os arquivos de teste:
  - `account-receivable.service.spec.ts`
  - `account-receivable.controller.spec.ts`
  - `employee.controller.spec.ts`
  - `employee.service.spec.ts`
  - `employee-role.service.spec.ts`
- Toda a suíte de testes (46 suítes, 283 testes) passa com sucesso (100% green).
