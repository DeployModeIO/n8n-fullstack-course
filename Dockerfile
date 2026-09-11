# n8n-fullstack-course — Next.js 14
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Supabase public variables (inlined into the bundle at build time).
# If the build fails because of missing variables, create a .env.local and rebuild.
RUN npm run build

ENV NODE_ENV=production \
    PORT=3004 \
    HOSTNAME=0.0.0.0

EXPOSE 3004

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3004/ || exit 1

CMD ["npm", "start"]
