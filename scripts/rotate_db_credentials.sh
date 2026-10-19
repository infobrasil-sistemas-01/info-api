#!/usr/bin/env bash
# =============================================================================
# Script Auxiliar de Rotação de Credenciais de Banco (Zero Downtime)
# Projeto: Info Vendas API
# Instância do Postgres no servidor: infoapi-db
# =============================================================================
set -euo pipefail

echo "============================================================"
echo "  ROTAÇÃO DE SENHA DO BANCO DE DADOS - ZERO DOWNTIME"
echo "============================================================"

# Solicita as senhas com ocultação na digitação
read -rsp "Digite a NOVA senha forte para o novo usuário 'app_user': " NEW_APP_PASS
echo ""
read -rsp "Confirme a NOVA senha forte para o novo usuário 'app_user': " NEW_APP_PASS_CONFIRM
echo ""

if [ "$NEW_APP_PASS" != "$NEW_APP_PASS_CONFIRM" ]; then
  echo "❌ As senhas digitadas para app_user não coincidem!"
  exit 1
fi

if [ -z "$NEW_APP_PASS" ]; then
  echo "❌ A senha do app_user não pode ser vazia!"
  exit 1
fi

read -rsp "Digite a NOVA senha forte definitiva para o superusuário 'postgres': " NEW_ADMIN_PASS
echo ""
read -rsp "Confirme a NOVA senha forte definitiva para o superusuário 'postgres': " NEW_ADMIN_PASS_CONFIRM
echo ""

if [ "$NEW_ADMIN_PASS" != "$NEW_ADMIN_PASS_CONFIRM" ]; then
  echo "❌ As senhas digitadas para postgres não coincidem!"
  exit 1
fi

if [ -z "$NEW_ADMIN_PASS" ]; then
  echo "❌ A senha do postgres não pode ser vazia!"
  exit 1
fi

DB_CONTAINER="infoapi-db"
DB_NAME="infoapi"

echo ""
echo "=== [PASSO 1/5] Criando o usuário 'app_user' no PostgreSQL 16 ==="
docker exec -i "$DB_CONTAINER" psql -U postgres -d "$DB_NAME" <<EOF
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD '${NEW_APP_PASS}';
  ELSE
    ALTER ROLE app_user WITH PASSWORD '${NEW_APP_PASS}';
  END IF;
END
\$\$;

GRANT CONNECT ON DATABASE ${DB_NAME} TO app_user;
GRANT USAGE, CREATE ON SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;
GRANT postgres TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO app_user;
EOF

echo "✓ Usuário 'app_user' provisionado e permissões concedidas."

echo ""
echo "=== [PASSO 2/5] Testando autenticação com 'app_user' ==="
docker exec -i -e PGPASSWORD="${NEW_APP_PASS}" "$DB_CONTAINER" psql -U app_user -d "$DB_NAME" -c "SELECT 1;" > /dev/null
echo "✓ Teste sintético de autenticação com app_user OK!"

echo ""
echo "=== [PASSO 3/5] Atualizando a DATABASE_URL no .env ==="
NEW_DB_URL="postgres://app_user:${NEW_APP_PASS}@postgres:5432/${DB_NAME}?schema=public"

if grep -q "^DATABASE_URL=" .env; then
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${NEW_DB_URL}\"|" .env
else
  echo "DATABASE_URL=\"${NEW_DB_URL}\"" >> .env
fi
echo "✓ Arquivo .env atualizado com a nova DATABASE_URL."

echo ""
echo "=== [PASSO 4/5] Executando o Blue-Green Deploy (deploy.sh) ==="
./deploy.sh

echo ""
echo "=== [PASSO 5/5] Blindando a senha do superusuário 'postgres' ==="
docker exec -i "$DB_CONTAINER" psql -U postgres -d "$DB_NAME" <<EOF
ALTER USER postgres WITH PASSWORD '${NEW_ADMIN_PASS}';
EOF

# Sincroniza POSTGRES_PASSWORD no .env para futuros reinícios do infoapi-db
if grep -q "^POSTGRES_PASSWORD=" .env; then
  sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=\"${NEW_ADMIN_PASS}\"|" .env
else
  echo "POSTGRES_PASSWORD=\"${NEW_ADMIN_PASS}\"" >> .env
fi

echo "============================================================"
echo "  ROTAÇÃO FINALIZADA COM SUCESSO E ZERO DOWNTIME!"
echo "  Novo usuário em uso: app_user"
echo "  Superusuário blindado: postgres"
echo "============================================================"
