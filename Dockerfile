FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.12.1 --activate

FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@^2.2.1
COPY . .
RUN turbo prune web --docker

FROM base AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /app/out/full/ .

# Кеш сборки Next.js и сама сборка
RUN --mount=type=cache,id=nextjs,target=/app/apps/promo/.next/cache \
    pnpm turbo run build --filter=web

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/promo/public ./apps/promo/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/promo/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/promo/.next/static ./apps/promo/.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "apps/promo/server.js"]