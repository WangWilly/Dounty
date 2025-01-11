#!/bin/bash

PROJ_DIR=$(pwd)/bounty_factory

# https://lorisleiva.com/create-a-solana-dapp-from-scratch/deploying-to-devnet
# https://stackoverflow.com/questions/69245982/import-phantom-wallet-private-key-into-solana-cli

# Build the contract
cd $PROJ_DIR

solana config set --url devnet

anchor build
anchor deploy
