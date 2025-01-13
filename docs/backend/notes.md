# Backend - Notes

## Studies

- [x] 📌 [How to sign Transactions using multiple signers from phantom wallet](https://solana.stackexchange.com/questions/14155/how-to-sign-transactions-using-multiple-signers-from-phantom-wallet)
- [x] 📖 [TransactionExpiredBlockheightExceededError - Signature expired: block height exceeded](https://solana.stackexchange.com/questions/14596/transactionexpiredblockheightexceedederror-signature-expired-block-height-exc)
- [ ] 📖 [Transaction confirmation tips](https://arc.net/l/quote/ryqurcon) ([ORI](https://omniatech.io/pages/solana-transaction-confirmation/#:~:text=Avoid%20reusing%20stale%20blockhashes%20%E2%80%93%20even%20if%20your%20application%20has%20fetched%20a%20very%20recent%20blockhash%2C%20be%20sure%20that%20you%E2%80%99re%20not%20reusing%20that%20blockhash%20in%20transactions%20for%20too%20long.%20The%20ideal%20scenario%20is%20that%20a%20recent%20blockhash%20is%20fetched%20right%20before%20a%20user%20signs%20their%20transaction.))
- [x] 📌 [Offline Transactions](https://solana.com/developers/cookbook/transactions/offline-transactions)
- [ ] 📌 [Durable & Offline Transaction Signing using Nonces](https://solana.com/developers/guides/advanced/introduction-to-durable-nonces)
- [x] [How to Create a MultiSig Wallet on Solana using Squads](https://www.quicknode.com/guides/solana-development/3rd-party-integrations/multisig-with-squads)
- [ ] [How can one sign a serialized transaction?](https://solana.stackexchange.com/questions/534/how-can-one-sign-a-serialized-transaction)
- [ ] https://www.npmjs.com/package/@solana/signers/v/2.0.0-preview.2.20240419004227.da22d0b4f9f8409054cc1c1080ed74cc4e21976d
- [ ] https://docs.shyft.to/dev-guides/solana/transactions/how-to-sign-transactions-using-multiple-signers-on-solana
- Database
    - [prisma/prisma-examples/pulse/product-search-with-typesense/backend](https://github.com/prisma/prisma-examples/tree/latest/pulse/product-search-with-typesense/backend)
    - 📌 [NestJS Prisma](https://docs.nestjs.com/recipes/prisma)
    - 📌 [Connection pool](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-pool)
        - https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0#create-a-prisma-service
        - https://github.com/notiz-dev/nestjs-prisma/tree/main/
    - 📌 [Database connections](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections)
    - [Postgres pool setting not taking into account when schema uses env variable](https://github.com/prisma/prisma/issues/22177)
    - [How to Increase Prisma Connection Pool Size on a RDS Instance?](https://stackoverflow.com/questions/78922303/how-to-increase-prisma-connection-pool-size-on-a-rds-instance)

## NestJS

> https://medium.com/@zulfiqar.langah/how-to-setup-nest-js-next-js-mono-repository-8a5d8c3b5849

```bash
nest new [server-name] --strict --skip-git --package-manager=npm
```
