FROM node:22.17.0-alpine3.22 AS base

FROM base AS builder
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm ci

COPY next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs ./
COPY src ./src
COPY public ./public

ARG NEXT_PUBLIC_CRYPTO_KEY
ENV NEXT_PUBLIC_CRYPTO_KEY=$NEXT_PUBLIC_CRYPTO_KEY
ARG NEXT_PUBLIC_BACKEND_BASE
ENV NEXT_PUBLIC_BACKEND_BASE=$NEXT_PUBLIC_BACKEND_BASE
ARG NEXT_PUBLIC_BACKEND_API
ENV NEXT_PUBLIC_BACKEND_API=$NEXT_PUBLIC_BACKEND_API
ARG NEXT_PUBLIC_IMG_BASE
ENV NEXT_PUBLIC_IMG_BASE=$NEXT_PUBLIC_IMG_BASE
ARG NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD ["node", "server.js"]