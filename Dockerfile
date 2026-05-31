FROM oven/bun:latest AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/ui/package.json ./packages/ui/package.json

RUN bun install --frozen-lockfile

FROM oven/bun:latest AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

FROM oven/bun:slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "run", "start"]
