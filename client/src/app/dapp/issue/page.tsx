"use client";
import { useState } from "react";
import Link from "next/link";

import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { safe } from "@/utils/exception";
import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import { getTx, listSignaturesByTx } from "@/clients/userClient/functions";

import { ToastContainer, toast } from "react-toastify";

import * as bs58 from "bs58";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  // Arrange
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bountyPda, setbountyPda] = useState<PublicKey>();

  const [isLoading, setIsLoading] = useState(false);

  const { publicKey, sendTransaction } = useWallet();
  if (!publicKey) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to issue a bounty"
      />
    );
  }

  const onClickIssue = async () => {
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

    if (!existingTx.serializedTxBase64) {
      toast.error("No existing transaction");
      return;
    }
    const tx = VersionedTransaction.deserialize(
      Buffer.from(existingTx.serializedTxBase64, "base64"),
    );

    const signaturesRes = await safe(
      listSignaturesByTx({ ixBase64: existingTx.serializedIxBase64 }),
    );
    if (!signaturesRes.success) {
      toast.error("Failed to get signatures: " + signaturesRes.error);
      return;
    }
    const signatures = signaturesRes.data.signatures;
    if (!signatures || !signatures.length) {
      toast.error("No signatures");
      return;
    }
    const txSignatures = signatures.map((signature) => ({
      publicKey: new PublicKey(signature.signerPublicKeyBase58),
      signature: bs58.default.decode(signature.signatureBase58),
    }));

    // TODO: confirm the transaction
    // https://www.quicknode.com/guides/solana-development/transactions/how-to-send-offline-tx
    for (const txSignature of txSignatures) {
      try {
        tx.addSignature(txSignature.publicKey, txSignature.signature);
      } catch (error) {
        toast.error("Failed to add signature: " + error);
      }
    }
    const sigRes = await safe(sendTransaction(tx, connection));
    if (!sigRes.success) {
      toast.error("Failed to send transaction: " + sigRes.error);
      return;
    }

    toast.success("Transaction sent");
  };

  const onClickIssueWrapped = async () => {
    setIsLoading(true);
    await onClickIssue();
    setIsLoading(false);
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
            onClick={onClickIssueWrapped}
            disabled={!bountyPda || isLoading}
          >
            {isLoading ? "Appending..." : "Append"}
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
