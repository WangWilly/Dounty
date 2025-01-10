import { PublicKey } from "@solana/web3.js";
import { ColumnDef } from "@tanstack/react-table"

////////////////////////////////////////////////////////////////////////////////

export type Bounty = {
  owner: PublicKey;
  // timestamp: BN;
  donation: number;
  asignee: PublicKey | null;
  commissioners: PublicKey[];
  title: string;
  url: string;
};

export const columns: ColumnDef<Bounty>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "url",
    header: "URL",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "donation",
    header: "Donation",
  },
  {
    accessorKey: "asignee",
    header: "Asignee",
  },
  {
    accessorKey: "commissioners",
    header: "Commissioners",
  },
];
