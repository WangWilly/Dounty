"use client";

import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import {
  DonnerV1,
  donnerV1Columns,
  donnerV1Schema,
} from "@/components/anchor/dtos/donnerV1";
import { useAnchorProvider } from "@/components/solana_provider";
import { DataTable } from "@/components/ui/defaultTable";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [donners, setDonners] = useState<DonnerV1[]>([]);

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

  //////////////////////////////////////////////////////////////////////////////
  // Initial load
  useEffect(() => {
    fetchDonners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty dependency array ensures this runs only once on mount

  //////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="flex items-center max-md:flex-col gap-6 bg-gradient-to-tr from-blue-700 to-purple-400 text-white px-6 py-3.5 rounded font-[sans-serif]">
        <p className="text-base flex-1 max-md:text-center">
          Show your vision about the future of the world by donating to the most
          revolutionary projects. 🍭
        </p>
        <p className="mt-2 max-md:mt-0 font-semibold">
          Current doners: {donners.length}
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
      <div className="flex-initial border border-dotted border-gray-600 px-1 rounded-lg text-center mb-6 text-black overflow-x-auto">
        <div className="relative top-50 right-4 z-30">
          <Button
            onPress={fetchDonners}
            className="bg-transparent rounded-lg font-semibold size-lg"
          >
            🔄
          </Button>
        </div>
        <DataTable columns={donnerV1Columns} data={donners} />
      </div>
    </>
  );
}
