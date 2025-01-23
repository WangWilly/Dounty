"use client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";

import { DataTable } from "@/components/ui/defaultTable";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorProvider } from "@/components/solana_provider";
import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import {
  bountyV1Schema,
  BountyV1,
  getBountyV1Columns,
} from "@/components/anchor/dtos/bountyV1";

import { ToastContainer, toast } from "react-toastify";
import NoWallet from "@/components/dapp/noWallet";
import { useWallet } from "@solana/wallet-adapter-react";
import AppendSignatureModel from "./models/appendSignatureV1";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  // Arrange
  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [bounties, setBounties] = useState<BountyV1[]>([]);
  const [signBountyPda, setSignBountyPda] = useState<string | null>(null);

  const { publicKey } = useWallet();

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

    fetchBounties();
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

  if (!publicKey) {
    return (
      <NoWallet
        title="No wallet found"
        content="Please connect to a wallet to view the bounties"
      />
    );
  }

  return (
    <div className="text-white flex-col items-center justify-center w-screen overflow-x-auto">
      <ToastContainer />
      {signBountyPda !== null && signBountyPda !== "" && (
        <AppendSignatureModel
          bountyPda={signBountyPda}
          setSignBountyPda={setSignBountyPda}
        />
      )}
      <div>
        <div className="flex items-center max-md:flex-col gap-6 bg-gradient-to-tr from-blue-700 to-purple-400 text-white px-6 py-3.5 rounded font-[sans-serif]">
          <p className="text-base flex-1 max-md:text-center">
            Right now, there are {bounties.length} bounties available.
            Don&apos;t miss out! 🚀
          </p>
          <p className="mt-2 max-md:mt-0 font-semibold">
            Current Bounty:{" " + bountySol} SOL
          </p>

          <div>
            {/* <button
              type="button"
              className="bg-white text-blue-500 py-2.5 px-5 rounded text-sm"
            >
              Get Offer
            </button> */}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 cursor-pointer fill-white inline-block ml-4"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              />
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              />
            </svg> */}
          </div>
        </div>

        <div className="max-w-full flex justify-end space-x-4">
          <Button
            onPress={changeOnClick}
            className="bg-transparent rounded-lg font-semibold size-lg"
          >
            🔄
          </Button>
        </div>
        <div className="flex-initial border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6 text-black overflow-x-auto">
          <DataTable
            columns={getBountyV1Columns(publicKey.toBase58(), setSignBountyPda)}
            data={bounties}
          />
        </div>
      </div>
    </div>
  );
}
