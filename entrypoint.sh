#!/bin/sh
set -e

echo "Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "Running Prisma seed..."
node node_modules/prisma/build/index.js db seed

echo "Starting application..."
exec node dist/src/main.js
