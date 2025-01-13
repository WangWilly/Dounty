#!/bin/bash

PROJ_DIR=$(pwd)/backend

cd $PROJ_DIR
echo "Running in development mode"
set -a && source dev.env && set +a

# env | grep '^PT'

# echo "Check database migration status"
# PRISMA_MIGRATION_STATUS=$(npx prisma migrate status)
# if echo "$PRISMA_MIGRATION_STATUS" | grep -q "Database schema is up to date!"; then
#     echo "Database schema is up to date!"
#     exit 1
# fi

env | grep '^DB'

msg=$*
echo "Message: $msg"
DEFAULT_MSG_LEN=5
if [ ${#msg} -lt $DEFAULT_MSG_LEN ]; then
    echo "Message must be at least ${DEFAULT_MSG_LEN} characters long"
    exit 1
fi

# https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgresql
# https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-typescript-postgresql
# https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0
npx prisma migrate dev --name "$msg"

# for backend/src/models/*.ts
npm run format
