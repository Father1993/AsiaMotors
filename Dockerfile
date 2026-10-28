# syntax=docker/dockerfile:1
FROM node:24-alpine AS dependencies
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM dependencies AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
# Builds require neither database connectivity nor production secrets.
RUN npm run build \
    && test -f .next/server/app/api/uploads/route.js \
    && rm -f .next/standalone/.env*

FROM node:24-alpine AS worker
WORKDIR /app
ENV NODE_ENV=production
COPY worker/package.json worker/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && mkdir uploads && chown node:node uploads
COPY scripts ./scripts
COPY db ./db
USER node
CMD ["node", "scripts/mail-worker.mjs"]

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN apk add --no-cache libc6-compat && mkdir uploads && chown node:node uploads
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
