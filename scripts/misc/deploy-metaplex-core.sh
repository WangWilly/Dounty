#!/bin/bash

# PROJ_DIR=$(pwd)/contract
# PLAYGROUND_DIR=$(pwd)/playground

# cd $PROJ_DIR

# PROG_ID="CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
# PROG_NAME="tests/core.so"

# solana-cli 2.0.17 (src:7104d713; feat:607245837, client:Agave)
# TODO: https://solana.com/docs/programs/deploying
# # https://solana.stackexchange.com/questions/2807/deployed-program-address-is-different-from-address-made-by-anchor-keys-list-co
# IS_PROGRAM_DEPLOYED=$(solana program show $PROG_ID)
# echo $IS_PROGRAM_DEPLOYED

# if [ "$IS_PROGRAM_DEPLOYED" != "" ]; then
#   echo "Program already exists"
#   exit 0
# fi

# if [ ! -f $PROG_NAME ]; then
#   solana program dump -u d $PROG_ID $PROG_NAME
#   echo "Program dumped"
# fi

# solana program deploy $PROG_NAME

################################################################################
# DEBUGGING
# # https://stackoverflow.com/questions/77550799/does-program-keypair-has-any-other-usage-besides-program-deployment
# KEYPAIR=${PLAYGROUND_DIR}/assets/metaplex-core-keypair.json
# if [ -f $KEYPAIR ]; then
#   echo "Keypair already exists"
# else
#   solana-keygen new --outfile $KEYPAIR
# fi

# solana program deploy $PROG_NAME --keypair $KEYPAIR --program-id $PROG_ID
# solana program show --programs
