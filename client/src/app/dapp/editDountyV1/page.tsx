"use client";
import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { safe } from "@/utils/exception";
import { Button } from "@nextui-org/react";

import { BountyV1 } from "@/components/anchor/dtos/bountyV1";
import { SendTransactionOptions } from "@solana/wallet-adapter-base";
import Link from "next/link";
import { DefaultSpinner } from "@/components/ui/defaultSpinner";
import { useSearchParams } from "next/navigation";
import NotFoundPage from "@/components/ui/notFound";
import { getBounty } from "@/app/dapp/utils/getBountyV1";

////////////////////////////////////////////////////////////////////////////////
// https://readymadeui.com/tailwind-components/form
// https://readymadeui.com/tailwind-blocks/content-section

export default function EditPage() {
  const searchParams = useSearchParams();
  const bountyPda = searchParams.get("bountyPda");

  //////////////////////////////////////////////////////////////////////////////

  const { connection } = useConnection();
  const provider = useAnchorProvider();

  const [bountyTitle, setBountyTitle] = useState("");
  const [assigneeStr, setAssigneeStr] = useState("");
  const assignee = useMemo(
    () =>
      safe(() => new PublicKey(assigneeStr)).success
        ? new PublicKey(assigneeStr)
        : null,
    [assigneeStr],
  );
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
  const [bounty, setBounty] = useState<BountyV1 | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { publicKey, signTransaction, sendTransaction } = useWallet();

  //////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!bountyPda) return;

    const action = async () => {
      const bounty = await getBounty(provider, new PublicKey(bountyPda));
      if (!bounty) return;

      setBountyTitle(bounty.title);
      setAssigneeStr(bounty.assignee ?? "");
      setBountyCommissionerStrs(bounty.commissioners);

      setBounty(bounty);
    };

    action();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //////////////////////////////////////////////////////////////////////////////

  if (!publicKey || !signTransaction) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to edit a bounty"
      />
    );
  }

  if (!bountyPda) {
    return <NotFoundPage />;
  }

  //////////////////////////////////////////////////////////////////////////////

  const onClickEdit = async () => {
    if (!bounty) {
      toast.error("Bounty not found");
      return;
    }

    await editBounty(
      connection,
      provider,
      publicKey,
      bounty,
      bountyTitle,
      commissioners,
      assignee,
      signTransaction,
      sendTransaction,
    );
  };

  const onClickEditWrapped = async () => {
    setIsLoading(true);
    await onClickEdit();
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
              Edit Dounty
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Attract developers to take on your project with more appealing
              title. Or, change the assignee or commissioners. Make the project
              more viable in the eyes of developers.
            </p>
            <p className="mb-4 text-sm text-gray-500">
              Fee is required to edit the Dounty. You can edit any field of the
              Dounty.
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
          <label className="text-gray-400 w-36 text-sm">Assignee</label>
          <input
            type="text"
            placeholder="Enter the assignee address"
            className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white"
            value={assigneeStr}
            onChange={(e) => setAssigneeStr(e.target.value)}
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

        <Button
          className="!mt-8 px-6 py-2 w-full bg-[#333] hover:bg-[#444] text-sm text-white mx-auto block text-center"
          onPress={() => !isLoading && onClickEditWrapped()}
          disabled={isLoading}
        >
          {isLoading ? <DefaultSpinner /> : "Edit"}
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

async function editBounty(
  connection: Connection,
  provider: anchor.AnchorProvider,
  userPubkey: PublicKey,
  currBounty: BountyV1,
  title: string,
  commissioners: PublicKey[],
  assignee: PublicKey | null,
  signTransaction: (
    transaction: VersionedTransaction,
  ) => Promise<VersionedTransaction>,
  sendTransaction: (
    transaction: VersionedTransaction,
    connection: Connection,
    options?: SendTransactionOptions,
  ) => Promise<anchor.web3.TransactionSignature>,
): Promise<void> {
  // Resolve
  if (currBounty.owner !== userPubkey.toBase58()) {
    toast.error("Only the owner can change the commissioners");
    return;
  }

  if (commissioners.length > 0 && commissioners.length % 2 === 0) {
    toast.error("Commissioners must be odd");
    return;
  }

  const updateV1Acc = {
    owner: new PublicKey(currBounty.owner),
    bounty: new PublicKey(currBounty.address),
  };

  const program = getBountyFactoryProgram(provider);
  const ixRes = await safe(
    program.methods
      .updateV1(title, commissioners, assignee)
      .accounts(updateV1Acc)
      .instruction(),
  );
  if (!ixRes.success) {
    toast.error("Failed to create instruction: " + ixRes.error);
    return;
  }
  const updateIx = ixRes.data;
  const latestBlockhashRes = await safe(connection.getLatestBlockhash());
  if (!latestBlockhashRes.success) {
    toast.error("Failed to get latest blockhash: " + latestBlockhashRes.error);
    return;
  }
  const latestBlockhash = latestBlockhashRes.data;
  const message = new TransactionMessage({
    payerKey: userPubkey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [updateIx],
  }).compileToV0Message();
  const transaction = new VersionedTransaction(message);
  const signedTxRes = await safe(signTransaction(transaction));
  if (!signedTxRes.success) {
    toast.error("Failed to sign transaction: " + signedTxRes.error);
    return;
  }
  const signatureRes = await safe(sendTransaction(transaction, connection));
  if (!signatureRes.success) {
    toast.error("Failed to send transaction: " + signatureRes.error);
    return;
  }
  const signature = signatureRes.data;

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
}
