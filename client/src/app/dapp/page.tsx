"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";

import { DataTable } from "@/components/ui/defaultTable";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorProvider } from "@/components/solana_provider";
import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import { Bounty, columns } from "@/components/anchor/dtos/bountyV1";
import { Donner, columns as donnerColumns } from "@/components/anchor/dtos/donnerV1";
import log from "@/utils/logging";

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
      const allBounties = await program.account.bountyV1.all([]);
      log(allBounties);
      setBounties(
        allBounties.map(
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
    };

    const fetchDonners = async () => {
      const allDonners = await program.account.donerV1.all([]);
      log(allDonners);
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
    }

    fetchBounties();
    fetchDonners();
  };

  const [bountySol, setBountySol] = useState(0);
  useEffect(() => {
    const totalSol = bounties.reduce((acc, bounty) => acc + bounty.donation, 0) / LAMPORTS_PER_SOL;
    setBountySol(totalSol);
  }, [bounties]);

  //////////////////////////////////////////////////////////////////////////////
  // Initial load
  changeOnClick(); 

  //////////////////////////////////////////////////////////////////////////////
  // Compose
  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">
            Bounty! Bounty! Bounty!
          </h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">
            All the bounties are listed here. Claim them, donate to them, or get
            more info about them.
          </p>
          <div className="mt-4">
            <Image
              src="https://placehold.co/400x200/orange/white?text=Bounty+Image&font=roboto"
              alt="Bounty Image"
              width={400}
              height={200}
              className="mx-auto rounded-lg"
            />
          </div>
          <p className="mt-4 text-gray-300">
            Current Bounty:{" "}
            <span className="text-orange-400 font-semibold">
              {bountySol} SOL
            </span>
          </p>
          <p className="text-gray-300">
            Contributors: <span className="text-blue-400">
              {donners.length}
            </span>
          </p>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <Button
            onPress={changeOnClick}
            className="bg-gray-100 hover:bg-gray-300 text-black px-6 py-2 rounded-lg font-semibold"
          >
            Refresh
          </Button>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <DataTable
            columns={columns}
            data={bounties}
            // className="border border-gray-600 p-4 rounded-lg text-center mb-6"
          />
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <DataTable
            columns={donnerColumns}
            data={donners}
            // className="border border-gray-600 p-4 rounded-lg text-center mb-6"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button className="bg-gray-100 hover:bg-gray-300 text-black px-6 py-2 rounded-lg font-semibold">
            Claim it!
          </button>
          <Link href="/dapp/create">
            <div className="bg-gray-100 hover:bg-gray-300 text-black px-6 py-2 rounded-lg font-semibold">
              Create a Bounty
            </div>
          </Link>
          <Link href="/dapp/createDonner">
            <div className="bg-gray-100 hover:bg-gray-300 text-black px-6 py-2 rounded-lg font-semibold">
              Donate to a Bounty
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
