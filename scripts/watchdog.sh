#!/bin/bash

HEALTH_URL="http://127.0.0.1:3339/api/v1/health/live"
PROJECT_DIR="/home/infobrasilroot/info-vendas-api"
LOG_FILE="/home/infobrasilroot/watchdog.log"
LOCK_FILE="/tmp/infoapi-watchdog.lock"

exec 200>"$LOCK_FILE"
flock -n 200 || exit 0

STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$HEALTH_URL")

if [ "$STATUS" != "200" ]; then
    sleep 3
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$HEALTH_URL")
fi

if [ "$STATUS" != "200" ]; then
    NOW=$(date '+%Y-%m-%d %H:%M:%S')
    echo "$NOW - API indisponivel (Status: $STATUS). Iniciando recuperacao..." >> "$LOG_FILE"
    
    if pgrep -f "deploy.sh" > /dev/null; then
        echo "$NOW - Deploy ja em andamento. Aguardando..." >> "$LOG_FILE"
    else
        cd "$PROJECT_DIR" || exit 1
        /bin/bash ./deploy.sh >> "$LOG_FILE" 2>&1
        echo "$NOW - Auto-deploy finalizado com codigo $?" >> "$LOG_FILE"
    fi
fi
