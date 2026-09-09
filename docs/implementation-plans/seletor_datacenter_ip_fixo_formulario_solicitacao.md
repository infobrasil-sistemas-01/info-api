# Seletor "DataCenter" / "IP Fixo" no Formulário de Solicitação

## Contexto e Objetivo
Permitir que clientes que possuem infraestrutura própria com IP Fixo possam preencher manualmente os dados de conexão com o banco de dados Firebird (Host/IP, Porta e Caminho do Banco) no formulário público de solicitação de integração (`/integration/form`). Para clientes hospedados no DataCenter da InfoBrasil, as credenciais e endereços continuam sendo resolvidos automaticamente pelo CNPJ a partir do catálogo/CSV de lojas ou utilizando o fallback padrão de DataCenter.

## Alterações Planejadas

1. **Frontend / Formulário (`src/modules/integration-request/templates/form.html`)**:
   - Reintroduzir o campo `Tipo de Hospedagem` (`<select id="hostingType">`) com as opções:
     - `DataCenter` (`DATACENTER`)
     - `IP Fixo` (`CLIENT_SERVER`)
   - Reintroduzir a seção `#db-section` para entrada dos dados do banco Firebird:
     - `dbHost` (Host / IP Fixo)
     - `dbPort` (Porta, padrão 3050)
     - `dbName` (Caminho do Banco / Database)
   - Adicionar a função `toggleDbSection()` que exibe a seção apenas quando `IP Fixo` for selecionado e torna os campos obrigatórios dinamicamente.
   - Ajustar o payload do `onsubmit` para enviar `hostingType`, `fixedIp` e o objeto `database` com os valores informados quando for `CLIENT_SERVER`, ou o padrão de DataCenter quando `DATACENTER`.

2. **Backend / Serviço (`src/modules/integration-request/integration-request.service.ts`)**:
   - No método `create()`, verificar se `hostingType === 'CLIENT_SERVER'`. Caso seja, respeitar a configuração de banco enviada pelo cliente em vez de sobrescrever com a consulta do CSV.
   - No método `syncDatabasesByCnpj()`, ignorar solicitações cujo `hostingType === 'CLIENT_SERVER'` para preservar os dados de conexão de IP Fixo dos clientes.

3. **Testes Unitários (`src/modules/integration-request/integration-request.service.spec.ts`)**:
   - Adicionar testes cobrindo a criação com `CLIENT_SERVER` (preservando o banco informado).
   - Validar que `syncDatabasesByCnpj` não sobrescreve registros `CLIENT_SERVER`.
