#!/bin/bash

PROJ_DIR=$(pwd)/bounty_factory

# Build the contract
cd $PROJ_DIR
anchor build
