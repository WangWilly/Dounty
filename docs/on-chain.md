# Notes for on-chain program

## Studies

- Refer to the structure of [Crypto-Charity](https://github.com/ac12644/Crypto-Charity/tree/main)
    - Factory pattern is applied to create a new bounty
    - However, [it](https://stackoverflow.com/questions/72955251/factory-pattern-contracts-in-solana) seems that the factory pattern is anti-pattern in Solana.
    - 📌 [How to write a factory pattern contracts in solana](https://solana.stackexchange.com/questions/239/how-to-write-a-factory-pattern-contracts-in-solana/260#260)
- Dynamic length size account data in Solana
    - https://www.reddit.com/r/solana/comments/1dbt7tx/whats_the_best_way_to_store_an_array_in_programs/
    - 🤔 [How to store dynamically growing array in Solana?](https://www.reddit.com/r/solana/comments/118gmdf/how_to_store_dynamically_growing_array_in_solana/)
    - https://solana.stackexchange.com/questions/2339/account-size-calculation-when-using-vectors
    - 📌 [Anchor PDAs and Accounts](https://github.com/etherfuse/solana-course/blob/main/content/anchor-pdas.md)
    - 📌📌 [Best way to keep track of all the PDAs that has been created by my program in Solana](https://solana.stackexchange.com/questions/8616/best-way-to-keep-track-of-all-the-pdas-that-has-been-created-by-my-program-in-so)
        - 📌 [Create a solana dapp (Tweeter) from scratch](https://lorisleiva.com/create-a-solana-dapp-from-scratch)
        - 🍭 [Fetching tweets from the program](https://lorisleiva.com/create-a-solana-dapp-from-scratch/fetching-tweets-from-the-program)
- Hashmap in Solana
    - [Solana Rust program HashMap<string, u64>](https://stackoverflow.com/questions/68454062/solana-rust-program-hashmapstring-u64)
    - 📌 [Single Map Account](https://solanacookbook.com/guides/account-maps.html#single-map-account)
    - 📌 [programs/mpl-core/src/plugins/internal/owner_managed/autograph.rs](https://github.com/metaplex-foundation/mpl-core/blob/8ce95776eda6a0c5fa0e943fb8ecc1cb5560051d/programs/mpl-core/src/plugins/internal/owner_managed/autograph.rs#L38C24-L38C32)
    - 📌 [FrankC01/main.rs](https://gist.github.com/FrankC01/abae44f481c67988820fbb8c2c836c27)
    - https://solana.stackexchange.com/questions/5105/how-to-use-single-map-account-btreemap-anchor-solana
    - 🤔 [Error: Type BTreeMap<u8,u64> not found in IDL. #2729](https://github.com/coral-xyz/anchor/issues/2729#issuecomment-2155844009)
    - 🤔 [Are writes to BTreeMaps expensive? How much compute units does it take?](https://solana.stackexchange.com/questions/7848/are-writes-to-btreemaps-expensive-how-much-compute-units-does-it-take)
    - 🍭 [How can i create hash table using PDAs?](https://solana.stackexchange.com/questions/3746/how-can-i-create-hash-table-using-pdas)
