import * as zod from "zod";

import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

////////////////////////////////////////////////////////////////////////////////

export const bountyV1Schema = zod.object({
  address: zod.instanceof(PublicKey).transform((val) => val.toBase58()),
  owner: zod.instanceof(PublicKey).transform((val) => val.toBase58()),
  timestamp: zod
    .instanceof(anchor.BN)
    .transform((val) => new Date(val.toNumber() * 1000)),
  donation: zod
    .instanceof(anchor.BN)
    .transform((val): number => val.toNumber()),
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
    cell: ({ row }) => {
      return row.original.timestamp.toLocaleString();
    },
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
    cell: ({ row }) => {
      return (
        row.original.owner.slice(0, 3) + "..." + row.original.owner.slice(-3)
      );
    },
  },
  {
    accessorKey: "donation",
    header: "Donation",
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => {
      return row.original.assignee
        ? row.original.assignee.slice(0, 3) +
            "..." +
            row.original.assignee.slice(-3)
        : "";
    },
  },
  {
    accessorKey: "commissioners",
    header: "Commissioners",
    cell: ({ row }) => {
      return row.original.commissioners
        .map((c) => c.slice(0, 3) + "..." + c.slice(-3))
        .join(", ");
    },
  },
];

////////////////////////////////////////////////////////////////////////////////

export const getBountyV1Columns = (
  userPubkey: string,
  setSignBountyPda: Dispatch<SetStateAction<string | null>>,
) => {
  const bountyV1Columns: ColumnDef<BountyV1>[] = [
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        return (
          row.original.address.slice(0, 3) +
          "..." +
          row.original.address.slice(-3)
        );
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
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "url",
      header: "URL",
    },
    {
      accessorKey: "edit",
      header: "Edit",
      cell: ({ row }) => {
        if (row.original.owner !== userPubkey) {
          return "";
        }
        return (
          <Link
            href={{
              pathname: `/dapp/editDountyV1`,
              query: { bountyPda: row.original.address },
            }}
            className="text-blue-500"
          >
            ✏️
          </Link>
        );
      },
    },
    {
      accessorKey: "donate",
      header: "Donate",
      cell: ({ row }) => {
        return (
          <Link
            href={{
              pathname: `/dapp/createDonerV1`,
              query: { bountyPda: row.original.address },
            }}
            className="text-blue-500"
          >
            💰
          </Link>
        );
      },
    },
    {
      accessorKey: "donation",
      header: "Donation",
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ row }) => {
        return row.original.assignee
          ? row.original.assignee.slice(0, 3) +
              "..." +
              row.original.assignee.slice(-3)
          : "";
      },
    },
    {
      accessorKey: "commissioners",
      header: "Commissioners",
      cell: ({ row }) => {
        return row.original.commissioners
          .map((c) => c.slice(0, 3) + "..." + c.slice(-3))
          .join(", ");
      },
    },
    {
      accessorKey: "sign",
      header: "Sign",
      cell: ({ row }) => {
        if (!row.original.commissioners.includes(userPubkey)) {
          return "";
        }
        return (
          <Link
            href="javascript:void(0)"
            className="text-blue-500"
            onClick={() => {
              setSignBountyPda(row.original.address);
            }}
          >
            📝
          </Link>
        );
      },
    },
  ];

  return bountyV1Columns;
};
