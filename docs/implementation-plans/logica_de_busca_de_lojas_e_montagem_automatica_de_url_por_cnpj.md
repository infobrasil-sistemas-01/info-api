# Lógica de Leitura de Lojas e Montagem Interna de URL por CNPJ na Tela de Solicitações (Admin)

Este plano descreve a implementação da lógica interna para que:
1. **Quem preenche o formulário público não precise saber ou digitar o caminho/banco de dados**: ao enviar a solicitação, o backend busca internamente o CNPJ informado em `docs/relatorio_lojas.csv` e preenche automaticamente os dados de conexão/URL (`host`, `port`, `database`/`alias`, etc.).
2. **Exibição no Painel Admin (Solicitações)**: os campos e a URL montada são exibidos no card da solicitação.
3. **Botão de Sincronização**: inclusão de um botão no painel de Solicitações do Admin para sincronizar/atualizar as URLs e dados de conexão das solicitações já enviadas anteriormente com base no CNPJ.

---

## 1. Mapeamento dos Dados do CSV (`docs/relatorio_lojas.csv`)

O arquivo CSV utiliza o separador `;` e possui as seguintes colunas:
- `Servidor`: ex. `DB06`
- `Host`: ex. `db4padel.iprojectti.com.br`
- `Porta`: ex. `3056`
- `Alias`: ex. `4padel`
- `CNAME`: ex. `db4padel.iprojectti.com.br/3056:4padel`
- `LOJ_CODIGO`: ex. `1`
- `LOJ_FANTASIA`: ex. `4PADEL`
- `LOJ_NOME`: ex. `4PADEL LTDA`
- `LOJ_CNPJ`: ex. `53813096000173`

Padrão de URL/CNAME montado: `<Host>/<Porta>:<Alias>` (ou valor do `CNAME`).

---

## 2. Mudanças Propostas

### Backend

#### [MODIFY] [integration-request.service.ts](file:///c:/dev/info-api/src/modules/integration-request/integration-request.service.ts)
1. **Método auxiliar `getStoreByCnpj(cnpj: string)`**:
   - Lê e faz cache em memória do arquivo `docs/relatorio_lojas.csv` (com normalização de CNPJs apenas com dígitos).
   - Retorna os dados da loja correspondente: `host`, `port` (número), `database` (`alias`), `cname`, `server`, `storeCode`, `clientName`, `legalName`.
2. **Método `create(dto)`**:
   - Se o `cnpj` for informado e existir correspondência no CSV, preenche/sobrescreve internamente o campo `database` com `{ host: store.host, port: store.port, database: store.alias }`.
3. **Método `syncDatabasesByCnpj()`**:
   - Busca todas as `IntegrationRequest` cadastradas.
   - Para cada solicitação com CNPJ, busca o registro correspondente no CSV.
   - Atualiza no banco Prisma o campo `database` com os dados corretos de conexão do CSV.
   - Retorna contagem de registros atualizados, processados e não encontrados.

#### [MODIFY] [integration-request.controller.ts](file:///c:/dev/info-api/src/modules/integration-request/integration-request.controller.ts)
- Adicionar endpoint `POST /integration/sync-databases` (ou `POST /integration/sync-cnpj`) para disparar a sincronização das solicitações a partir do painel administrativo.

#### [NEW] [integration-request.service.spec.ts](file:///c:/dev/info-api/src/modules/integration-request/integration-request.service.spec.ts)
- Testes unitários para:
  - Leitura e mapeamento de lojas a partir do CSV.
  - Criação de solicitação com preenchimento interno automático de URL/banco a partir do CNPJ.
  - Sincronização em lote das solicitações existentes.

---

### Frontend

#### [MODIFY] [form.html](file:///c:/dev/info-api/src/modules/integration-request/templates/form.html)
- Remover a necessidade de o cliente preencher dados técnicos de banco de dados (`Host`, `Porta`, `Caminho do Banco`), mantendo o formulário simples e focado nos dados cadastrais, escopo e contatos.

#### [MODIFY] [admin-components.js](file:///c:/dev/info-api/src/modules/integration-request/templates/assets/admin-components.js)
- No cabeçalho da aba **Solicitações**, adicionar o botão de ação **"Sincronizar URLs"** (`bx-sync`) com tooltip explicativo.
- No `RequestCard`, exibir com destaque a URL/CNAME montada (ex: `db4padel.iprojectti.com.br/3056:4padel`) junto aos detalhes de banco.

#### [MODIFY] [admin-core.js](file:///c:/dev/info-api/src/modules/integration-request/templates/assets/admin-core.js)
- Implementar a função `Data.syncRequestsDatabase()`:
  - Dispara chamada para `POST /integration/sync-databases`.
  - Exibe feedback visual / toast com a quantidade de solicitações atualizadas.
  - Atualiza a lista de solicitações na tela (`Data.fetchRequests()`).

---

## 3. Plano de Verificação

### Testes Automatizados
- Executar a suíte de testes com `npm.cmd run test -- src/modules/integration-request`.

### Verificação Manual
1. Enviar uma nova solicitação pelo formulário `/integration/form` com o CNPJ `53813096000173` (sem preencher caminho de banco).
2. Acessar `/integration/admin` na aba **Solicitações** e verificar se o card exibe automaticamente o banco preenchido (`db4padel.iprojectti.com.br:3056 / 4padel`).
3. Clicar no botão **"Sincronizar URLs"** no painel Admin e verificar a sincronização de todas as solicitações existentes no banco de dados.
