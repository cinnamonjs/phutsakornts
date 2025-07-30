FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

ENV NODE_ENV=production

CMD ["bun", "run", "start"]
