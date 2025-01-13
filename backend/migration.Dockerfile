################################################################################
# Base image
FROM node:20.9.0-slim AS base
WORKDIR /app

################################################################################
# Install runner dependencies
FROM base AS runnder-deps

ENV NODE_ENV production

COPY package.json package-lock.json ./

RUN npm install --dev

################################################################################
# Runtime stage
FROM base AS runner

COPY --from=runnder-deps /app/node_modules ./node_modules
COPY ./prisma ./prisma

RUN apt update
RUN apt-get install -y openssl

ENTRYPOINT ["npx", "prisma", "migrate", "deploy"]
