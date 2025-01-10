// Code: Dounty (c) 2025
// License: MIT
import Image from "next/image";
import Link from "next/link";

////////////////////////////////////////////////////////////////////////////////

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Image
        src="./icon/favicon-32x32.png"
        alt="Dounty Logo"
        width={32}
        height={32}
        className="rounded-full"
      />
      <h1 className="text-4xl font-bold text-center">Dounty</h1>

      {/* go to dapp */}
      <Link
        href="/dapp"
        className="inline-block px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Go to Dapp
      </Link>
    </div>
  );
}
