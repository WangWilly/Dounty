import { PublicKey } from "@solana/web3.js";
import { ColumnDef } from "@tanstack/react-table";

////////////////////////////////////////////////////////////////////////////////

export type Donner = {
  doner: PublicKey;
  // timestamp: BN;
  bounty: PublicKey;
  donation: number;
  message: string;
};

export const columns: ColumnDef<Donner>[] = [
  {
    accessorKey: "doner",
    header: "Doner",
  },
  {
    accessorKey: "bounty",
    header: "Bounty",
  },
  {
    accessorKey: "donation",
    header: "Donation",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
];
