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
  donation: zod.instanceof(anchor.BN).transform((val) => val.toNumber()),
  message: zod.string(),
});

export type DonnerV1 = zod.infer<typeof donnerV1Schema>;

export const donnerV1Columns: ColumnDef<DonnerV1>[] = [
  {
    accessorKey: "doner",
    header: "Doner",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
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
