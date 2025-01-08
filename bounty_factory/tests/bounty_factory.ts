import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BountyFactory } from "../target/types/bounty_factory";

import { Keypair, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { expect } from "chai";

////////////////////////////////////////////////////////////////////////////////

async function errorHandlingTemplate<T>(connection: anchor.web3.Connection, promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof anchor.web3.SendTransactionError) {
      console.error("Transaction failed:", error.message);
      console.error("Logs:", error.getLogs(connection));
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

async function expectError<T>(promise: Promise<T>): Promise<boolean> {
  try {
    await promise;
    return false;
  } catch (error) {
    // console.log("Caught error:", error);
    return true;
  }
}

////////////////////////////////////////////////////////////////////////////////

describe("bounty_factory", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const connection = anchor.getProvider().connection;
  const errorHandling = (promise: Promise<any>) => errorHandlingTemplate(connection, promise);

  const pBountryFactory = anchor.workspace.BountyFactory as Program<BountyFactory>;

  const wallet1 = anchor.Wallet.local();
  const wallet2 = Keypair.generate();

  //////////////////////////////////////////////////////////////////////////////

  beforeEach(async () => {
    // Ensure the wallets has enough lamports
    {
      const balance = await connection.getBalance(wallet1.publicKey);
      // console.log("Balance (sol):", balance / LAMPORTS_PER_SOL);
      if (balance < 3 * LAMPORTS_PER_SOL) {
        await connection.requestAirdrop(wallet1.publicKey, 3 * LAMPORTS_PER_SOL);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for airdrop to complete
      }
    }
    {
      const balance = await connection.getBalance(wallet2.publicKey);
      // console.log("Balance (sol):", balance / LAMPORTS_PER_SOL);
      if (balance < 3 * LAMPORTS_PER_SOL) {
        await connection.requestAirdrop(wallet2.publicKey, 3 * LAMPORTS_PER_SOL);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for airdrop to complete
      }
    }
  });

  //////////////////////////////////////////////////////////////////////////////

  it("should complete the life cycle of a bounty in a simple commission case", async () => {
    const title = "Test Bounty";
    const url = "https://test.com";

    const [bountyPda, _bountyPdaBump] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("bounty"),
        wallet1.publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(url),
      ],
      pBountryFactory.programId
    );

    // Create a bounty
    ////////////////////////////////////////////////////////////////////////////
    // Arrange
    const createV1Acc = {
      owner: wallet1.publicKey,
      bounty: bountyPda,
      systemProgram: SystemProgram.programId,
    }

    ////////////////////////////////////////////////////////////////////////////
    // Act
    await errorHandling(
      pBountryFactory.methods.createV1(title, url, [], null)
        .accountsPartial(createV1Acc)
        .signers([wallet1.payer])
        .rpc()
    );

    ////////////////////////////////////////////////////////////////////////////
    // Assert
    {
      const bounty = await pBountryFactory.account.bountyV1.fetch(bountyPda);
      expect(bounty.title).to.equal(title);
      expect(bounty.url).to.equal(url);
      expect(bounty.owner.toString()).to.equal(wallet1.publicKey.toString());
      expect(bounty.asignee).to.be.null;
    }
    const bountyInitBalance = await connection.getBalance(bountyPda);

    // Update a bounty
    ////////////////////////////////////////////////////////////////////////////
    // Arrange
    const updateV1Acc1 = {
      owner: wallet1.publicKey,
      bounty: bountyPda,
    }

    ////////////////////////////////////////////////////////////////////////////
    // Act
    const newTitle = "New Test Bounty";
    await errorHandling(
      pBountryFactory.methods.updateV1(newTitle, null, null)
        .accountsPartial(updateV1Acc1)
        .signers([wallet1.payer])
        .rpc()
    );

    ////////////////////////////////////////////////////////////////////////////
    // Assert
    {
      const bounty = await pBountryFactory.account.bountyV1.fetch(bountyPda);
      expect(bounty.title).to.equal(newTitle);
    }

    // Issue a bounty (fail)
    ////////////////////////////////////////////////////////////////////////////
    // Arrange
    const issueV1AccFail = {
      comminssioner1: wallet1.publicKey,
      bounty: bountyPda,
      assignee: wallet2.publicKey,
      systemProgram: SystemProgram.programId,
    }

    ////////////////////////////////////////////////////////////////////////////
    // Act & Assert
    {
      const errorHappened = await expectError(
        pBountryFactory.methods.issueV1()
          .accountsPartial(issueV1AccFail)
          .signers([wallet1.payer])
          .rpc()
      );
      expect(errorHappened).to.be.true;
    }

    // Donate to a bounty
    ////////////////////////////////////////////////////////////////////////////
    // Arrange
    const [donerPda, _donerPdaBump] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("doner"),
        wallet2.publicKey.toBuffer(),
        bountyPda.toBuffer(),
      ],
      pBountryFactory.programId
    );

    const createDonerV1Acc = {
      doner: wallet2.publicKey,
      donerAccount: donerPda,
      bounty: bountyPda,
      systemProgram: SystemProgram.programId,
    };

    ////////////////////////////////////////////////////////////////////////////
    // Act
    const donation = new anchor.BN(100);
    const message: string = "Donation message";
    await errorHandling(
      pBountryFactory.methods.createDonerV1(donation, message)
        .accountsPartial(createDonerV1Acc)
        .signers([wallet2])
        .rpc()
    );

    ////////////////////////////////////////////////////////////////////////////
    // Assert
    {
      const doner = await pBountryFactory.account.donerV1.fetch(donerPda);
      expect(doner.doner.toString()).to.equal(wallet2.publicKey.toString());
      expect(doner.donation.toNumber()).to.equal(donation.toNumber());
      expect(doner.message).to.equal(message);

      const donersOfBounty = await pBountryFactory.account.donerV1.all([
        {
          memcmp: {
            offset: 8 + 32 + 8, // 8 bytes: discriminator, 32 bytes: doner, 8 bytes: timestamp
            bytes: bountyPda.toBase58(),
          },
        },
      ]);
      expect(donersOfBounty.length).to.equal(1);
      expect(donersOfBounty[0].account.doner.toString()).to.equal(wallet2.publicKey.toString());
      expect(donersOfBounty[0].account.donation.toNumber()).to.equal(donation.toNumber());

      const bountyBalance = await connection.getBalance(bountyPda);
      expect(bountyBalance).to.equal(bountyInitBalance + donation.toNumber());

      const bounty = await pBountryFactory.account.bountyV1.fetch(bountyPda);
      expect(bounty.donation.toNumber()).to.equal(donation.toNumber());
    }

    // Close a bounty (fail)
    ////////////////////////////////////////////////////////////////////////////
    // Arrange
    const closeV1Acc1 = {
      owner: wallet1.publicKey,
      bounty: bountyPda,
      systemProgram: SystemProgram.programId,
    };

    ////////////////////////////////////////////////////////////////////////////
    // Act & Assert
    {
      const errorHappened = await expectError(
        pBountryFactory.methods.closeV1()
          .accountsPartial(closeV1Acc1)
          .signers([wallet1.payer])
          .rpc()
      );
      expect(errorHappened).to.be.true;
    }

    // Assign a bounty
    ////////////////////////////////////////////////////////////////////////////
    // Arrange
    const updateV1Acc2 = {
      owner: wallet1.publicKey,
      bounty: bountyPda,
    };

    ////////////////////////////////////////////////////////////////////////////
    // Act
    await errorHandling(
      pBountryFactory.methods.updateV1(null, [wallet1.publicKey], wallet2.publicKey)
        .accountsPartial(updateV1Acc2)
        .signers([wallet1.payer])
        .rpc()
    );

    ////////////////////////////////////////////////////////////////////////////
    // Assert
    {
      const bounty = await pBountryFactory.account.bountyV1.fetch(bountyPda);
      expect(bounty.asignee.toString()).to.equal(wallet2.publicKey.toString());
    }

    // Complete a bounty
    ////////////////////////////////////////////////////////////////////////////
    // Arrange
    const issueV1Acc = {
      comminssioner1: wallet1.publicKey,
      bounty: bountyPda,
      assignee: wallet2.publicKey,
      systemProgram: SystemProgram.programId,
    }

    ////////////////////////////////////////////////////////////////////////////
    // Act
    await errorHandling(
      pBountryFactory.methods.issueV1()
        .accountsPartial(issueV1Acc)
        .signers([wallet1.payer])
        .rpc()
    );

    ////////////////////////////////////////////////////////////////////////////
    // Assert
    {
      const bounty = await pBountryFactory.account.bountyV1.fetch(bountyPda);
      expect(bounty.donation.toNumber()).to.equal(0);
      
      const bountyBalance = await connection.getBalance(bountyPda);
      expect(bountyBalance).to.equal(bountyInitBalance);
    }

    // Close a bounty
    ////////////////////////////////////////////////////////////////////////////
    // Arrange
    const closeV1Acc2 = {
      owner: wallet1.publicKey,
      bounty: bountyPda,
      systemProgram: SystemProgram.programId,
    };

    ////////////////////////////////////////////////////////////////////////////
    // Act
    await errorHandling(
      pBountryFactory.methods.closeV1()
        .accountsPartial(closeV1Acc2)
        .signers([wallet1.payer])
        .rpc()
    );

    ////////////////////////////////////////////////////////////////////////////
    // Assert
    {
      const errorHappened = await expectError(
        pBountryFactory.account.bountyV1.fetch(bountyPda)
      );
      expect(errorHappened).to.be.true;
    }
  });
});
