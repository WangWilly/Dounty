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
      <div className="max-w-full flex justify-end space-x-4">
        <Button
          onPress={fetchDonners}
          className="bg-transparent rounded-lg font-semibold size-lg"
        >
          🔄
        </Button>
      </div>
      <div className="flex-initial border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6 text-black overflow-x-auto">
        {/* <p className="text-black">
              Contributors:{" "}
              <span className="text-blue-400">{donners.length}</span>
            </p> */}
        <DataTable columns={donnerV1Columns} data={donners} />
      </div>
    </>
  );
}
