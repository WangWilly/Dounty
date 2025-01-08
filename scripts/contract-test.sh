#!/bin/bash

PROJ_DIR=$(pwd)/bounty_factory

# Test the contract
cd $PROJ_DIR

# anchor build

# cargo test
anchor test
