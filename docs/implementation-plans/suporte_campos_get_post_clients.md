# Plano de Implementação: Suporte a Todos os Campos do GET no POST /clients

## 1. Contexto e Objetivo
O endpoint `POST /clients` atualmente recebia um subconjunto restrito de campos e aplicava valores default hardcoded (ex.: `LOJ_CODIGO: 1`, `CLI_UF: 'CE'`, `CLI_SITUACAO: 'A'`).
O objetivo é alinhar o `POST /clients` para suportar todos os dados retornados no `GET /clients/:id`, seguindo estritamente as seguintes regras:
1. **Sem preenchimento automático**: Não assumir nenhum valor default para campos omitidos; campos não informados devem ser persistidos como `NULL` no banco de dados.
2. **Campos Obrigatórios**: Qualquer campo que no banco (`CLIENTES`) seja `NOT NULL`, dentre os campos pertinentes ao recurso, deve ser obrigatório no DTO de criação (`CreateClientDto`).

## 2. Análise do DDL e Campos do `GET /clients/:id`

### 2.1. Campos Retornados no `GET /clients/:id`
O `ClientService.getById` executa a seguinte consulta:
- `C.CLI_CODIGO` (Chave primária - gerada no banco via `GEN_ID(GEN_CODIGOCLI, 1)`)
- `C.CLI_SITUACAO` (DDL: `VARCHAR(1) DEFAULT 'A' NOT NULL`)
- `C.CLI_NOME` (DDL: `VARCHAR(60) NOT NULL`)
- `C.CLI_FANTASIA` (DDL: `VARCHAR(40)`)
- `C.CLI_SEXO` (DDL: `VARCHAR(1) DEFAULT 'M'`)
- `C.CLI_ENDERECO` (DDL: `VARCHAR(120)`)
- `C.CLI_FONE` (DDL: `VARCHAR(12)`)
- `C.CLI_EMAIL` (DDL: `VARCHAR(200)`)
- `C.CLI_DATANASC` (DDL: `DATE`)
- `C.CLI_COMPL_ENDERECO` (DDL: `VARCHAR(40)`)
- `C.CLI_CEP` (DDL: `VARCHAR(9)`)
- `C.CLI_BAIRRO` (DDL: `VARCHAR(40)`)
- `C.MUN_CODIGO` (DDL: `INTEGER DEFAULT 2302404 NOT NULL`)
- `M.MUN_NOME` (Join com `MUNICIPIOS` - não é coluna de `CLIENTES`)
- `C.CLI_UF` (DDL: `VARCHAR(2) DEFAULT 'CE' NOT NULL`)
- `C.CLI_CPF_CNPJ` (DDL: `VARCHAR(14)`)
- `C.CLI_IDENTIDADE` (DDL: `VARCHAR(40)`)
- `C.CLI_MAE` (DDL: `VARCHAR(40)`)
- `C.CLI_PAI` (DDL: `VARCHAR(40)`)
- `C.CLI_ESTADOCIVIL` (DDL: `VARCHAR(1)`)
- `C.CLI_NATURALIDADE` (DDL: `VARCHAR(25)`)
- `R.ROT_CODIGO` (DDL: `INTEGER`)
- `R.ROT_NOME` (Join com `ROTAS` - não é coluna de `CLIENTES`)

Além desses, a tabela possui a chave de tenant/filial:
- `C.LOJ_CODIGO` (DDL: `INTEGER DEFAULT 1 NOT NULL`)

E o campo de celular já presente no schema anterior e DDL:
- `C.CLI_CELULAR` (DDL: `VARCHAR(12)`)

### 2.2. Classificação de Obrigatoriedade (DDL `NOT NULL`)

#### Obrigatórios no DTO (NOT NULL no banco):
- `LOJ_CODIGO`: `INTEGER NOT NULL` -> `z.number().int()`
- `CLI_NOME`: `VARCHAR(60) NOT NULL` -> `z.string().min(1).max(60)`
- `CLI_SITUACAO`: `VARCHAR(1) NOT NULL` -> `z.string().min(1).max(1)`
- `CLI_UF`: `VARCHAR(2) NOT NULL` -> `z.string().min(1).max(2)`
- `MUN_CODIGO`: `INTEGER NOT NULL` -> `z.number().int()`

#### Opcionais no DTO (Nullable no banco - default `null` no SQL se não informados):
- `CLI_FANTASIA`: `z.string().max(40).optional().nullable()`
- `CLI_SEXO`: `z.string().max(1).optional().nullable()`
- `CLI_ENDERECO`: `z.string().max(120).optional().nullable()`
- `CLI_COMPL_ENDERECO`: `z.string().max(40).optional().nullable()`
- `CLI_CEP`: `z.string().max(9).optional().nullable()`
- `CLI_BAIRRO`: `z.string().max(40).optional().nullable()`
- `CLI_FONE`: `z.string().max(12).optional().nullable()`
- `CLI_CELULAR`: `z.string().max(12).optional().nullable()`
- `CLI_EMAIL`: `z.string().max(200).optional().nullable()`
- `CLI_DATANASC`: `z.string().optional().nullable()` (formato data)
- `CLI_CPF_CNPJ`: `z.string().max(14).optional().nullable()`
- `CLI_IDENTIDADE`: `z.string().max(40).optional().nullable()`
- `CLI_MAE`: `z.string().max(40).optional().nullable()`
- `CLI_PAI`: `z.string().max(40).optional().nullable()`
- `CLI_ESTADOCIVIL`: `z.string().max(1).optional().nullable()`
- `CLI_NATURALIDADE`: `z.string().max(25).optional().nullable()`
- `ROT_CODIGO`: `z.number().int().optional().nullable()`

## 3. Modificações no Código

1. **`src/modules/client/dto/create-client.dto.ts`**:
   - Atualizar `CreateClientSchema` removendo defaults (`.default(...)`) dos campos obrigatórios.
   - Adicionar os campos que faltavam (`CLI_SITUACAO`, `MUN_CODIGO`, `CLI_SEXO`, `CLI_EMAIL`, `CLI_DATANASC`, `CLI_IDENTIDADE`, `CLI_MAE`, `CLI_PAI`, `CLI_ESTADOCIVIL`, `CLI_NATURALIDADE`, `ROT_CODIGO`).
   - Atualizar a classe `CreateClientDto` com anotações `@ApiProperty` e `@ApiPropertyOptional`.

2. **`src/modules/client/client.service.ts`**:
   - No método `create`, atualizar a query `INSERT INTO clientes` para incluir todas as colunas correspondentes.
   - Não aplicar fallbacks como `'A'`, `'CE'`, etc. Usar estritamente `data.CAMPO ?? null` para parâmetros opcionais e `data.CAMPO` para obrigatórios.

3. **Testes Unitários**:
   - Atualizar `src/modules/client/client.service.spec.ts` com os novos campos e validações de passagem de parâmetros nulos.
   - Executar suíte de testes com `npm test`.

## 4. Restrições do Usuário
- Não realizar commit nem push via git.
