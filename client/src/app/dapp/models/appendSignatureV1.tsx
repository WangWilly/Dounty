import {
  getBountyNonceAccountPublicKey,
  createTx,
  createSignature,
  getTx,
} from "@/clients/userClient/functions";
import {
  BountyFactory,
  getBountyFactoryProgram,
} from "@/components/anchor/bounty_factory";
import { BountyV1, bountyV1Schema } from "@/components/anchor/dtos/bountyV1";
import { useAnchorProvider } from "@/components/solana_provider";
import { safe } from "@/utils/exception";
import { Program } from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Button, Spinner } from "@nextui-org/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  VersionedTransaction,
  PublicKey,
  Connection,
  NonceAccount,
  TransactionInstruction,
  SystemProgram,
  TransactionMessage,
} from "@solana/web3.js";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

interface Props {
  bountyPda: string;
  setSignBountyPda: Dispatch<SetStateAction<string | null>>;
}

////////////////////////////////////////////////////////////////////////////////

export default function AppendSignatureModel({
  bountyPda,
  setSignBountyPda,
}: Props) {
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [isLoading, setIsLoading] = useState(false);

  const { publicKey, signMessage, signTransaction } = useWallet();
  if (!publicKey || !signMessage || !signTransaction) {
    return null;
  }
  const userPublicKey = publicKey;

  let bountyPdaPubkey: PublicKey | null = null;
  try {
    bountyPdaPubkey = new PublicKey(bountyPda);
  } catch (e) {
    toast.error("Invalid bounty PDA: " + e);
    return null;
  }

  //////////////////////////////////////////////////////////////////////////////

  const onClickAppend = async () => {
    setIsLoading(true);
    // Resolve
    if (!bountyPdaPubkey) {
      toast.error("Bounty address is required");
      return;
    }
    const bounty = await getBounty(program, bountyPdaPubkey);
    if (!bounty) {
      setIsLoading(false);
      return;
    }
    if (!bounty.commissioners.includes(userPublicKey.toBase58())) {
      toast.error("You are not a commissioner");
      toast.error("Commissioners: " + bounty.commissioners.join(", "));
      return;
    }

    const nonceInfo = await getNonceAccount(connection, bountyPdaPubkey);
    if (!nonceInfo) {
      setIsLoading(false);
      return;
    }
    const nonceAdvIx = SystemProgram.nonceAdvance(nonceInfo.nonceAdvParam);
    const programIx = await getProgramIx(program, bountyPdaPubkey, bounty);
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

    const existingTxRes = await safe(getTx(bountyPdaPubkey.toBase58()));
    if (!existingTxRes.success) {
      // There is no existing transaction, create a new one
      await createTxToDb(
        bountyPdaPubkey.toBase58(),
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
        bountyPdaPubkey.toBase58(),
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
        bountyPdaPubkey.toBase58(),
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
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
        <div className="flex items-center pb-3 border-b border-gray-300">
          <h3 className="text-gray-800 text-xl font-bold flex-1">
            Append Signature
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 ml-2 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500"
            viewBox="0 0 320.591 320.591"
            onClick={() => setSignBountyPda(null)}
          >
            <path
              d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
              data-original="#000000"
            ></path>
            <path
              d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
              data-original="#000000"
            ></path>
          </svg>
        </div>

        <div className="my-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            ⚠️ Giving a signature to the transaction means you agree with the
            terms and conditions of the bounty. You can only sign the
            transaction if you are a commissioner of the bounty.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            ⚠️ Remember that only the asignee should be set then the bounty is
            available to be signed.
          </p>
        </div>

        <div className="border-t border-gray-300 pt-6 flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-gray-800 text-sm border-none outline-none tracking-wide bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
            onClick={() => setSignBountyPda(null)}
          >
            Close
          </button>
          <Button
            type="button"
            className="px-4 py-2 rounded-lg text-white text-sm border-none outline-none tracking-wide bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
            onPress={onClickAppend}
          >
            {isLoading ? <Spinner /> : "Append Signature"}
          </Button>
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
  return bs58.encode(signature);
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

  return true;
}
