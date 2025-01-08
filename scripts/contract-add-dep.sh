#!/bin/bash

CONTRACT_PROG_NAME=""
DEP_NAME=""

# argument parsing
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -p|--program)
    CONTRACT_PROG_NAME="$2"
    shift
    shift
    ;;
    -d|--dep)
    DEP_NAME="$2"
    shift
    shift
    ;;
    *)
    echo "Unknown argument: $1"
    echo "Usage: ./contract-add-dep.sh -p <program_name> -d <dependency_name>"
    exit 1
    ;;
esac
done

################################################################################

PROJ_DIR=$(pwd)/bounty_factory/programs/$CONTRACT_PROG_NAME

# add the dependency
cd $PROJ_DIR
cargo add $DEP_NAME
