#!/bin/sh

PROJ_DIR=$(pwd)/backend

IS_DEV=$(echo $1 | tr '[:upper:]' '[:lower:]')

# Load environment variables from the .env file
if [ "$IS_DEV" = "dev" ]; then
    echo "Running in development mode"
    ENV_FILE=${PROJ_DIR}/dev.env
    if [ ! -f $ENV_FILE ]; then
        echo "Error: dev.env file not found, please create one in ${PROJ_DIR}. There is an boilerplate file template.env in the same directory"
        exit 1
    fi
    set -a && source $ENV_FILE && set +a

    # Start the backend server
    cd ${PROJ_DIR}
    npm run start:dev
else
    echo "Running in production mode"
fi
