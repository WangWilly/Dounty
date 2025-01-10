"use client";
import { useState } from "react";

import * as anchor from "@coral-xyz/anchor";
import { SystemProgram, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import { useAnchorProvider } from "@/components/solana_provider";
import { getBountyFactoryProgram, BOUNTY_FACTORY_PROGRAM_ID } from "@/components/anchor/bounty_factory";

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
    return <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">Create a Bounty</h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">Please connect your wallet to create a bounty</p>
        </div>
      </div>
    </div>
  }

  const onClickCreate = async () => {
    // Resolve
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [bountyPda, _bountyPdaBump] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("bounty"),
        publicKey.toBuffer(),
        anchor.utils.bytes.utf8.encode(bountyUrl),
      ],
      BOUNTY_FACTORY_PROGRAM_ID,
    );
    const createV1Acc = {
      owner: publicKey,
      bounty: bountyPda,
      systemProgram: SystemProgram.programId,
    }

    const latestBlockhash = await connection.getLatestBlockhash();
    const ix = await program.methods.createV1(bountyTitle, bountyUrl, [], null)
    .accountsPartial(createV1Acc)
    .instruction();

    // Create a new TransactionMessage with version and compile it to legacy
    const messageLegacy = new TransactionMessage({
      payerKey: publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: [ix],
    }).compileToLegacyMessage()
    // Create a new VersionedTransaction which supports legacy and v0
    const transaction = new VersionedTransaction(messageLegacy)
    const tx = await signTransaction(transaction);

    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
    console.log("Signature", signature);
  }

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
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
        </div>
    </div>
  )
}
