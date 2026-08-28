FROM node:26-alpine AS builder
WORKDIR /app
RUN npm install -g corepack && corepack enable
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm run build

FROM node:26-alpine AS runner
WORKDIR /app
RUN npm install -g corepack && corepack enable
ENV NODE_ENV=production
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production --ignore-scripts
COPY --from=builder /app/dist ./dist
EXPOSE 3333
CMD ["sh", "-c", "pnpm migration:up && node ./dist/main.js"]
