################################################################################
# Base image
FROM node:20.9.0-slim AS base
WORKDIR /app

################################################################################
# Install builder dependencies
FROM base AS builder-deps

COPY package.json package-lock.json ./

RUN npm i

################################################################################
# Install runner dependencies
FROM base AS runnder-deps

ENV NODE_ENV production

COPY package.json package-lock.json ./
COPY prisma/deploy.prisma ./prisma/schema.prisma

RUN apt update
RUN apt-get install -y openssl

RUN npm i --omit=dev
RUN npx prisma generate

################################################################################
# Build the source code
FROM base AS builder

COPY --from=builder-deps /app/node_modules ./node_modules/
COPY . ./

RUN npm run build

################################################################################
# Setup runner
FROM base AS runner

ENV NODE_ENV production

COPY --from=runnder-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./

COPY serve.sh ./serve.sh

RUN apt update
RUN apt-get install -y openssl

CMD ["./serve.sh"]
