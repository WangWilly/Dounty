"use client";
import { useState } from "react";
import Link from "next/link";

import {
  PublicKey,
  VersionedTransaction,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { safe } from "@/utils/exception";
import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import { getTx } from "@/app/dapp/userClient/functions";

import { ToastContainer, toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  // Arrange
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bountyPda, setbountyPda] = useState<PublicKey>();

  const { publicKey, sendTransaction } = useWallet();
  if (!publicKey) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to issue a bounty"
      />
    );
  }

  const onClickAppend = async () => {
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
    if (bounty.assignee === null) {
      toast.error("Bounty not assigned");
      return;
    }

    const existingTxRes = await safe(getTx(bountyPda.toBase58()));
    if (!existingTxRes.success) {
      toast.error("Failed to get existing transaction: " + existingTxRes.error);
      return;
    }
    if (!existingTxRes.data) {
      toast.error("No existing transaction");
      return;
    }
    const existingTx = existingTxRes.data;
    const transaction = VersionedTransaction.deserialize(
      Buffer.from(existingTx.serializedTx, "base64"),
    );
    // TODO: confirm the transaction
    // https://www.quicknode.com/guides/solana-development/transactions/how-to-send-offline-tx
    await safe(
      sendTransaction(transaction, connection),
    );

    toast.success("Transaction sent");
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">
            Append a signature to agree the decision
          </h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">
            Append a signature to agree the decision of the bounty
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <input
            className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold"
            placeholder="Bounty Address"
            value={bountyPda?.toString()}
            onChange={(e) => setbountyPda(new PublicKey(e.target.value))}
          />
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
            onClick={onClickAppend}
            disabled={!bountyPda}
          >
            Create
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
