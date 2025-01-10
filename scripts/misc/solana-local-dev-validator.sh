#!/bin/bash

CURR_DIR=$(pwd)

DEV_BOUNTY_FACTORY_ID=HvZ9DweFNYWqV4WNf83cCWogUXmabZHsDNT29DaRUXvm
DEV_BOUNTY_FACTORY_NAME=${CURR_DIR}/bounty_factory/target/deploy/bounty_factory.so

# https://www.quicknode.com/guides/solana-development/accounts-and-data/fork-programs-to-localnet
solana-test-validator -r \
--bpf-program $DEV_BOUNTY_FACTORY_ID $DEV_BOUNTY_FACTORY_NAME
