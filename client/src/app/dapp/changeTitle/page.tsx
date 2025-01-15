"use client";
import { useState } from "react";
import Link from "next/link";

import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { safe } from "@/utils/exception";
import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";

import { ToastContainer, toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  // Arrange
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bountyPda, setbountyPda] = useState<PublicKey>();
  const [title, setTitle] = useState<string>();

  const { publicKey, signTransaction, sendTransaction } = useWallet();
  if (!publicKey || !signTransaction) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to change the asignee of the bounty"
      />
    );
  }

  const onClickSubmit = async () => {
    // Resolve
    if (!bountyPda) {
      toast.error("Bounty address is required");
      return;
    }
    const bountyRes = await safe(
      program.account.bountyV1.fetch(bountyPda.toBase58()),
    );
    if (!bountyRes.success) {
      toast.error("Bounty not found: " + bountyRes.error);
      return;
    }
    const bounty = bountyRes.data;
    if (!bounty) {
      toast.error("Bounty not found");
      return;
    }
    if (!bounty.owner.equals(publicKey)) {
      toast.error("Only the owner can change the title");
      return;
    }

    if (!title) {
      toast.error("Title is required");
      return;
    }

    const updateV1Acc = {
      owner: publicKey,
      bounty: bountyPda,
    };

    const ixRes = await safe(
      program.methods
        .updateV1(title, null, null)
        .accounts(updateV1Acc)
        .instruction(),
    );
    if (!ixRes.success) {
      toast.error("Failed to create instruction: " + ixRes.error);
      return;
    }
    const updateIx = ixRes.data;
    const latestBlockhash = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
      payerKey: publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: [updateIx],
    }).compileToV0Message();
    const transaction = new VersionedTransaction(message);
    const signedTxRes = await safe(signTransaction(transaction));
    if (!signedTxRes.success) {
      toast.error("Failed to sign transaction: " + signedTxRes.error);
      return;
    }
    // const sendRes = await safe(sendTransaction(signedTxRes.data, connection));
    // if (!sendRes.success) {
    //   toast.error("Failed to send transaction: " + sendRes.error);
    //   return;
    // }
    // const signature = sendRes.data;
    const signature = await sendTransaction(transaction, connection);

    const comfirmRes = await safe(
      connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed",
      ),
    );
    if (!comfirmRes.success) {
      toast.error("Failed to confirm transaction: " + comfirmRes.error);
      return;
    }

    toast.success("Change title succeeded");
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">
            Change the title of the bounty
          </h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">
            Change the title of the bounty to a new title
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <input
            className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold"
            placeholder="Bounty Address"
            value={bountyPda?.toString()}
            onChange={(e) => setbountyPda(new PublicKey(e.target.value))}
          />
          <input
            className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold"
            placeholder="Bounty Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
            onClick={onClickSubmit}
            disabled={!bountyPda || !title}
          >
            Change
          </button>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mt-6">
          <p className="text-gray-300">Or</p>
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
