"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";

import { DataTable } from "@/components/ui/defaultTable";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorProvider } from "@/components/solana_provider";
import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import { Bounty, columns } from "@/components/anchor/dtos/bountyV1";
import {
  Donner,
  columns as donnerColumns,
} from "@/components/anchor/dtos/donnerV1";
// import log from "@/utils/logging";

import { ToastContainer, toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  // Arrange
  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [donners, setDonners] = useState<Donner[]>([]);
  const changeOnClick = () => {
    //////////////////////////////////////////////////////////////////////////////
    // Resolve
    // https://stackoverflow.com/questions/77742713/how-to-use-async-await-inside-client-component-in-next-js
    // https://stackoverflow.com/questions/77457425/how-to-implement-useeffect-in-the-server-in-next-js-14
    const fetchBounties = async () => {
      try {
        const allBounties = await program.account.bountyV1.all([]);
        setBounties(
          allBounties.map(
            // TODO: transform the bounty to the correct format
            (bounty): Bounty => ({
              address: bounty.publicKey,
              owner: bounty.account.owner,
              donation: bounty.account.donation,
              asignee: bounty.account.asignee,
              commissioners: bounty.account.commissioners,
              title: bounty.account.title,
              url: bounty.account.url,
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
          allDonners.map(
            (donner): Donner => ({
              doner: donner.publicKey,
              bounty: donner.account.bounty,
              donation: donner.account.donation,
              message: donner.account.message,
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
  changeOnClick();

  //////////////////////////////////////////////////////////////////////////////
  // Compose
  return (
    <div className="text-white flex flex-col items-center justify-center min-h-screen">
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
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6 text-black">
          <DataTable columns={columns} data={bounties} />
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6 text-black">
          <DataTable
            columns={donnerColumns}
            data={donners}
            // className="border border-gray-600 p-4 rounded-lg text-center mb-6"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            color="default"
            className="text-black px-6 py-2 rounded-lg font-semibold"
          >
            Claim it!
          </Button>
          <Link href="/dapp/create">
            <Button
              color="default"
              className="text-black px-6 py-2 rounded-lg font-semibold"
            >
              Create a Bounty
            </Button>
          </Link>
          <Link href="/dapp/createDonner">
            <Button
              color="default"
              className="text-black px-6 py-2 rounded-lg font-semibold"
            >
              Donate to a Bounty
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
