#!/bin/bash

echo "Running in production mode"

npx prisma migrate deploy
sleep infinity
