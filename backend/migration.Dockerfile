################################################################################
# Base image
FROM node:20.9.0-slim AS base
WORKDIR /app

################################################################################
# Install runner dependencies
FROM base AS runnder-deps

ENV NODE_ENV production

COPY package.json package-lock.json ./

RUN npm install

################################################################################
# Runtime stage
FROM base AS runner

COPY --from=runnder-deps /app/node_modules ./node_modules
COPY prisma/deploy.prisma ./prisma/schema.prisma
COPY prisma/migrations ./prisma/migrations
COPY db-deploy.sh ./db-deploy.sh
COPY db-deployed.sh ./db-deployed.sh

RUN apt update
RUN apt-get install -y openssl

ENTRYPOINT ["./db-deploy.sh"]
