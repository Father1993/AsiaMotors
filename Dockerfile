# syntax=docker/dockerfile:1
FROM node:24-alpine AS dependencies
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM dependencies AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
# Build-time credentials are mounted temporarily and never copied into a layer.
RUN --mount=type=secret,id=app_env,target=/app/.env.production,required=true \
    npm run build && rm -f .next/standalone/.env*

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN apk add --no-cache libc6-compat
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
