"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";

import { DataTable } from "@/components/ui/defaultTable";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorProvider } from "@/components/solana_provider";
import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import {
  bountyV1Schema,
  BountyV1,
  bountyV1Columns,
} from "@/components/anchor/dtos/bountyV1";
import {
  donnerV1Schema,
  DonnerV1,
  donnerV1Columns,
} from "@/components/anchor/dtos/donnerV1";
// import log from "@/utils/logging";

import { ToastContainer, toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  // Arrange
  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bounties, setBounties] = useState<BountyV1[]>([]);
  const [donners, setDonners] = useState<DonnerV1[]>([]);
  const changeOnClick = () => {
    //////////////////////////////////////////////////////////////////////////////
    // Resolve
    // https://stackoverflow.com/questions/77742713/how-to-use-async-await-inside-client-component-in-next-js
    // https://stackoverflow.com/questions/77457425/how-to-implement-useeffect-in-the-server-in-next-js-14
    const fetchBounties = async () => {
      try {
        const allBounties = await program.account.bountyV1.all([]);
        setBounties(
          allBounties.map((bounty) =>
            bountyV1Schema.parse({
              address: bounty.publicKey,
              ...bounty.account,
            }),
          ),
        );
      } catch (error) {
        toast.error("Error fetching bounty: " + error);
      }
    };

    const fetchDonners = async () => {
      try {
        const allDonners = await program.account.donerV1.all([]);
        setDonners(
          allDonners.map((donner) =>
            donnerV1Schema.parse({
              address: donner.publicKey,
              ...donner.account,
            }),
          ),
        );
      } catch (error) {
        toast.error("Error fetching donners: " + error);
      }
    };

    fetchBounties();
    fetchDonners();
  };

  const [bountySol, setBountySol] = useState(0);
  useEffect(() => {
    const totalSol =
      bounties.reduce((acc, bounty) => acc + Number(bounty.donation), 0) /
      LAMPORTS_PER_SOL;
    setBountySol(totalSol);
  }, [bounties]);

  //////////////////////////////////////////////////////////////////////////////
  // Initial load
  useEffect(() => {
    changeOnClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty dependency array ensures this runs only once on mount

  //////////////////////////////////////////////////////////////////////////////
  // Compose
  return (
    <div className="text-white flex-col items-center justify-center w-screen overflow-x-auto">
      <ToastContainer />
      <div className="p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <p className="text-black">
            All the bounties are listed here. Claim them, donate to them, or get
            more info about them.
          </p>
          <p className="mt-4 text-black">
            Current Bounty:{" "}
            <span className="text-orange-400 font-semibold">
              {bountySol} SOL
            </span>
          </p>
          <p className="text-black">
            Contributors:{" "}
            <span className="text-blue-400">{donners.length}</span>
          </p>
        </div>
        <div className="grid grid-cols-10 gap-4 p-1">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <Button
            onPress={changeOnClick}
            className="bg-transparent rounded-lg font-semibold size-lg"
          >
            🔄
          </Button>
        </div>
        <div className="flex-initial border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6 text-black overflow-x-auto">
          <DataTable columns={bountyV1Columns} data={bounties} />
        </div>
        <div className="flex-initial border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6 text-black overflow-x-auto">
          <DataTable
            columns={donnerV1Columns}
            data={donners}
            // className="border border-gray-600 p-4 rounded-lg text-center mb-6"
          />
        </div>
        <div className="rounded-lg shadow-lg border border-dotted border-gray-800 flex space-x-4 px-4 py-8 overflow-x-scroll">
          <Button
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Claim it!
          </Button>
          <Button
            as={Link}
            href="/dapp/create"
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Create a Bounty
          </Button>
          <Button
            as={Link}
            href="/dapp/createDonner"
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Donate to a Bounty
          </Button>
          <Button
            as={Link}
            href="/dapp/changeAssignee"
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Change Assignee
          </Button>
          <Button
            as={Link}
            href="/dapp/changeTitle"
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Change Title
          </Button>
          <Button
            as={Link}
            href="/dapp/changeCommissioners"
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Change Commissioners
          </Button>
          <Button
            as={Link}
            href="/dapp/durableNonce"
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Durable Nonce
          </Button>
          <Button
            as={Link}
            href="/dapp/appendSignature"
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Append Signature
          </Button>
          <Button
            as={Link}
            href="/dapp/issue"
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Issue
          </Button>
        </div>
      </div>
    </div>
  );
}
