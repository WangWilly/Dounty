#!/bin/bash

git checkout master

TS_BACKEND_DIR=backend

cd $TS_BACKEND_DIR

IMAGE="dounty/backend"
COMMIT_HASH=$(git rev-parse --short HEAD)

docker build \
-t ${IMAGE}:$COMMIT_HASH \
-f ./Dockerfile \
.

docker tag ${IMAGE}:$COMMIT_HASH ${IMAGE}:latest

DB_IMAGE="dounty/migration"
COMMIT_HASH=$(git rev-parse --short HEAD)

docker build \
-t ${DB_IMAGE}:$COMMIT_HASH \
-f ./migration.Dockerfile \
.

docker tag ${DB_IMAGE}:$COMMIT_HASH ${DB_IMAGE}:latest
