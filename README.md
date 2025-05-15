# Dounty

## Open Source Development Incentivization Platform

<p align="center">
    <a href="https://wangwilly.github.io/Dounty/">
        <img src="docs/assets/dounty-icon.png" alt="Dounty icon" width="200" height="200">
    </a>
</p>

Dounty is a platform designed to incentivize developers to contribute to open source projects through financial rewards. Similar to traditional issue-tracking systems, Dounty enables project owners to create bounties for specific issues that need resolution. Contributors can browse available bounties, claim them, and receive compensation upon successful completion of the work.

<details>

<summary>Market Research and Competitive Analysis</summary>

- **BountySource**
    - Reference: [Reddit Discussion on BountySource Status](https://www.reddit.com/r/opensource/comments/1d5v1uk/bountysource_is_dead/)
    - Repository: [github.com/bountysource](https://github.com/bountysource)
    - Issue Reference: [github.com/bountysource/core/issues/1586](https://github.com/bountysource/core/issues/1586)

- **Fiverr**
    - Platform: [fiverr.com](https://www.fiverr.com/?source=top_navd)
    - Focus: General freelance services marketplace

- **Liberapay**
    - Platform: [en.liberapay.com](https://en.liberapay.com/)
    - Focus: Donation platform for open source projects, similar to Patreon

- **Kickstarter**
    - Platform: [kickstarter.com](https://www.kickstarter.com/discover/categories/technology/software)
    - Focus: Crowdfunding platform for creative projects

- **Upwork**
    - Platform: [upwork.com](https://www.upwork.com/hire/javascript-developers/)
    - Focus: Freelance services marketplace

- **Gitpay**
    - Platform: [gitpay.me](https://gitpay.me/#/)
    - Focus: Task-based payment system for developers

- **Gitcoin**
    - Platform: [gitcoin.co](https://gitcoin.co/)
    - Explorer: [explorer.gitcoin.co](https://explorer.gitcoin.co/#/projects)
    - Reference: [Gitcoin Status](https://x.com/gitcoin/status/1870127565911785924)

- **Reddit Discussion**
    - Reference: [How to Find Issues with Bounties on GitHub](https://www.reddit.com/r/github/comments/11bu8p3/how_to_find_issues_with_bounties_on_github/)

- **Bug Bounty Platforms**
    - Repository: [github.com/disclose/bug-bounty-platforms](https://github.com/disclose/bug-bounty-platforms)

</details>

## Design

### On-chain Program

- [Flow Chart for the Design](docs/contract/flow-chart.md)
- [Notes for On-chain Program](docs/contract/notes.md)
- [Solana Dev Faucet](https://faucet.solana.com/)
- Issues
    - [React App with Anchor Error](https://solana.stackexchange.com/questions/15175/react-app-with-anchor-0-30-1-error-walletsendtransactionerror-unexpected-erro/19112#19112)
    - [Cluster Versions](https://stackoverflow.com/questions/68755285/solana-how-to-get-cluster-versions)
    - [Transaction Logs on Solana](https://www.quicknode.com/guides/solana-development/transactions/how-to-get-transaction-logs-on-solana)
    - [Transaction History](https://www.rareskills.io/post/solana-logs-transaction-history)
    - [Deployed Version of Solana](https://solana.stackexchange.com/questions/9803/how-can-i-see-what-the-currently-deployed-version-of-solana-is)
    - [Change Solana CLI Version](https://solana.stackexchange.com/questions/7153/how-do-you-change-your-solana-cli-version)

### Client Side

- [Notes for Client Side](docs/client/notes.md)

### Browser Extension (TBD)

- [PlasmoHQ](https://github.com/PlasmoHQ/plasmo)
- [Chrome Extensions Samples](https://github.com/GoogleChrome/chrome-extensions-samples)
- [Extro](https://github.com/turbostarter/extro)
- [Chrome Extension Boilerplate React](https://github.com/lxieyang/chrome-extension-boilerplate-react)
- [Chrome Extension Boilerplate React Vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

### Server Side (Backend)

- [Notes for Backend](docs/backend/notes.md)
    - Multi-signature

#### Run with Docker Compose

```bash
./scripts/db-build-migration.sh
./scripts/be-build.sh

cd deployments
docker compose up -d
```

## Setup

### On-chain Program

The Rust toolchain is required to build the project. The following commands will install the Rust toolchain and the required dependencies.

<details>
<summary>📌 Install Instructions</summary>

```bash
# Install the Rust toolchain
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
<summary>📌 Common Commands</summary>

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

- [ ] Cryptocurrency-agnostic payment system
- [ ] Chrome extension to detect issues on GitHub and open bounties
- [ ] Mint a contribution/skill NFT for each bounty (can be added to resumes)
- [ ] Mint community impact NFT for each donation
- [ ] Analyze the impact of bounties on open source projects

## Miscellaneous

### Reference Documentation

#### Solana Development Resources
- [ ] [Solana dApp Scaffold](https://github.com/solana-labs/dapp-scaffold/) - Official Solana Labs template for developing dApps
- [ ] [Dynamically Using PDA with Transfer Hooks](https://solana.stackexchange.com/questions/9352/dynamically-use-pda-with-transfer-hooks) - Technical implementation guide
- [ ] [Example PDA Queries for Solana](https://github.com/wormholelabs-xyz/example-queries-solana-pda) - Wormhole Labs implementation examples
- [x] [SystemProgram CreateAccount Data Size Limitations](https://stackoverflow.com/questions/70150946/systemprogramcreateaccount-data-size-limited-to-10240-in-inner-instructions) - Memory constraints documentation
- [ ] [Program Redeployment Constraints](https://solana.stackexchange.com/questions/2715/why-cant-i-close-a-solana-program-and-redeploy-to-the-same-program-id) - Program deployment best practices
- [x] [Solana Program Deployment Guide](https://solana.com/docs/programs/deploying) - Official deployment documentation
  - [x] [SBF Program Terminology](https://solana.stackexchange.com/questions/5807/what-does-sbf-as-in-sbf-program-stand-for) - Technical glossary
  - [x] [Solana Cluster Documentation](https://solana.com/docs/core/clusters) - Network architecture guide
- [x] [PDA Seed Storage Strategies](https://solana.stackexchange.com/questions/2840/best-ways-to-store-long-string-as-pda-seed) - Data structure optimization

#### Deployment & DevOps
- [ ] [Docker Image CI/CD with GitHub](https://www.reddit.com/r/docker/comments/f7eoh0/build_and_push_your_docker_images_using_github/) - Integration guide
- [ ] [GitHub Actions for Docker Deployments](https://www.learncloudnative.com/blog/2020-02-20-github-action-build-push-docker-images) - Automation workflow tutorial
- [ ] [Docker Build & Push GitHub Action](https://github.com/marketplace/actions/build-and-push-docker-images) - Official action documentation
- [ ] [Docker Multi-Platform Build Configuration](https://docs.docker.com/build/building/multi-platform/) - Cross-platform deployment guide

#### Web3 & Blockchain
- [ ] [Web3 Development Journey](https://lorisleiva.com/my-journey-into-web-3) - Technical progression overview
- [ ] [Solang Development Guide](https://www.quicknode.com/guides/solana-development/solidity/solang-get-started) - Solidity for Solana implementation

#### Project Management
- [ ] [GitHub Issue Assignment Documentation](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/assigning-issues-and-pull-requests-to-other-github-users) - Workflow optimization guide
