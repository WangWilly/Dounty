# Dounty (coDe Bounty)

<p align="center">
    <a href="https://wangwilly.github.io/Dounty/">
        <img src="docs/assets/dounty-icon.png" alt="Dounty icon" width="200" height="200">
    </a>
</p>

A tool to incentivize developers to contribute to open source projects by rewarding them with bounties. Like the ticketing system in JIRA, but with bounties. Users open bounties for issues they want to see fixed on Github, and developers can claim them. Once the issue is fixed, the developer gets the bounty.

<details>

<summary>Case studies</summary>

- BountySource
    - 🤔 https://www.reddit.com/r/opensource/comments/1d5v1uk/bountysource_is_dead/
    - https://github.com/bountysource
    - https://github.com/bountysource/core/issues/1586
- 🥵 Fiver
    - https://www.fiverr.com/?source=top_navd
- Liberapay is a platform that allows users to donate money to open source projects. It is similar to Patreon, but for open source projects. (https://www.patreon.com/)
    - https://en.liberapay.com/
- Kickstarter
    - https://www.kickstarter.com/discover/categories/technology/software
- 🥵 Upwork
    - https://www.upwork.com/hire/javascript-developers/
- 🥵 Gitpay
    - https://gitpay.me/#/
- Gitcoin
    - https://gitcoin.co/
    - https://explorer.gitcoin.co/#/projects
    - 🏳️ https://x.com/gitcoin/status/1870127565911785924
- 🥵 https://www.reddit.com/r/github/comments/11bu8p3/how_to_find_issues_with_bounties_on_github/
- 🥵 https://github.com/disclose/bug-bounty-platforms

</details>

## Design

### On-chain program

- [Flow chart for the design](docs/contract/flow-chart.md)
- [Notes for on-chain program](docs/contract/notes.md)
- [Solana dev faucet](https://faucet.solana.com/)

### Client side

- [Notes for client side](docs/client/notes.md)

### Browser extension (TBD)

### Server side (TBD)

- [Notes for server side](docs/server/notes.md)
    - Multi-signature

## Setup

### On-chain program

The rust toolchain is required to build the project. The following commands will install the rust toolchain and the required dependencies.

<details>
<summary>📌 Install instructions</summary>

```bash
# Install the rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Installing using Anchor version manager
```bash
# Install the Anchor version manager
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install the build dependencies
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Check the version of Anchor
solana --version

# Install the latest version of Anchor
avm install latest

# Check the version of Anchor
anchor --version
```

</details>

<details>
<summary>📌 Common commands</summary>

```bash
solana config get # Get the current Solana cluster configuration
solana config set --url https://api.devnet.solana.com # Set the Solana cluster configuration
solana balance # Get the balance of the current wallet
solana airdrop 2 ~/.config/solana/id.json # Airdrop 1 SOL to the current wallet
solana address # Get the public key of the current wallet
solana keygen new --outfile ~/.config/solana/id.json # Generate a new keypair

solana transfer 1 [public-key] # Transfer 1 SOL to the specified public key
solana transfer --allow-unfunded-recipient 1 [public-key] # Transfer 1 SOL to the specified public key even if it's unfunded
solana transfer --allow-unfunded-recipient 1 [public-key] --from ~/.config/solana/id.json # Transfer 1 SOL from the current wallet to the specified public key even if it's unfunded

# https://docs.anza.xyz/cli/usage#solana-logs
solana logs --url localhost

# Initialize a new project
anchor init [new-workspace-name]
```

</details>


## TODOs

- [ ] Cryptocurrency agnostic payable
- [ ] Chrome extension to detect issues on Github and open bounties
- [ ] Mint a contribution/skill NFT for each bounty (can put to resume)
- [ ] Mint community impact NFT for each donation
- [ ] Analyze the impact of bounties on open source projects

## MISC

### Reading list

- 😊
    - [ ] [solana-labs/dapp-scaffold](https://github.com/solana-labs/dapp-scaffold/)
    - [ ] 🤔 https://solana.stackexchange.com/questions/9352/dynamically-use-pda-with-transfer-hooks
    - [ ] https://github.com/wormholelabs-xyz/example-queries-solana-pda
    - [x] https://stackoverflow.com/questions/70150946/systemprogramcreateaccount-data-size-limited-to-10240-in-inner-instructions
    - [ ] https://solana.stackexchange.com/questions/2715/why-cant-i-close-a-solana-program-and-redeploy-to-the-same-program-id
    - [x] https://solana.com/docs/programs/deploying
        - [x] https://solana.stackexchange.com/questions/5807/what-does-sbf-as-in-sbf-program-stand-for
        - [x] https://solana.com/docs/core/clusters
    - [x] https://solana.stackexchange.com/questions/2840/best-ways-to-store-long-string-as-pda-seed
- 🙂
    - [ ] [My journey into web3](https://lorisleiva.com/my-journey-into-web-3)
    - [ ] https://www.quicknode.com/guides/solana-development/solidity/solang-get-started
    - [ ] https://www.reddit.com/r/solana/comments/1b1xmtk/sam_bankmanfried_is_telling_prison_guards_to_buy/
- 🤨
    - [ ] https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/assigning-issues-and-pull-requests-to-other-github-users
