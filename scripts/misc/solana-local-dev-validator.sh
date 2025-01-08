#!/bin/bash

CURR_DIR=$(pwd)

# If the program does not exist, download it by using the script `scripts/misc/set-metaplex-core.sh`
MPL_CORE_PROG_ID=CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d
MPL_CORE_PROG_NAME=${CURR_DIR}/contract/tests/core.so

DEV_CONTRACT_ID=B28UKH17RsMkqA9n3YbviRMny9yeiBdM7pzjT9LK1JZ
DEV_CONTRACT_NAME=${CURR_DIR}/contract/target/deploy/contract.so

DEV_LIFE_HELPER_ID=6wpG1R1Sc7hJf6ZzAzMuzuhSGCEdmuS6X7vgaBXPnqgc
DEV_LIFE_HELPER_NAME=${CURR_DIR}/contract/target/deploy/life_helper.so

# https://www.quicknode.com/guides/solana-development/accounts-and-data/fork-programs-to-localnet
solana-test-validator -r \
--bpf-program $MPL_CORE_PROG_ID $MPL_CORE_PROG_NAME \
--bpf-program $DEV_CONTRACT_ID $DEV_CONTRACT_NAME \
--bpf-program $DEV_LIFE_HELPER_ID $DEV_LIFE_HELPER_NAME
