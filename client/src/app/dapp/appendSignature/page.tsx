"use client";
import { useState } from "react";
import Link from "next/link";

import {
  SystemProgram,
  PublicKey,
  TransactionMessage,
  NonceAccount,
  VersionedTransaction,
  Connection,
  TransactionInstruction,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { safe } from "@/utils/exception";
import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import {
  BountyFactory,
  getBountyFactoryProgram,
} from "@/components/anchor/bounty_factory";
import {
  getTx,
  createTx,
  getBountyNonceAccountPublicKey,
  createSignature,
} from "@/clients/userClient/functions";

import * as bs58 from "bs58";

import { ToastContainer, toast } from "react-toastify";
import { Program } from "@coral-xyz/anchor";
import { BountyV1, bountyV1Schema } from "@/components/anchor/dtos/bountyV1";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  // Arrange
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bountyPda, setbountyPda] = useState<PublicKey>();

  const [isLoading, setIsLoading] = useState(false);

  const { publicKey, signMessage, signTransaction } = useWallet();
  if (!publicKey || !signMessage || !signTransaction) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to sign"
      />
    );
  }

  const onClickAppend = async () => {
    setIsLoading(true);
    // Resolve
    if (!bountyPda) {
      toast.error("Bounty address is required");
      return;
    }
    const bounty = await getBounty(program, bountyPda);
    if (!bounty) {
      setIsLoading(false);
      return;
    }
    if (!bounty.commissioners.includes(publicKey.toBase58())) {
      toast.error("You are not a commissioner");
      toast.error("Commissioners: " + bounty.commissioners.join(", "));
      return;
    }

    const nonceInfo = await getNonceAccount(connection, bountyPda);
    if (!nonceInfo) {
      setIsLoading(false);
      return;
    }
    const nonceAdvIx = SystemProgram.nonceAdvance(nonceInfo.nonceAdvParam);
    const programIx = await getProgramIx(program, bountyPda, bounty);
    if (!programIx) {
      setIsLoading(false);
      return;
    }
    const currTx = await buildTx(
      bounty,
      nonceInfo.nonce,
      nonceAdvIx,
      programIx,
    );
    const getSigB58 = buildGetSignatureBase58(signTransaction);

    const existingTxRes = await safe(getTx(bountyPda.toBase58()));
    if (!existingTxRes.success) {
      // There is no existing transaction, create a new one
      await createTxToDb(
        bountyPda.toBase58(),
        currTx,
        publicKey.toBase58(),
        getSigB58,
      );
      setIsLoading(false);
      return;
    }

    const existingTx = existingTxRes.data;
    if (!existingTx) {
      // There is no existing transaction, create a new one
      await createTxToDb(
        bountyPda.toBase58(),
        currTx,
        publicKey.toBase58(),
        getSigB58,
      );
      setIsLoading(false);
      return;
    }

    toast.info("Existing transaction found");
    if (!existingTx.serializedTxBase64) {
      toast.error("SerializedTxBase64 is empty");
      return;
    }

    const currSerializedTx = Buffer.from(currTx.serialize()).toString("base64");
    if (existingTx.serializedTxBase64 !== currSerializedTx) {
      // The current transaction is different from the existing one
      toast.info("The current transaction is different from the existing one");
      await createTxToDb(
        bountyPda.toBase58(),
        currTx,
        publicKey.toBase58(),
        getSigB58,
      );
      setIsLoading(false);
      return;
    }

    const existingSerializedTx = Buffer.from(
      existingTx.serializedTxBase64,
      "base64",
    );
    const existingPrevTx =
      VersionedTransaction.deserialize(existingSerializedTx);
    const signatureBase58Res = await safe(getSigB58(existingPrevTx));
    if (!signatureBase58Res.success) {
      toast.error("Failed to get signature: " + signatureBase58Res.error);
      return;
    }
    const signatureBase58 = signatureBase58Res.data;
    const createSigRes = await safe(
      createSignature({
        serializedTxBase64: existingTx.serializedTxBase64,
        serializedIxBase64: "",
        signerPublicKeyBase58: publicKey.toBase58(),
        signatureBase58,
      }),
    );
    if (!createSigRes.success) {
      toast.error("Failed to create signature: " + createSigRes.error);
      setIsLoading(false);
      return;
    }
    toast.success("Create signature success");
    setIsLoading(false);

    return;
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

////////////////////////////////////////////////////////////////////////////////

// https://solana.stackexchange.com/questions/9701/signtransaction-removes-partialsigned-signatures-making-it-impossible-to-sign-a
// https://solana.stackexchange.com/questions/5007/partial-sign-transaction-from-front-end
async function getSignatureBase58(
  rawTx: VersionedTransaction,
  signTransaction: (
    transaction: VersionedTransaction,
  ) => Promise<VersionedTransaction>,
): Promise<string> {
  const signedTxRes = await safe(signTransaction(rawTx));
  if (!signedTxRes.success) {
    throw new Error("Failed to sign transaction: " + signedTxRes.error);
  }
  const signature = signedTxRes.data.signatures[0];
  return bs58.default.encode(signature);
}

function buildGetSignatureBase58(
  signTransaction: (
    transaction: VersionedTransaction,
  ) => Promise<VersionedTransaction>,
): (rawTx: VersionedTransaction) => Promise<string> {
  return async function (rawTx: VersionedTransaction) {
    return getSignatureBase58(rawTx, signTransaction);
  };
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

async function getNonceAccount(
  connection: Connection,
  bountyPda: PublicKey,
): Promise<{
  nonceAdvParam: { noncePubkey: PublicKey; authorizedPubkey: PublicKey };
  nonce: string;
} | null> {
  const nonceAccountRes = await safe(
    getBountyNonceAccountPublicKey(bountyPda.toBase58()),
  );
  if (!nonceAccountRes.success) {
    toast.error("Failed to get nonce account: " + nonceAccountRes.error);
    return null;
  }
  if (!nonceAccountRes.data) {
    toast.error("Nonce account not found");
    return null;
  }
  const nonceAccountPubkey = new PublicKey(nonceAccountRes.data.publicKey);
  const accountInfoRes = await safe(
    connection.getAccountInfo(nonceAccountPubkey),
  );
  if (!accountInfoRes.success) {
    toast.error("Failed to get account info: " + accountInfoRes.error);
    return null;
  }
  const accountInfo = accountInfoRes.data;
  if (!accountInfo) {
    toast.error("Account info not found");
    return null;
  }
  const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);

  return {
    nonceAdvParam: {
      noncePubkey: nonceAccountPubkey,
      authorizedPubkey: nonceAccount.authorizedPubkey,
    },
    nonce: nonceAccount.nonce,
  };
}

async function getProgramIx(
  program: Program<BountyFactory>,
  bountyPda: PublicKey,
  bounty: BountyV1,
): Promise<TransactionInstruction | null> {
  if (bounty.assignee === null) {
    toast.error("Bounty not assigned");
    return null;
  }

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
    return null;
  }
  return ixRes.data;
}

async function buildTx(
  bounty: BountyV1,
  nonce: string,
  nonceAdvIx: TransactionInstruction,
  ix: TransactionInstruction,
): Promise<VersionedTransaction> {
  const message = new TransactionMessage({
    payerKey: new PublicKey(bounty.owner),
    recentBlockhash: nonce,
    instructions: [nonceAdvIx, ix],
  }).compileToV0Message();
  const tx = new VersionedTransaction(message);
  // tx.signatures.forEach((sig) => {
  //   toast.info("Signature: " + bs58.default.encode(sig));
  // });

  return tx;
}

async function createTxToDb(
  bountyPdaBase58: string,
  tx: VersionedTransaction,
  signerPublicKeyBase58: string,
  getSigB58: (rawTx: VersionedTransaction) => Promise<string>,
): Promise<boolean> {
  // There is no existing transaction, create a new one
  const serializedTx = tx.serialize();
  const serializedTxBase64 = Buffer.from(serializedTx).toString("base64");
  const createRes = await safe(
    createTx({
      publicKey: bountyPdaBase58,
      serializedTx: {},
      serializedTxBase64: serializedTxBase64,
      serializedIxBase64: "",
    }),
  );
  if (!createRes.success) {
    toast.error("Failed to create transaction: " + createRes.error);
    return false;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // // Nonce signature
  // // https://github.com/coral-xyz/anchor/blob/23d1a2ca7298aca26ed7294465797c29d9ddf165/ts/packages/anchor/src/nodewallet.ts#L39
  // // Error: Cannot sign with non signer key
  // const nonceKp = Keypair.fromSecretKey(
  //   bs58.default.decode(nonceAccountRes.data.secretKey),
  // );
  // const nonceWalletSignedTx = new VersionedTransaction(tx.message);
  // try {
  //   nonceWalletSignedTx.sign([nonceKp]);
  // } catch (e) {
  //   toast.error("Failed to sign nonce transaction: " + e);
  //   return;
  // }
  // nonceWalletSignedTx.signatures.forEach((sig) => {
  //   toast.info("(Nonce) Signature: " + bs58.default.encode(sig));
  // });
  // const nonceSignatureBase58 = bs58.default.encode(
  //   nonceWalletSignedTx.signatures[0],
  // );
  // const createNonceSignatureRes = await safe(
  //   createSignature({
  //     serializedTxBase64: serializedTxBase64,
  //     serializedIxBase64: "",
  //     signerPublicKeyBase58: nonceAccountPubkey.toBase58(),
  //     signatureBase58: nonceSignatureBase58,
  //   }),
  // );
  // if (!createNonceSignatureRes.success) {
  //   toast.warn(
  //     "Failed to create nonce signature: " + createNonceSignatureRes.error,
  //   );
  // }

  ////////////////////////////////////////////////////////////////////////////
  // User signature
  const signatureBase58Res = await safe(getSigB58(tx));
  if (!signatureBase58Res.success) {
    toast.error("Failed to get signature: " + signatureBase58Res.error);
    return false;
  }
  const signatureBase58 = signatureBase58Res.data;
  const createSigRes = await safe(
    createSignature({
      serializedTxBase64: serializedTxBase64,
      serializedIxBase64: "",
      signerPublicKeyBase58,
      signatureBase58,
    }),
  );
  if (!createSigRes.success) {
    toast.error("Failed to create signature: " + createSigRes.error);
    return false;
  }

  toast.success("Create transaction success");
  return true;
}
