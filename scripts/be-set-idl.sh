#!/bin/sh

CONTRACT_TAR=bounty_factory/target
TS_BACKEND_DIR=backend/src/contract

if [ ! -d $CONTRACT_TARGET ]; then
    echo "Contract target directory not found. Please run './scripts/contract-build.sh' first."
    exit 1
fi

if [ ! -d $TS_BACKEND_DIR ]; then
    mkdir -p $TS_BACKEND_DIR
fi

DEP_LIST=(
    idl
    types
)

# copy the idl and types to the ts-backend directory
for DEP in "${DEP_LIST[@]}"; do
    cp -r $CONTRACT_TAR/$DEP $TS_BACKEND_DIR
done
