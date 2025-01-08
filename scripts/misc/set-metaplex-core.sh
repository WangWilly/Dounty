#!/bin/bash

PROJ_DIR=$(pwd)/contract

cd $PROJ_DIR

PROG_NAME="tests/core.so"

if [ ! -f $PROG_NAME ]; then
  solana program dump -u d CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d $PROG_NAME
else
  echo "Program already exists"
fi
