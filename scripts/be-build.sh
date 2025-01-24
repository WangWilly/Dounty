#!/bin/bash

git checkout master

TS_BACKEND_DIR=backend

cd $TS_BACKEND_DIR

# Backend
IMAGE="dounty/backend"
HUB_IMAGE="willywangka/dounty-dev" # Docker-hub info
COMMIT_HASH=$(git rev-parse --short HEAD)

echo -e "\n\n\033[33m==============================\033[0m\n"
echo -e "\033[33m=== Building backend image ===\033[0m\n"
echo -e "\033[33m==============================\033[0m\n\n"
docker build \
-t ${IMAGE}:$COMMIT_HASH \
-f ./Dockerfile \
.

# Local dev
docker tag ${IMAGE}:$COMMIT_HASH ${IMAGE}:latest
# echo -e "\n\n\033[33m==============================\033[0m\n"
# echo -e "\033[33m=== Pushing built be-image ===\033[0m\n"
# echo -e "\033[33m==============================\033[0m\n\n"
# # Push to docker hub
# docker tag ${IMAGE}:$COMMIT_HASH ${HUB_IMAGE}:$COMMIT_HASH
# docker push ${HUB_IMAGE}:$COMMIT_HASH
# docker tag ${HUB_IMAGE}:$COMMIT_HASH ${HUB_IMAGE}:latest
# docker push ${HUB_IMAGE}:latest

# Migration
DB_IMAGE="dounty/migration"
HUB_DB_IMAGE="willywangka/dounty-migration-dev" # Docker-hub info
COMMIT_HASH=$(git rev-parse --short HEAD)

echo -e "\n\n\033[33m================================\033[0m\n"
echo -e "\033[33m=== Building migration image ===\033[0m\n"
echo -e "\033[33m================================\033[0m\n\n"
docker build \
-t ${DB_IMAGE}:$COMMIT_HASH \
-f ./migration.Dockerfile \
.

# Local dev
docker tag ${DB_IMAGE}:$COMMIT_HASH ${DB_IMAGE}:latest
# echo -e "\n\n\033[33m==============================\033[0m\n"
# echo -e "\033[33m=== Pushing built db-image ===\033[0m\n"
# echo -e "\033[33m==============================\033[0m\n\n"
# # Push to docker hub
# docker tag ${DB_IMAGE}:$COMMIT_HASH ${HUB_DB_IMAGE}:$COMMIT_HASH
# docker push ${HUB_DB_IMAGE}:$COMMIT_HASH
# docker tag ${HUB_DB_IMAGE}:$COMMIT_HASH ${HUB_DB_IMAGE}:latest
# docker push ${HUB_DB_IMAGE}:latest
