"use client";
import NoWallet from "@/components/dapp/noWallet";
import { useAnchorProvider } from "@/components/solana_provider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@nextui-org/react";

import { BountyV1 } from "@/components/anchor/dtos/bountyV1";
import Link from "next/link";
import { DefaultSpinner } from "@/components/ui/defaultSpinner";
import { useSearchParams } from "next/navigation";
import NotFoundPage from "@/components/ui/notFound";
import { createDoner } from "@/app/dapp/utils/createDonerV1Func";
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
  const [bountyCommissionerStrs, setBountyCommissionerStrs] = useState<
    string[]
  >([]);

  const [bounty, setBounty] = useState<BountyV1 | null>(null);
  const [donation, setDonation] = useState(0);
  const [donationMsg, setDonationMsg] = useState("");

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

    await createDoner(
      connection,
      provider,
      publicKey,
      bounty ? new PublicKey(bounty.address) : null,
      donation,
      donationMsg,
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
              Donate to your favorite project to support development
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Attract developers to take on your project by donating to the
              Dounty
            </p>
            <p className="mb-4 text-sm text-gray-500">
              Fee is required to donate to the Dounty. You can donate any
              amount. After the project is completed, a soul-bounded NFT will be
              sent to you.
            </p>
            <p className="mb-4 text-sm text-gray-500">
              Leaving a message is optional. The message will be displayed on
              the Dounty board.
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
          <label className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white">
            {bountyTitle}
          </label>
        </div>

        <div className="flex items-center">
          <label className="text-gray-400 w-36 text-sm">Assignee</label>
          <label className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white">
            {assigneeStr}
          </label>
        </div>

        <div className="flex items-center">
          <label className="text-gray-400 w-36 text-sm">Commissioners</label>
        </div>
        {bountyCommissionerStrs?.map((commissionerStr, index) => (
          <div className="flex items-center" key={index}>
            <label className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white">
              {commissionerStr}
            </label>
          </div>
        ))}

        <div className="flex items-center">
          <label className="text-gray-400 w-36 text-sm">Donation amount</label>
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
          onPress={() => !isLoading && onClickEditWrapped()}
          disabled={isLoading}
        >
          {isLoading ? <DefaultSpinner /> : "Donate"}
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
