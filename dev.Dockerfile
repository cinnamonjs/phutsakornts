FROM oven/bun:latest-alpine AS base
FROM base AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

ENV NODE_ENV=development

EXPOSE 3000
CMD ["bun", "dev"]