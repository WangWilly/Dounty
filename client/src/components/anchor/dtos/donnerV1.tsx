import * as zod from "zod";

import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { ColumnDef } from "@tanstack/react-table";

////////////////////////////////////////////////////////////////////////////////

export const donnerV1Schema = zod.object({
  doner: zod.instanceof(PublicKey).transform((val) => val.toBase58()),
  timestamp: zod
    .instanceof(anchor.BN)
    .transform((val) => new Date(val.toNumber() * 1000)),
  bounty: zod.instanceof(PublicKey).transform((val) => val.toBase58()),
  donation: zod.instanceof(anchor.BN).transform((val) => val.toNumber() as number),
  message: zod.string(),
});

export type DonnerV1 = zod.infer<typeof donnerV1Schema>;

export const donnerV1Columns: ColumnDef<DonnerV1>[] = [
  {
    accessorKey: "doner",
    header: "Doner",
    cell: ({ row }) => {
      return row.original.doner.slice(0, 3) + "..." + row.original.doner.slice(-3);
    },
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      return row.original.timestamp.toLocaleString();
    },
  },
  {
    accessorKey: "bounty",
    header: "Bounty",
    cell: ({ row }) => {
      return row.original.bounty.slice(0, 3) + "..." + row.original.bounty.slice(-3);
    },
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
