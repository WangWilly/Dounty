import * as zod from "zod";

import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { ColumnDef } from "@tanstack/react-table";

////////////////////////////////////////////////////////////////////////////////

export const bountyV1Schema = zod.object({
  address: zod.instanceof(PublicKey).transform((val) => val.toBase58()),
  owner: zod.instanceof(PublicKey).transform((val) => val.toBase58()),
  timestamp: zod
    .instanceof(anchor.BN)
    .transform((val) => new Date(val.toNumber() * 1000)),
  donation: zod.instanceof(anchor.BN).transform((val) => val.toNumber()),
  assignee: zod
    .instanceof(PublicKey)
    .transform((val) => val.toBase58())
    .nullable(),
  commissioners: zod
    .array(zod.instanceof(PublicKey))
    .transform((val) => val.map((v) => v.toBase58())),
  title: zod.string(),
  url: zod.string(),
});

export type BountyV1 = zod.infer<typeof bountyV1Schema>;

export const bountyV1Columns: ColumnDef<BountyV1>[] = [
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
  },
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
    accessorKey: "assignee",
    header: "Assignee",
  },
  {
    accessorKey: "commissioners",
    header: "Commissioners",
  },
];
