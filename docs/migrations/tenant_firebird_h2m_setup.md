# Migração e Estrutura do Banco Tenant (Firebird) - Autenticação H2M

Este documento detalha o script DDL e os procedimentos necessários para adequar a base de dados de cada cliente (Firebird) ao suporte da autenticação H2M (Human-to-Machine) utilizada pelo Frontend Infovendas.

---

## 1. Alterações Estruturais na Tabela `USUARIOS`

Precisamos adicionar o campo `USU_SENHA_API` para armazenar o hash **`bcrypt`** da senha do operador.

### Script DDL (Idempotente com Bloco Anônimo Firebird 2.5+)

```sql
EXECUTE BLOCK AS
BEGIN
  -- Adiciona a coluna USU_SENHA_API caso ela não exista
  IF (NOT EXISTS (
    SELECT 1 
    FROM RDB$RELATION_FIELDS 
    WHERE RDB$RELATION_NAME = 'USUARIOS' 
      AND RDB$FIELD_NAME = 'USU_SENHA_API'
  )) THEN
  BEGIN
    EXECUTE STATEMENT 'ALTER TABLE USUARIOS ADD USU_SENHA_API VARCHAR(100)';
  END
END;
^
```

> [!NOTE]
> * O campo é intencionalmente **nullable** para não quebrar a aplicação desktop legada nem os usuários existentes.
> * Quando um operador for cadastrado ou redefinir a senha para acesso ao app de vendas, o backend gravará o hash `bcrypt` (custo padrão: salt 10 ou 12).

---

## 2. Dicionário de Campos Utilizados no Fluxo de Autenticação

Abaixo estão os campos da base de dados do tenant consultados durante a verificação de credenciais e status:

| Tabela | Campo | Tipo | Função no Fluxo H2M |
| :--- | :--- | :--- | :--- |
| `USUARIOS` | `USU_CODIGO` | `INTEGER` | Identificador único do operador no ERP. Injetado na claim `usu_codigo` do JWT e gravado nos pedidos. |
| `USUARIOS` | `USU_APELIDO` | `VARCHAR` | Login/Apelido do operador utilizado para autenticação. |
| `USUARIOS` | `USU_SENHA_API` | `VARCHAR(100)` | Hash bcrypt da senha de acesso ao ecossistema de vendas. |
| `USUARIOS` | `USU_SITUACAO` | `CHAR(1)` | Indicador de situação do usuário ('A' = Ativo, 'I' = Inativo/Bloqueado). |
| `USUARIOS` | `LOJ_CODIGO` | `INTEGER` | Loja/Filial de lotação do usuário. Injetado na claim `storeId` para precificação e estoque. |
| `USUARIOS` | `FUN_CODIGO` | `INTEGER` | Código do funcionário vinculado ao usuário. |
| `FUNCIONARIOS` | `FUN_CODIGO` | `INTEGER` | Chave primária da tabela de funcionários. |
| `FUNCIONARIOS` | `FUN_DATADEMISSAO` | `DATE` / `TIMESTAMP` | Data de rescisão do funcionário. Se preenchida, o operador é considerado inativo. |

---

## 3. Queries Padrão Executadas pela INFOAPI

### 3.1. Query de Verificação de Login (`POST /api/v1/auth/operator-verify`)

```sql
SELECT 
    U.USU_CODIGO,
    U.USU_APELIDO,
    U.USU_SENHA_API,
    U.USU_SITUACAO,
    U.LOJ_CODIGO,
    U.FUN_CODIGO,
    F.FUN_DATADEMISSAO
FROM USUARIOS U
LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = U.FUN_CODIGO
WHERE UPPER(U.USU_APELIDO) = UPPER(?)
```

**Regra de Aceite no Service**:
1. Registro encontrado;
2. `USU_SENHA_API` não nulo e `bcrypt.compare(password, USU_SENHA_API) === true`;
3. `COALESCE(U.USU_SITUACAO, 'A') = 'A'` (ou situação diferente de inativo/bloqueado);
4. `F.FUN_DATADEMISSAO IS NULL` (ou data futura caso admitido pela política).

---

### 3.2. Query Rápida de Status para Renovação (`GET /api/v1/auth/operator-status/:usuCodigo`)

Utilizada na renovação do Access Token a cada 15 minutos pelo STS:

```sql
SELECT 
    U.USU_CODIGO,
    U.USU_SITUACAO,
    U.LOJ_CODIGO,
    F.FUN_DATADEMISSAO
FROM USUARIOS U
LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = U.FUN_CODIGO
WHERE U.USU_CODIGO = ?
```

**Regra de Aceite**:
* `COALESCE(U.USU_SITUACAO, 'A') = 'A'` e `F.FUN_DATADEMISSAO IS NULL`.
* Se aprovado, devolve `{ active: true, storeId: U.LOJ_CODIGO }` para permitir que o STS rotacione o token com a loja atualizada.

---

## 4. Rollback (Caso Necessário)

```sql
EXECUTE BLOCK AS
BEGIN
  IF (EXISTS (
    SELECT 1 
    FROM RDB$RELATION_FIELDS 
    WHERE RDB$RELATION_NAME = 'USUARIOS' 
      AND RDB$FIELD_NAME = 'USU_SENHA_API'
  )) THEN
  BEGIN
    EXECUTE STATEMENT 'ALTER TABLE USUARIOS DROP USU_SENHA_API';
  END
END;
^
```
