#!/bin/bash

PROJ_DIR=$(pwd)/backend

cd $PROJ_DIR
echo "Running in development mode"
set -a && source dev.env && set +a

echo "Database zod schema generation"
npx prisma generate

npm run format
