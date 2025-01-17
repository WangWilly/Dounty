"use client";
import { useState, useMemo } from "react";
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
  const [commissionerStrs, setCommissionerStrs] = useState<string[]>();
  const commissioners = useMemo(() => {
    return commissionerStrs
      ?.filter((str) => {
        const keyRes = safe(() => new PublicKey(str));
        return keyRes.success;
      })
      .map((str) => new PublicKey(str));
  }, [commissionerStrs]);

  const [isLoading, setIsLoading] = useState(false);

  const { publicKey, signTransaction, sendTransaction } = useWallet();
  if (!publicKey || !signTransaction) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to change the commissioners"
      />
    );
  }

  const onClickSubmit = async () => {
    setIsLoading(true);
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
      toast.error("Only the owner can change the commissioners");
      return;
    }

    if (!commissioners || commissioners.length === 0) {
      toast.error("Commissioners are required");
      return;
    }

    const updateV1Acc = {
      owner: publicKey,
      bounty: bountyPda,
    };

    const ixRes = await safe(
      program.methods
        .updateV1(null, commissioners, null)
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

    toast.success("Change commissioners succeeded");
    setIsLoading(false);
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">
            Change the commissioners of the bounty
          </h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">
            Change the commissioners of the bounty to a new list of
            commissioners
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <input
            className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold"
            placeholder="Bounty Address"
            value={bountyPda?.toString()}
            onChange={(e) => setbountyPda(new PublicKey(e.target.value))}
          />
          <div className="flex flex-col space-y-2">
            {commissionerStrs?.map((commissionerStr, index) => (
              <input
                key={index}
                className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold"
                placeholder={`Commissioner ${index + 1}`}
                value={commissionerStr}
                onChange={(e) => {
                  const newCommissioners = [...commissionerStrs];
                  newCommissioners[index] = e.target.value;
                  setCommissionerStrs(newCommissioners);
                }}
              />
            ))}
          </div>
          <div className="flex flex-col space-y-2">
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold"
              onClick={() =>
                setCommissionerStrs([...(commissionerStrs || []), ""])
              }
              disabled={isLoading}
            >
              Add Commissioner
            </button>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold"
              onClick={() =>
                setCommissionerStrs(commissionerStrs?.slice(0, -1))
              }
              disabled={
                !commissionerStrs || commissionerStrs.length === 0 || isLoading
              }
            >
              Remove Commissioner
            </button>
          </div>
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold"
            onClick={onClickSubmit}
            disabled={!bountyPda || isLoading}
          >
            {isLoading ? "Changing..." : "Change"}
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
