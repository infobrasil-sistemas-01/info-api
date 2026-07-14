# ---------- BUILD ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Dependências
COPY package*.json ./

# Prisma
COPY prisma ./prisma
COPY prisma.config.ts ./

# TS configs
COPY tsconfig*.json ./

RUN npm ci

# Código-fonte
COPY . .

# Gera client do Prisma
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Garante que todos os arquivos do client gerado (incluindo .wasm, index.js, etc.) sejam copiados para a pasta dist
RUN cp -r /app/src/generated/prisma/. /app/dist/src/generated/prisma/


# ---------- PRODUCTION ----------
FROM node:22-alpine

WORKDIR /app

# Utilitário e dependências do Chromium para geração de PDF
RUN apk add --no-cache \
      curl \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev

# Prisma runtime (client gerado + schema + config)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Build da aplicação
COPY --from=builder /app/dist ./dist

# Entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Segurança: usuário não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN chown -R appuser:appgroup /app

USER appuser
# Porta interna única (igual para blue e green)
ARG PORT=3336
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["sh", "./entrypoint.sh"]