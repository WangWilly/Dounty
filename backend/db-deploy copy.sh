#!/bin/bash


echo "Running in production mode"

npx prisma migrate deploy --preview-feature
sleep infinity
