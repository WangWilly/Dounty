#!/bin/bash

echo "Running in production mode"

npx prisma generate
node /app/main.js
