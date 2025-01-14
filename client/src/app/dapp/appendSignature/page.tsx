"use client";
import { useState } from "react";
import Link from "next/link";

import {
  SystemProgram,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  NonceAccount,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { safe } from "@/utils/exception";
import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import {
  getTx,
  createTx,
  getBountyNonceAccountPublicKey,
} from "@/app/dapp/userClient/functions";

import { ToastContainer, toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

// The bounty issuing page
export default function IssuePage() {
  // Arrange
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bountyPda, setbountyPda] = useState<PublicKey>();

  const { publicKey, signTransaction } = useWallet();
  if (!publicKey || !signTransaction) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to sign"
      />
    );
  }

  // TODO: only commissioners can sign the transaction
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
    if (bounty.asignee === null) {
      // toast.error("Bounty not assigned");
      // TODO: return;

      toast.warn("Bounty not assigned, assigning to the current user");
      bounty.asignee = publicKey;
    }

    // TODO: find existing transaction for issuing bounty
    const existingTxRes = await safe(getTx(bountyPda.toBase58()));
    if (existingTxRes.success) {
      const existingTx = existingTxRes.data;
      if (existingTx) {
        toast.info("Existing transaction found");

        const transaction = VersionedTransaction.deserialize(
          Buffer.from(existingTx.serializedTx, "base64"),
        );
        await signAndCreateTx(
          bountyPda.toBase58(),
          signTransaction,
          transaction,
        );
      }

      return;
    }

    // There is no existing transaction, create a new one
    const nonceAccountRes = await safe(
      getBountyNonceAccountPublicKey(bountyPda.toBase58()),
    );
    if (!nonceAccountRes.success) {
      toast.error("Failed to get nonce account: " + nonceAccountRes.error);
      return;
    }
    if (!nonceAccountRes.data) {
      toast.error("Nonce account not found");
      return;
    }
    const nonceAccountPubkey = new PublicKey(nonceAccountRes.data.publicKey);
    const accountInfoRes = await safe(
      connection.getAccountInfo(nonceAccountPubkey),
    );
    if (!accountInfoRes.success) {
      toast.error("Failed to get account info: " + accountInfoRes.error);
      return;
    }
    const accountInfo = accountInfoRes.data;
    if (!accountInfo) {
      toast.error("Account info not found");
      return;
    }
    const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);

    const issueV1Acc = {
      commissioner1: bounty.commissioners[0],
      commissioner2: bounty.commissioners[1],
      commissioner3: bounty.commissioners[2],
      commissioner4: bounty.commissioners[3],
      commissioner5: bounty.commissioners[4],
      bounty: bountyPda,
      assignee: bounty.asignee,
      systemProgram: SystemProgram.programId,
    };

    const ixRes = await safe(
      program.methods.issueV1().accountsPartial(issueV1Acc).instruction(),
    );
    if (!ixRes.success) {
      toast.error("Failed to create instruction: " + ixRes.error);
      return;
    }
    const ix = ixRes.data;

    // TODO: https://solana.com/developers/cookbook/transactions/offline-transactions
    // https://solana.com/docs/core/transactions
    // Create a new TransactionMessage with version and compile it to legacy
    const messageLegacy = new TransactionMessage({
      payerKey: publicKey,
      recentBlockhash: nonceAccount.nonce,
      instructions: [ix],
    }).compileToLegacyMessage(); // TODO: anchor has already supported v0
    // Create a new VersionedTransaction which supports legacy and v0
    const transaction = new VersionedTransaction(messageLegacy);
    await signAndCreateTx(bountyPda.toBase58(), signTransaction, transaction);
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">Append a signature to agree the decision</h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">Append a signature to agree the decision of the bounty</p>
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

////////////////////////////////////////////////////////////////////////////////

// https://solana.stackexchange.com/questions/9701/signtransaction-removes-partialsigned-signatures-making-it-impossible-to-sign-a
// https://solana.stackexchange.com/questions/5007/partial-sign-transaction-from-front-end
async function signAndCreateTx(
  bountyPdaBase58: string,
  signTransaction: (
    transaction: VersionedTransaction,
  ) => Promise<VersionedTransaction>,
  transaction: VersionedTransaction,
) {
  const signedTxRes = await safe(signTransaction(transaction));
  if (!signedTxRes.success) {
    toast.error("Failed to sign transaction: " + signedTxRes.error);
    return;
  }
  const signedTx = signedTxRes.data;
  const createRes = await safe(
    createTx({
      publicKey: bountyPdaBase58,
      serializedTx: {},
      serializedTxBase64: Buffer.from(signedTx.serialize()).toString("base64"),
    }),
  );
  if (!createRes.success) {
    toast.error("Failed to create transaction: " + createRes.error);
    return;
  }

  toast.success("Create transaction success");
  return;
}
