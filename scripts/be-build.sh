#!/bin/bash

# TODO: unimplemented
echo "Not implemented yet"
return 1

git checkout master

IMAGE="dounty/backend"
COMMIT_HASH=$(git rev-parse --short HEAD)

docker build \
-t ${IMAGE}:$COMMIT_HASH \
-f ./backend/Dockerfile \
.

docker tag ${IMAGE}:$COMMIT_HASH ${IMAGE}:latest
