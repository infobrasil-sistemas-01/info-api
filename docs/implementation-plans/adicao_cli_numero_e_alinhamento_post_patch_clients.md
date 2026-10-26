# Plano de Implementação: Adição de CLI_NUMERO e Alinhamento de Campos POST/PATCH de Clientes

## Objetivo
1. Permitir que o endpoint `PATCH /clients/:id` receba e atualize todos os campos aceitos no `POST /clients` (`LOJ_CODIGO`, `CLI_NOME`, `CLI_SITUACAO`, `CLI_UF`, `MUN_CODIGO`, `CLI_FANTASIA`, `CLI_SEXO`, `CLI_ENDERECO`, `CLI_NUMERO`, `CLI_COMPL_ENDERECO`, `CLI_CEP`, `CLI_BAIRRO`, `CLI_FONE`, `CLI_CELULAR`, `CLI_EMAIL`, `CLI_DATANASC`, `CLI_CPF_CNPJ`, `CLI_IDENTIDADE`, `CLI_MAE`, `CLI_PAI`, `CLI_ESTADOCIVIL`, `CLI_NATURALIDADE`, `ROT_CODIGO`).
2. Adicionar o campo `CLI_NUMERO` nos DTOs de criação (`CreateClientDto`), atualização (`UpdateClientDto`) e no retorno das consultas (`GET /clients` e `GET /clients/:id` via `ClientResponseDto` / `ClientDetailResponseDto`).
3. Atualizar queries SQL e mapeamentos no `ClientService`.
4. Atualizar e expandir a suíte de testes unitários (`create-client.dto.spec.ts`, `update-client.dto.spec.ts`, `client.service.spec.ts`).

## Arquivos Modificados
- `src/modules/client/dto/create-client.dto.ts`
- `src/modules/client/dto/update-client.dto.ts`
- `src/modules/client/dto/client-response.dto.ts`
- `src/modules/client/client.service.ts`
- `src/modules/client/dto/create-client.dto.spec.ts`
- `src/modules/client/dto/update-client.dto.spec.ts` (ou criação se não existir)
- `src/modules/client/client.service.spec.ts`
