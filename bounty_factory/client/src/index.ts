import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { BountyFactory, IDL } from "../../target/types/bounty_factory";

// Address of your deployed program, replace with your program's address
const PROGRAM_ID = new PublicKey("HvZ9DweFNYWqV4WNf83cCWogUXmabZHsDNT29DaRUXvm");

class BountyClient {
  private program: Program<BountyFactory>;

  constructor(
    public readonly provider: anchor.AnchorProvider,
    programId: PublicKey = PROGRAM_ID
  ) {
    this.program = new Program<BountyFactory>(IDL, programId, provider);
  }

  static fromWallet(
    wallet: anchor.Wallet,
    connection: Connection,
    programId: PublicKey = PROGRAM_ID,
    opts: anchor.web3.ConfirmOptions = anchor.AnchorProvider.defaultOptions()
  ): BountyClient {
    const provider = new anchor.AnchorProvider(connection, wallet, opts);
    return new BountyClient(provider, programId);
  }

  async createBounty(
    title: string,
    url: string,
    commissioners: PublicKey[] | null = null,
    assignee: PublicKey | null = null
  ): Promise<PublicKey> {
    const [bountyPda] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("bounty"),
        this.provider.wallet.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(url),
      ],
      this.program.programId
    );

    await this.program.methods
      .createV1(title, url, commissioners, assignee)
      .accounts({
        owner: this.provider.wallet.publicKey,
        bounty: bountyPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return bountyPda;
  }

  async getBounty(bountyPda: PublicKey): Promise<any> {
    return await this.program.account.bountyV1.fetch(bountyPda);
  }

  async updateBounty(
    bountyPda: PublicKey,
    title: string | null = null,
    commissioners: PublicKey[] | null = null,
    assignee: PublicKey | null = null
  ): Promise<void> {
    await this.program.methods
      .updateV1(title, commissioners, assignee)
      .accounts({
        owner: this.provider.wallet.publicKey,
        bounty: bountyPda,
      })
      .rpc();
  }

  async issueBounty(
    bountyPda: PublicKey,
    commissioners: Keypair[],
    assignee: PublicKey
  ): Promise<void> {
    let accounts: any = {
      commissioner1: commissioners[0].publicKey,
      bounty: bountyPda,
      assignee: assignee,
      systemProgram: SystemProgram.programId,
    };

    if (commissioners.length > 1) {
      accounts.commissioner2 = commissioners[1].publicKey;
    }
    if (commissioners.length > 2) {
      accounts.commissioner3 = commissioners[2].publicKey;
    }
    if (commissioners.length > 3) {
      accounts.commissioner4 = commissioners[3].publicKey;
    }
    if (commissioners.length > 4) {
      accounts.commissioner5 = commissioners[4].publicKey;
    }

    await this.program.methods
      .issueV1()
      .accounts(accounts)
      .signers(commissioners)
      .rpc();
  }

  async createDoner(
    bountyPda: PublicKey,
    donation: BN,
    message: string
  ): Promise<PublicKey> {
    const [donerPda] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("doner"),
        this.provider.wallet.publicKey.toBuffer(),
        bountyPda.toBuffer(),
      ],
      this.program.programId
    );

    await this.program.methods
      .createDonerV1(donation, message)
      .accounts({
        doner: this.provider.wallet.publicKey,
        donerAccount: donerPda,
        bounty: bountyPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return donerPda;
  }

  async getDoner(donerPda: PublicKey): Promise<any> {
    return await this.program.account.donerV1.fetch(donerPda);
  }

  async closeBounty(bountyPda: PublicKey): Promise<void> {
    await this.program.methods
      .closeV1()
      .accounts({
        owner: this.provider.wallet.publicKey,
        bounty: bountyPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }
}

// Example usage:
(async () => {
  // Setup the connection and wallet
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const wallet = anchor.Wallet.local();

  // Ensure the wallet has enough lamports
  const balance = await connection.getBalance(wallet.publicKey);
  if (balance < 3 * LAMPORTS_PER_SOL) {
    await connection.requestAirdrop(wallet.publicKey, 3 * LAMPORTS_PER_SOL);
  }

  // Create a client instance
  const client = BountyClient.fromWallet(wallet, connection);

  // Example usage of client methods
  try {
    // Create a bounty
    const title = "Example Bounty";
    const url = "https://example.com/bounty";
    const commissioners = [Keypair.generate().publicKey, Keypair.generate().publicKey, Keypair.generate().publicKey];
    const assignee = Keypair.generate().publicKey;
    const bountyPda = await client.createBounty(title, url, commissioners, assignee);
    console.log("Bounty created:", bountyPda.toBase58());

    // Get bounty details
    const bounty = await client.getBounty(bountyPda);
    console.log("Bounty details:", bounty);

    // Update bounty
    const newTitle = "Updated Bounty Title";
    await client.updateBounty(bountyPda, newTitle);
    console.log("Bounty updated");

    // Create a doner
    const donation = new BN(LAMPORTS_PER_SOL); // 1 SOL
    const message = "Supporting this bounty!";
    const donerPda = await client.createDoner(bountyPda, donation, message);
    console.log("Doner created:", donerPda.toBase58());

    // Get doner details
    const doner = await client.getDoner(donerPda);
    console.log("Doner details:", doner);

    // Issue bounty (assuming commissioners are available)
    const commissionerKeypairs = commissioners.map(() => Keypair.generate());
    await client.issueBounty(bountyPda, commissionerKeypairs, assignee);
    console.log("Bounty issued");

    // Close bounty
    await client.closeBounty(bountyPda);
    console.log("Bounty closed");
  } catch (error) {
    console.error("Error:", error);
  }
})();

export { BountyClient }; 