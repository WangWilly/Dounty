#!/bin/sh

DEPLOY_DIR=deployments

cd $DEPLOY_DIR
docker compose $@
