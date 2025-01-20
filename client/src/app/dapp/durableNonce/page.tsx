"use client";
import { useState } from "react";
import Link from "next/link";

import {
  SystemProgram,
  PublicKey,
  Transaction,
  Keypair,
  NONCE_ACCOUNT_LENGTH,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { safe } from "@/utils/exception";
import NoWallet from "@/components/dapp/noWallet";
import * as userClient from "@/clients/userClient/functions";

import * as bs58 from "bs58";

import { ToastContainer, toast } from "react-toastify";
import { useAnchorProvider } from "@/components/solana_provider";
import {
  BountyFactory,
  getBountyFactoryProgram,
} from "@/components/anchor/bounty_factory";
import { BountyV1, bountyV1Schema } from "@/components/anchor/dtos/bountyV1";
import { Program } from "@coral-xyz/anchor";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  // Arrange
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bountyPda, setbountyPda] = useState<PublicKey>();

  const [isLoading, setIsLoading] = useState(false);

  const { publicKey, signTransaction, sendTransaction } = useWallet();
  if (!publicKey || !signTransaction) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet for the nonce account"
      />
    );
  }

  const onClickCreate = async () => {
    if (!bountyPda) {
      return;
    }
    const nonceAccountRes = await safe(
      userClient.getBountyNonceAccountPublicKey(bountyPda.toBase58()),
    );
    if (nonceAccountRes.success) {
      if (nonceAccountRes.data.txPublickey === bountyPda.toBase58()) {
        toast.info("Nonce account already exists");
        return;
      }
    }

    const bounty = await getBounty(program, bountyPda);
    if (!bounty) {
      toast.error("Failed to get the bounty");
      return;
    }
    if (bounty.owner !== publicKey.toBase58()) {
      toast.error("Only the owner can create a nonce account");
      return;
    }

    // Resolve
    const nonceAccountKp = Keypair.generate();
    const createAccountIx = SystemProgram.createAccount({
      fromPubkey: publicKey,
      newAccountPubkey: nonceAccountKp.publicKey,
      lamports:
        await connection.getMinimumBalanceForRentExemption(
          NONCE_ACCOUNT_LENGTH,
        ),
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    });
    const inializeNonceIx = SystemProgram.nonceInitialize({
      noncePubkey: nonceAccountKp.publicKey,
      authorizedPubkey: publicKey,
    });
    const latestBlockhash = await connection.getLatestBlockhash();
    const tx = new Transaction().add(createAccountIx, inializeNonceIx);
    tx.recentBlockhash = latestBlockhash.blockhash;
    tx.feePayer = publicKey;
    const signedTxRes = await safe(signTransaction(tx));
    if (!signedTxRes.success) {
      toast.error("Failed to sign the transaction");
      return;
    }
    const res = await safe(
      sendTransaction(signedTxRes.data, connection, {
        signers: [nonceAccountKp],
      }),
    );
    if (!res.success) {
      toast.error(`Failed to send the transaction: ${res.error}`);
      return;
    }

    const createNonceAccountRes = await safe(
      userClient.createNonceAccount({
        publicKey: nonceAccountKp.publicKey.toBase58(),
        txPublickey: bountyPda.toBase58(),
        secretKey: bs58.default.encode(nonceAccountKp.secretKey),
      }),
    );
    if (!createNonceAccountRes.success) {
      toast.error(
        `Failed to create the nonce account: ${createNonceAccountRes.error}`,
      );
      return;
    }

    toast.success("Nonce account created");
  };

  const onClickCreateWraped = async () => {
    setIsLoading(true);
    await onClickCreate();
    setIsLoading(false);
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">
            Create a Durable Nonce for multisig
          </h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">
            Create a durable nonce account for the bounty
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
            onClick={onClickCreateWraped}
            disabled={!bountyPda || isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
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

async function getBounty(
  program: Program<BountyFactory>,
  bountyPda: PublicKey,
): Promise<BountyV1 | null> {
  const bountyRes = await safe(
    program.account.bountyV1.fetch(bountyPda.toBase58()),
  );
  if (!bountyRes.success) {
    toast.error("Bounty not found: " + bountyRes.error);
    return null;
  }
  const bounty = bountyRes.data;
  if (!bounty) {
    toast.error("Bounty not found");
    return null;
  }
  if (bounty.assignee === null) {
    toast.error("Bounty not assigned");
    return null;
  }

  return bountyV1Schema.parse({ address: bountyPda, ...bounty });
}
