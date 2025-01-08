#!/bin/bash

KEYPAIR_PATH=~/.config/solana/id.json

if [ -f $KEYPAIR_PATH ]; then
  echo "Wallet already exists"
else
    # Create a new Solana wallet
  solana-keygen new --outfile $KEYPAIR_PATH
fi
