// Code: Dounty (c) 2025
// License: MIT
"use client";
import Image from "next/image";
import Link from "next/link";
import { NextUIProvider, Button } from "@nextui-org/react";

////////////////////////////////////////////////////////////////////////////////

export default function Home() {
  return (
    <NextUIProvider className="grid grid-rows-[20px_1fr_80px] items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">Dounty</h1>
      <Image
        src="./icon/apple-touch-icon.png"
        alt="Dounty Logo"
        width={320}
        height={320}
        priority={false}
      />
      <Button color="default" as={Link} href="/dapp" className="w-full h-full">
        Go to Dapp
      </Button>
    </NextUIProvider>
  );
}
