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

import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import {
  getBountyFactoryProgram,
  BOUNTY_FACTORY_PROGRAM_ID,
} from "@/components/anchor/bounty_factory";

import { ToastContainer, toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

// The bounty creating page
export default function CreateDonneerPage() {
  // Arrange
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bountyPda, setbountyPda] = useState<PublicKey>();
  const [donation, setDonation] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const { publicKey, signTransaction, sendTransaction } = useWallet();
  if (!publicKey || !signTransaction) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to donate"
      />
    );
  }

  const onClickAirDrop = async () => {
    // Resolve
    console.log("Balance", await connection.getBalance(publicKey));
    await connection.requestAirdrop(publicKey, 3 * LAMPORTS_PER_SOL);
    console.log("Airdrop requested");
    console.log("Balance", await connection.getBalance(publicKey));
  };

  const onClickCreate = async () => {
    if (!bountyPda || !donation) {
      return;
    }

    // Resolve
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [donerPda, _donerPdaBump] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("doner"),
        publicKey.toBuffer(),
        bountyPda.toBuffer(),
      ],
      BOUNTY_FACTORY_PROGRAM_ID,
    );
    const createDonerV1Acc = {
      doner: publicKey,
      donerAccount: donerPda,
      bounty: bountyPda,
      systemProgram: SystemProgram.programId,
    };

    try {
      const latestBlockhash = await connection.getLatestBlockhash();
      const ix = await program.methods
        .createDonerV1(new anchor.BN(donation), "")
        .accountsPartial(createDonerV1Acc)
        .instruction();

      // Create a new TransactionMessage with version and compile it to legacy
      const messageLegacy = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [ix],
      }).compileToLegacyMessage();
      // Create a new VersionedTransaction which supports legacy and v0
      const transaction = new VersionedTransaction(messageLegacy);
      const tx = await signTransaction(transaction);

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed",
      );

      toast.success("Successfully donated");
    } catch (error) {
      toast.error("Create doner failed: " + error);
    }
  };

  const onClickCreateWraped = async () => {
    setIsLoading(true);
    // Resolve
    await onClickCreate();
    setIsLoading(false);
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">
            Donate to a Bounty
          </h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">Donate to the bounty</p>
        </div>
        <div className="flex justify-center space-x-4">
          <input
            className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold"
            placeholder="Donation"
            value={donation}
            onChange={(e) => setDonation(Number(e.target.value))}
          />
          {/* TODO: bountyPda? */}
          <input
            className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold"
            placeholder="Bounty Address"
            value={bountyPda?.toString()}
            onChange={(e) => setbountyPda(new PublicKey(e.target.value))}
          />
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
            onClick={onClickCreateWraped}
            disabled={!bountyPda?.toString() || !donation || isLoading}
          >
            {isLoading ? "Donating..." : "Donate"}
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
