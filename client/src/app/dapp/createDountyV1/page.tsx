"use client";
import {
  BOUNTY_FACTORY_PROGRAM_ID,
  getBountyFactoryProgram,
} from "@/components/anchor/bounty_factory";
import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  NONCE_ACCOUNT_LENGTH,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toHashedSeed } from "@/utils/web3";
import { toast, ToastContainer } from "react-toastify";
import { safe } from "@/utils/exception";
import { Button } from "@nextui-org/react";

import * as userClient from "@/clients/userClient/functions";
import { SendTransactionOptions } from "@solana/wallet-adapter-base";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import Link from "next/link";
import { DefaultSpinner } from "@/components/ui/defaultSpinner";
import { createDoner } from "@/app/dapp/utils/createDonerV1Func";

////////////////////////////////////////////////////////////////////////////////
// https://readymadeui.com/tailwind-components/form
// https://readymadeui.com/tailwind-blocks/content-section

export default function CreatePage() {
  const { connection } = useConnection();

  const provider = useAnchorProvider();

  const [bountyTitle, setBountyTitle] = useState("");
  const [bountyUrl, setBountyUrl] = useState("");
  const [bountyCommissionerStrs, setBountyCommissionerStrs] = useState<
    string[]
  >([]);
  const commissioners = useMemo(() => {
    return bountyCommissionerStrs
      .filter((str) => {
        const keyRes = safe(() => new PublicKey(str));
        return keyRes.success;
      })
      .map((str) => new PublicKey(str));
  }, [bountyCommissionerStrs]);
  const [donation, setDonation] = useState(0);
  const [donationMsg, setDonationMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { publicKey, signTransaction, sendTransaction } = useWallet();
  if (!publicKey || !signTransaction) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to create a bounty"
      />
    );
  }

  //////////////////////////////////////////////////////////////////////////////

  const onClickCreate = async () => {
    const bountyPda = await createBounty(
      connection,
      provider,
      publicKey,
      bountyTitle,
      bountyUrl,
      commissioners,
      signTransaction,
      sendTransaction,
    );

    if (!bountyPda) {
      return;
    }

    await createNonceAccount(
      connection,
      provider,
      bountyPda,
      publicKey,
      signTransaction,
      sendTransaction,
    );

    await createDoner(
      connection,
      provider,
      publicKey,
      bountyPda,
      donation,
      donationMsg,
      signTransaction,
      sendTransaction,
    );

    // reset
    setBountyTitle("");
    setBountyUrl("");
    setBountyCommissionerStrs([]);
    setDonation(0);
    setDonationMsg("");
  };

  const onClickCreateWrapped = async () => {
    setIsLoading(true);
    await onClickCreate();
    setIsLoading(false);
  };

  //////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <ToastContainer />
      <div className="font-sans bg-gray-100 px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:max-w-6xl max-w-2xl mx-auto">
          <div className="text-left">
            <h2 className="text-gray-800 text-3xl font-bold mb-6">
              Create your first Dounty to accelerate your project
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Attract developers to your project by creating a Dounty. A Dounty
              is a reward that you can offer to developers for completing a task
              or fixing a bug in your project.
            </p>
            <p className="mb-4 text-sm text-gray-500">
              Fee is required to create a Dounty. The fee is used to pay the
              Solana network for processing your Dounty.
            </p>
            <p className="mb-4 text-sm text-gray-500">
              To create a Dounty, you need to provide the following information:
            </p>
          </div>
          <div>
            <Image
              src="https://readymadeui.com/management-img.webp"
              alt="Placeholder Image"
              className="rounded-lg object-contain w-full h-full"
              width={0}
              height={0}
            />
          </div>
        </div>
      </div>

      <form className="space-y-6 mt-10 max-w-xl mx-auto font-[sans-serif]">
        <div className="flex items-center">
          <label className="text-gray-400 w-36 text-sm">Project title</label>
          <input
            type="text"
            placeholder="Enter less than 50 characters"
            className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white"
            value={bountyTitle}
            onChange={(e) => setBountyTitle(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <label className="text-gray-400 w-36 text-sm">URL</label>
          <input
            type="url"
            placeholder="Enter less than 250 characters"
            className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white"
            value={bountyUrl}
            onChange={(e) => setBountyUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <label className="text-gray-400 w-36 text-sm">Commissioners</label>
          <a
            href="javascript:void(0)"
            onClick={() =>
              !isLoading &&
              bountyCommissionerStrs.length < 5 &&
              setBountyCommissionerStrs([...(bountyCommissionerStrs || []), ""])
            }
          >
            Add +
          </a>
        </div>
        {bountyCommissionerStrs?.map((commissionerStr, index) => (
          <div className="flex items-center" key={index}>
            <input
              className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white"
              placeholder={`Commissioner ${index + 1} address`}
              value={commissionerStr}
              onChange={(e) => {
                const newCommissioners = [...bountyCommissionerStrs];
                newCommissioners[index] = e.target.value;
                setBountyCommissionerStrs(newCommissioners);
              }}
            />
            <a
              href="javascript:void(0)"
              onClick={() => {
                if (isLoading) return;
                setBountyCommissionerStrs(
                  bountyCommissionerStrs
                    ?.slice(0, index)
                    .concat(bountyCommissionerStrs?.slice(index + 1)),
                );
              }}
            >
              Remove
            </a>
          </div>
        ))}

        <div className="flex items-center">
          <label className="text-gray-400 w-36 text-sm">Initial donation</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white"
            value={donation}
            onChange={(e) =>
              Number(e.target.value) >= 0 && setDonation(Number(e.target.value))
            }
          />
        </div>

        <div className="flex items-center">
          <label className="text-gray-400 w-36 text-sm">Donation message</label>
          <input
            type="text"
            placeholder="Leave message less than 250 characters when donating"
            className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white"
            value={donationMsg}
            onChange={(e) => setDonationMsg(e.target.value)}
          />
        </div>

        <Button
          className="!mt-8 px-6 py-2 w-full bg-[#333] hover:bg-[#444] text-sm text-white mx-auto block text-center"
          onPress={() =>
            bountyTitle.length &&
            bountyUrl.length &&
            !isLoading &&
            onClickCreateWrapped()
          }
          disabled={!bountyTitle || !bountyUrl || isLoading}
        >
          {isLoading ? <DefaultSpinner /> : "Create"}
        </Button>
        <Button
          as={Link}
          href="/dapp"
          className="!mt-4 px-6 py-2 w-full bg-[#333] hover:bg-[#444] text-sm text-white mx-auto block text-center"
        >
          To bounty board
        </Button>
      </form>
    </>
  );
}

////////////////////////////////////////////////////////////////////////////////

async function createBounty(
  connection: Connection,
  provider: anchor.AnchorProvider,
  publicKey: PublicKey,
  bountyTitle: string,
  bountyUrl: string,
  commissioners: PublicKey[],
  signTransaction: (
    transaction: VersionedTransaction,
  ) => Promise<VersionedTransaction>,
  sendTransaction: (
    transaction: VersionedTransaction,
    connection: Connection,
    options?: SendTransactionOptions,
  ) => Promise<anchor.web3.TransactionSignature>,
): Promise<PublicKey | null> {
  toast.info("Creating bounty");

  if (commissioners.length > 0 && commissioners.length % 2 === 0) {
    toast.error("Commissioners must be odd number");
    return null;
  }

  const program = getBountyFactoryProgram(provider);

  // Resolve
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bountyPda, _bountyPdaBump] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("bounty"),
      publicKey.toBuffer(),
      toHashedSeed(bountyUrl),
    ],
    BOUNTY_FACTORY_PROGRAM_ID,
  );
  const createV1Acc = {
    owner: publicKey,
    bounty: bountyPda,
    systemProgram: SystemProgram.programId,
  };

  const latestBlockhashRes = await safe(connection.getLatestBlockhash());
  if (!latestBlockhashRes.success) {
    toast.error("Can't get latest blockhash: " + latestBlockhashRes.error);
    return null;
  }
  const latestBlockhash = latestBlockhashRes.data;
  const ixRes = await safe(
    program.methods
      .createV1(bountyTitle, bountyUrl, commissioners, null)
      .accountsPartial(createV1Acc)
      .instruction(),
  );
  if (!ixRes.success) {
    toast.error("Can't create bounty instruction: " + ixRes.error);
    return null;
  }
  const ix = ixRes.data;

  // https://solana.com/docs/core/transactions
  const message = new TransactionMessage({
    payerKey: publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [ix],
  }).compileToV0Message();
  const transaction = new VersionedTransaction(message);
  const signedTxRes = await safe(signTransaction(transaction));
  if (!signedTxRes.success) {
    toast.error("Can't sign transaction: " + signedTxRes.error);
    return null;
  }
  const signedTx = signedTxRes.data;

  const signature = await sendTransaction(signedTx, connection);
  const res = await safe(
    connection.confirmTransaction(
      { signature, ...latestBlockhash },
      "confirmed",
    ),
  );
  if (!res.success) {
    toast.error("Can't confirm transaction: " + res.error);
    return null;
  }

  toast.success("Create bounty succeeded");
  return bountyPda;
}

////////////////////////////////////////////////////////////////////////////////

const createNonceAccount = async (
  connection: Connection,
  provider: anchor.AnchorProvider,
  bountyPda: PublicKey,
  userPubkey: PublicKey,
  signTransaction: (
    transaction: VersionedTransaction,
  ) => Promise<VersionedTransaction>,
  sendTransaction: (
    transaction: VersionedTransaction,
    connection: Connection,
    options?: SendTransactionOptions,
  ) => Promise<anchor.web3.TransactionSignature>,
) => {
  toast.info("Creating nonce account");

  const nonceAccountRes = await safe(
    userClient.getBountyNonceAccountPublicKey(bountyPda.toBase58()),
  );
  if (nonceAccountRes.success) {
    if (nonceAccountRes.data.txPublickey === bountyPda.toBase58()) {
      toast.info("Nonce account already exists");
      return;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const program = getBountyFactoryProgram(provider);
  // const bounty = await getBounty(program, bountyPda);
  // if (!bounty) {
  //   toast.error("Failed to get the bounty");
  //   return;
  // }
  // if (bounty.owner !== userPubkey.toBase58()) {
  //   toast.error("Only the owner can create a nonce account");
  //   return;
  // }

  // Resolve
  const nonceAccountKp = Keypair.generate();
  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: userPubkey,
    newAccountPubkey: nonceAccountKp.publicKey,
    lamports:
      await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH),
    space: NONCE_ACCOUNT_LENGTH,
    programId: SystemProgram.programId,
  });
  const inializeNonceIx = SystemProgram.nonceInitialize({
    noncePubkey: nonceAccountKp.publicKey,
    authorizedPubkey: userPubkey,
  });
  const latestBlockhashRes = await safe(connection.getLatestBlockhash());
  if (!latestBlockhashRes.success) {
    toast.error("Can't get latest blockhash: " + latestBlockhashRes.error);
    return;
  }
  const latestBlockhash = latestBlockhashRes.data;
  const message = new TransactionMessage({
    payerKey: userPubkey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [createAccountIx, inializeNonceIx],
  }).compileToV0Message();
  const tx = new VersionedTransaction(message);
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
      secretKey: bs58.encode(nonceAccountKp.secretKey),
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
