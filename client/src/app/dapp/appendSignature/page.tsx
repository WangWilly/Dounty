"use client";
import { useState } from "react";
import Link from "next/link";

import {
  SystemProgram,
  PublicKey,
  TransactionMessage,
  NonceAccount,
  MessageV0,
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
  createSignature,
} from "@/app/dapp/userClient/functions";

import * as nacl from "tweetnacl";
import * as bs58 from "bs58";

import { ToastContainer, toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  // Arrange
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bountyPda, setbountyPda] = useState<PublicKey>();

  const { publicKey, signMessage } = useWallet();
  if (!publicKey || !signMessage) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to sign"
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
    // TODO: check if the user is a commissioner
    // if (
    //   !bounty.commissioners
    //     .map((pubkey) => pubkey.toBase58())
    //     .includes(publicKey.toBase58())
    // ) {
    //   toast.error("You are not a commissioner");
    //   toast.error("Commissioners: " + bounty.commissioners.join(", "));
    //   return;
    // }

    const existingTxRes = await safe(getTx(bountyPda.toBase58()));
    if (existingTxRes.success) {
      const existingTx = existingTxRes.data;
      if (!existingTx) {
        toast.error("No existing transaction");
        return;
      }
      if (!existingTx.serializedIxBase64) {
        toast.error("SerializedIxBase64 is empty");
        return;
      }

      toast.info("Existing transaction found");
      // https://solanacookbook.com/references/offline-transactions.html#sign-transaction
      const serializedIx = Buffer.from(existingTx.serializedIxBase64, "base64");
      const txMessage = MessageV0.deserialize(serializedIx);
      const signRes = await safe(signMessage(txMessage.serialize()));
      if (!signRes.success) {
        toast.error("Failed to sign message: " + signRes.error);
        return;
      }
      const signature = signRes.data;
      const signatureBase58 = bs58.default.encode(signature);
      const createRes = await safe(
        createSignature({
          serializedIxBase64: existingTx.serializedIxBase64,
          signerPublicKeyBase58: publicKey.toBase58(),
          signatureBase58,
        }),
      );
      if (!createRes.success) {
        toast.error("Failed to create signature: " + createRes.error);
        return;
      }
      toast.success("Create signature success");

      return;
    }

    // There is no existing transaction, create a new one
    // TODO: if bounty changes, the transaction should be re-created
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
    const nonceAdvIx = SystemProgram.nonceAdvance({
      noncePubkey: nonceAccountPubkey,
      authorizedPubkey: nonceAccount.authorizedPubkey,
    });

    const issueV1Acc = {
      commissioner1: bounty.commissioners[0],
      commissioner2: bounty.commissioners[1],
      commissioner3: bounty.commissioners[2],
      commissioner4: bounty.commissioners[3],
      commissioner5: bounty.commissioners[4],
      bounty: bountyPda,
      assignee: bounty.assignee,
      systemProgram: SystemProgram.programId,
    };
    const ixRes = await safe(
      program.methods.issueV1().accounts(issueV1Acc).instruction(),
    );
    if (!ixRes.success) {
      toast.error("Failed to create instruction: " + ixRes.error);
      return;
    }
    const ix = ixRes.data;

    const serializedMessage = new TransactionMessage({
      payerKey: bounty.owner,
      recentBlockhash: nonceAccount.nonce,
      instructions: [nonceAdvIx, ix],
    })
      .compileToV0Message()
      .serialize();
    const serializedIxBase64 =
      Buffer.from(serializedMessage).toString("base64");

    const createRes = await safe(
      createTx({
        publicKey: bountyPda.toBase58(),
        serializedTx: {},
        serializedTxBase64: "",
        serializedIxBase64,
      }),
    );
    if (!createRes.success) {
      toast.error("Failed to create transaction: " + createRes.error);
      return;
    }

    const nonceSignatureBase58 = bs58.default.encode(
      nacl.sign.detached(
        serializedMessage,
        bs58.default.decode(nonceAccountRes.data.secretKey),
      ),
    );
    const createNonceSignatureRes = await safe(
      createSignature({
        serializedIxBase64,
        signerPublicKeyBase58: publicKey.toBase58(),
        signatureBase58: nonceSignatureBase58,
      }),
    );
    if (!createNonceSignatureRes.success) {
      toast.warn(
        "Failed to create nonce signature: " + createNonceSignatureRes.error,
      );
    }

    const sigRes = await safe(signMessage(serializedMessage));
    if (!sigRes.success) {
      toast.error("Failed to sign message: " + sigRes.error);
      return;
    }
    const signature = sigRes.data;
    const signatureBase58 = bs58.default.encode(signature);
    const createSigRes = await safe(
      createSignature({
        serializedIxBase64,
        signerPublicKeyBase58: publicKey.toBase58(),
        signatureBase58,
      }),
    );
    if (!createSigRes.success) {
      toast.error("Failed to create signature: " + createSigRes.error);
      return;
    }

    toast.success("Create transaction success");
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

////////////////////////////////////////////////////////////////////////////////

// https://solana.stackexchange.com/questions/9701/signtransaction-removes-partialsigned-signatures-making-it-impossible-to-sign-a
// https://solana.stackexchange.com/questions/5007/partial-sign-transaction-from-front-end
