# n8n-fullstack-course — Next.js 14
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variables públicas de Supabase (se inlinean en el bundle en build time).
# Si build falla por falta de vars, crea un .env.local y reconstruye.
RUN npm run build

ENV NODE_ENV=production \
    PORT=3004 \
    HOSTNAME=0.0.0.0

EXPOSE 3004

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3004/ || exit 1

CMD ["npm", "start"]
