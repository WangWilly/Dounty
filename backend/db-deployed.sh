#!/bin/bash

echo "Running in production mode"

PRISMA_MIGRATION_STATUS=$(npx prisma migrate status)
if echo "$PRISMA_MIGRATION_STATUS" | grep -q "Database schema is up to date!"; then
    echo "Database is migrated"
    exit 0
else
    echo "Database is not migrated"
    exit 1
fi
