# Plano de Execução: Rotação de Credenciais do Banco em Produção (Zero-Downtime)

## 1. Contexto e Objetivos

* **Cenário**: A aplicação subiu em produção apontando para o PostgreSQL com o superusuário padrão (`postgres`) e senha de ambiente de testes.
* **Objetivos Inegociáveis**:
  1. **Zero perda de dados** (DCL puro; nenhuma operação destrutiva de dados ou schema).
  2. **Zero downtime** na API (continuidade de requisições sem indisponibilidade).
  3. **Correção de segurança e privilégios** (transição para usuário dedicado com menor privilégio aplicável, PostgreSQL 16).
  4. **Proteção do superusuário** (`postgres` isolado e protegido com senha forte).

---

## 2. Arquitetura da Transição (Mapeada com deploy.sh e docker-compose.yml)

> [!CAUTION]
> **ACHADO CRÍTICO NO DOCKER-COMPOSE**:
> No [`docker-compose.yml`](file:///c:/dev/info-api/docker-compose.yml#L16-L50), a variável `DATABASE_URL` está **chumbada (hardcoded)** diretamente sob a chave `environment` de `infoapi-blue` e `infoapi-green`:
> ```yaml
> environment:
>   - DATABASE_URL=postgres://postgres:postgres@postgres:5432/infoapi?schema=public
> ```
> No Docker Compose, declarações em `environment` têm **precedência absoluta** sobre o `env_file: .env`. Portanto, simplesmente editar o `.env` **não surtirá efeito** no container até que o `docker-compose.yml` seja ajustado para ler da variável (`- DATABASE_URL=${DATABASE_URL}`).

```mermaid
sequenceDiagram
    autonumber
    participant DBA as Operador / Script
    participant PG as PostgreSQL 16 (infoapi-db)
    participant Live as Container Ativo (infoapi-blue/green com postgres)
    participant Nginx as Gateway (api-gateway)
    participant Target as Target Container (com novo app_user)

    Note over DBA,PG: FASE 1: Provisionamento e Permissões
    DBA->>PG: docker exec infoapi-db psql (Cria app_user + Grants + Herança postgres)
    DBA->>PG: docker exec infoapi-db psql (Testa SELECT 1 com app_user)

    Note over DBA,Target: FASE 2: Ajuste de Config e Deploy do Target
    DBA->>DBA: Ajusta docker-compose.yml (- DATABASE_URL=${DATABASE_URL})
    DBA->>DBA: Atualiza .env com a nova DATABASE_URL (app_user)
    DBA->>Target: Executa rotina de deploy (deploy.sh)
    Target->>PG: Prisma Migrate Deploy + NestJS sobe
    Target-->>DBA: docker inspect -> healthy

    Note over DBA,Nginx: FASE 3: Switch de Tráfego e Drenagem
    DBA->>Nginx: sed upstream no default.conf + nginx -s reload
    DBA->>Live: docker compose stop && docker compose rm do antigo

    Note over DBA,PG: FASE 4: Blindagem do postgres
    DBA->>PG: ALTER USER postgres WITH PASSWORD 'nova_senha_forte';
    DBA->>DBA: Atualiza POSTGRES_PASSWORD no .env para reboots futuros
```

---

## 3. Matriz de Permissões PostgreSQL 16

No PostgreSQL 16, a revogação padrão de `CREATE` no schema `public` exige configuração explícita para que o Prisma Migrate funcione sem erros:

| Objeto / Escopo | Comando Necessário | Justificativa |
| :--- | :--- | :--- |
| **Database** | `GRANT CONNECT ON DATABASE <db> TO <user>` | Permissão de handshake TCP e autenticação inicial. |
| **Schema `public`** | `GRANT USAGE, CREATE ON SCHEMA public TO <user>` | Obrigatório no PG 16 para criar tabelas de migrações e de negócio. |
| **Tabelas Existentes** | `GRANT ALL ON ALL TABLES IN SCHEMA public TO <user>` | Operações de DML (`SELECT`, `INSERT`, etc.) pela API. |
| **Sequências Existentes**| `GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO <user>` | Operações de autoincremento e serial IDs. |
| **Ownership DDL** | `ALTER TABLE/SEQUENCE ... OWNER TO <user>` ou `GRANT postgres TO <user>` | Permite ao Prisma rodar `ALTER TABLE`, `DROP INDEX` nas tabelas já criadas. |
| **Novos Objetos** | `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES/SEQUENCES TO <user>` | Garante acesso a objetos criados no futuro. |

---

## 4. Pipeline Operacional Blindado (Alinhado com deploy.sh)

### Passo 1: Provisionar Novo Usuário via `infoapi-db`
Executar dentro do container do PostgreSQL:
```bash
docker exec -i infoapi-db psql -U postgres -d infoapi <<'EOF'
-- Cria usuário da aplicação
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD 'NOVA_SENHA_FORTE_APP';
  ELSE
    ALTER ROLE app_user WITH PASSWORD 'NOVA_SENHA_FORTE_APP';
  END IF;
END
$$;

-- Permissões essenciais PostgreSQL 16
GRANT CONNECT ON DATABASE infoapi TO app_user;
GRANT USAGE, CREATE ON SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Herança da role postgres para gerenciar tabelas já existentes pelo Prisma
GRANT postgres TO app_user;

-- Privilégios padrão para novos objetos
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO app_user;
EOF
```

### Passo 2: Validar Autenticação do Novo Usuário
Garantir que a credencial funciona antes de qualquer alteração de código ou infra:
```bash
docker exec -i infoapi-db psql -U app_user -d infoapi -c "SELECT 1;"
```

### Passo 3: Ajuste de Configuração
1. Em [`docker-compose.yml`](file:///c:/dev/info-api/docker-compose.yml), substituir o valor estático por interpolação de variável nas linhas 16 e 50:
   ```yaml
   environment:
     - DATABASE_URL=${DATABASE_URL}
     - PORT=${PORT}
   ```
2. No `.env`, atualizar a `DATABASE_URL`:
   ```dotenv
   DATABASE_URL="postgres://app_user:NOVA_SENHA_FORTE_APP@postgres:5432/infoapi?schema=public"
   ```

### Passo 4: Executar o Blue-Green Existente
Executar o script padrão do projeto:
```bash
./deploy.sh
```
*O que o `deploy.sh` fará automaticamente sem downtime:*
1. Detecta o container inativo (`TARGET_SERVICE`).
2. Roda `docker compose run --rm $TARGET_SERVICE npx prisma migrate deploy` com a nova credencial (validação DDL).
3. Sobe o container e aguarda o status `healthy` via healthcheck `/api/v1/health/live`.
4. Atualiza o upstream do `api-gateway` e executa `nginx -s reload` (switch sem drop de conexões).
5. Encerra o container antigo (`LIVE_SERVICE`).

### Passo 5: Blindar a Senha do `postgres`
Com o tráfego 100% no container novo:
```bash
docker exec -i infoapi-db psql -U postgres -d infoapi -c "ALTER USER postgres WITH PASSWORD 'NOVA_SENHA_FORTE_POSTGRES';"
```
Atualizar `POSTGRES_PASSWORD` no `.env` para manter sincronizado com reinícios do container de banco.

---

## 5. Roteiro de Rollback

Se o Container Green falhar no Step 2:
1. **Não alterar o Nginx**. O container Blue permanece intacto e servindo tráfego normal.
2. Destruir container Green (`docker rm -f <green_container>`).
3. O usuário `postgres` ainda possui a senha antiga, garantindo 100% de disponibilidade contínua da API.
