#!/bin/bash
set -e

GATEWAY_CONTAINER="api-gateway"

BLUE_SERVICE="infoapi-blue"
GREEN_SERVICE="infoapi-green"

APP_PORT=3336

HEALTH_PATH="/api/v1/health"

echo "Detectando ambiente ativo..."

if docker ps --format '{{.Names}}' | grep -q -E "^(api-blue|infoapi-blue)$"; then
  LIVE_SERVICE=$BLUE_SERVICE
  TARGET_SERVICE=$GREEN_SERVICE
  LEGACY_LIVE_CONTAINER="api-blue"
else
  LIVE_SERVICE=$GREEN_SERVICE
  TARGET_SERVICE=$BLUE_SERVICE
  LEGACY_LIVE_CONTAINER="api-green"
fi

TARGET_PORT=$APP_PORT

echo "Ambiente ativo: $LIVE_SERVICE"
echo "Novo deploy em: $TARGET_SERVICE"

echo "Buildando nova versão..."
docker compose build $TARGET_SERVICE

echo "Executando migrations..."
docker compose run --rm $TARGET_SERVICE npx prisma migrate deploy

echo "Subindo nova versão..."
docker compose up -d $TARGET_SERVICE

echo "Aguardando healthcheck..."

ATTEMPTS=30
COUNT=0

until [ "$(docker inspect --format='{{.State.Health.Status}}' $TARGET_SERVICE)" = "healthy" ]; do
COUNT=$((COUNT + 1))

if [ $COUNT -ge $ATTEMPTS ]; then
echo "Nova versão falhou no healthcheck."
exit 1
fi

echo "Tentativa $COUNT/$ATTEMPTS..."
sleep 2
done

echo "Nova versão saudável."

echo "Atualizando upstream do nginx..."

docker exec $GATEWAY_CONTAINER sh -c "sed -i -E 's/(api-blue|infoapi-blue|api-green|infoapi-green)/$TARGET_SERVICE/g' /etc/nginx/conf.d/default.conf && nginx -s reload"

echo "Derrubando ambiente antigo..."
docker compose stop $LIVE_SERVICE
docker compose rm -f $LIVE_SERVICE
if [ ! -z "$LEGACY_LIVE_CONTAINER" ]; then
  docker stop $LEGACY_LIVE_CONTAINER 2>/dev/null || true
  docker rm -f $LEGACY_LIVE_CONTAINER 2>/dev/null || true
fi

echo "Deploy concluído com sucesso."
echo "Ambiente ativo atual: $TARGET_SERVICE"
