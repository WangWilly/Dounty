#!/bin/bash

KEYPAIR_PATH=~/.config/solana/id.json

if [ ! -f $KEYPAIR_PATH ]; then
    echo "Wallet does not exist. Consider running scripts/misc/new-sol-wallet.sh"
    exit 1
fi

PUBLIC_KEY=$(solana address --keypair $KEYPAIR_PATH)
SOL_BALANCE=$(solana balance --keypair $KEYPAIR_PATH)

echo "Wallet address: $PUBLIC_KEY"
echo "SOL balance: $SOL_BALANCE"
