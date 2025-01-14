"use client";
import { useState } from "react";
import Link from "next/link";

import * as anchor from "@coral-xyz/anchor";
import {
  SystemProgram,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { toHashedSeed } from "@/utils/web3";
import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import {
  getBountyFactoryProgram,
  BOUNTY_FACTORY_PROGRAM_ID,
} from "@/components/anchor/bounty_factory";

import { ToastContainer, toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

// The bounty creating page
export default function CreatePage() {
  // Arrange
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bountyTitle, setBountyTitle] = useState("");
  const [bountyUrl, setBountyUrl] = useState("");

  const { publicKey, signTransaction, sendTransaction } = useWallet();
  if (!publicKey || !signTransaction) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to create a bounty"
      />
    );
  }

  const onClickAirDrop = async () => {
    // Resolve
    toast.info("Airdropping 3 SOL");
    try {
      await connection.requestAirdrop(publicKey, 3 * LAMPORTS_PER_SOL);
      toast.success("Airdrop succeeded");
    } catch (error) {
      console.error(error);
      toast.error("Airdrop failed");
    }
  };

  const onClickCreate = async () => {
    // Resolve
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [bountyPda, _bountyPdaBump] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("bounty"),
        publicKey.toBuffer(),
        toHashedSeed(bountyUrl),
      ],
      BOUNTY_FACTORY_PROGRAM_ID,
    );
    const createV1Acc = {
      owner: publicKey,
      bounty: bountyPda,
      systemProgram: SystemProgram.programId,
    };

    try {
      const latestBlockhash = await connection.getLatestBlockhash();
      const ix = await program.methods
        .createV1(bountyTitle, bountyUrl, [], null)
        .accountsPartial(createV1Acc)
        .instruction();

      // https://solana.com/docs/core/transactions
      // Create a new TransactionMessage with version and compile it to legacy
      const messageLegacy = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [ix],
      }).compileToLegacyMessage(); // TODO: anchor has already supported v0
      // Create a new VersionedTransaction which supports legacy and v0
      const transaction = new VersionedTransaction(messageLegacy);
      const signedTx = await signTransaction(transaction);

      const signature = await sendTransaction(signedTx, connection);
      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed",
      );
      toast.success("Create bounty succeeded");
    } catch (error) {
      console.error(error);
      toast.error("Create bounty failed: " + error);
    }
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">Create a Bounty</h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">Create a bounty pool for this ticket</p>
        </div>
        <div className="flex justify-center space-x-4">
          <input
            className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold"
            placeholder="Bounty Title"
            value={bountyTitle}
            onChange={(e) => setBountyTitle(e.target.value)}
          />
          <input
            className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold"
            placeholder="Bounty URL"
            value={bountyUrl}
            onChange={(e) => setBountyUrl(e.target.value)}
          />
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
            onClick={onClickCreate}
            disabled={!bountyTitle || !bountyUrl}
          >
            Create
          </button>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mt-6">
          <p className="text-gray-300">Or</p>

          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
            onClick={onClickAirDrop}
          >
            Airdrop
          </button>
          <Link href="/dapp">
            <div className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold">
              To bounty board
            </div>
          </Link>

          <p className="text-gray-300">Your address: {publicKey.toBase58()}</p>
        </div>
      </div>
    </div>
  );
}
