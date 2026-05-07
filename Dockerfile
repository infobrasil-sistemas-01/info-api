# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig*.json ./

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build



# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig*.json ./

RUN npm ci --omit=dev
RUN npm install --no-save tsx typescript ts-node
RUN node node_modules/prisma/build/index.js generate

COPY --from=builder /app/dist ./dist
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

ARG PORT=3336
ENV PORT=${PORT}
EXPOSE ${PORT}

ENTRYPOINT ["sh", "entrypoint.sh"]
