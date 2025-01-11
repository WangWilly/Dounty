"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import type { Selection } from "@nextui-org/react";

import { isDev } from "@/utils/appConfig";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  UnsafeBurnerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

////////////////////////////////////////////////////////////////////////////////

// https://stackoverflow.com/questions/43100718/typescript-enum-to-object-array
enum NetworkType {
  Devnet = "devnet",
  Testnet = "testnet",
  MainnetBeta = "mainnet-beta",
  Local = "local",
}

export default function DappLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const defaultNetwork = isDev() ? NetworkType.Local : NetworkType.Devnet;
  // https://github.com/nextui-org/nextui/issues/3626
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // dropdown
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([defaultNetwork]),
  );
  const networkChoose = React.useMemo(
    () => Array.from(selectedKeys)[0] as NetworkType,
    [selectedKeys],
  );

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo((): string => {
    switch (networkChoose) {
      case NetworkType.Devnet:
        return clusterApiUrl(WalletAdapterNetwork.Devnet);
      case NetworkType.Testnet:
        return clusterApiUrl(WalletAdapterNetwork.Testnet);
      case NetworkType.MainnetBeta:
        return clusterApiUrl(WalletAdapterNetwork.Mainnet);
      case NetworkType.Local:
        return "http://localhost:8899/";
      default:
        return "";
    }
  }, [networkChoose]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [],
  );

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    // console.log(e.clientX, e.clientY);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div
              draggable
              onDrag={handleDrag}
              style={{
                position: "absolute",
                left: position.x,
                top: position.y,
              }}
            >
              <WalletMultiButton />
              <Dropdown>
                <DropdownTrigger>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    {networkChoose.toString()}
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  selectedKeys={selectedKeys}
                  selectionMode="single"
                  variant="flat"
                  onSelectionChange={setSelectedKeys}
                >
                  {/* <DropdownItem key="testnet">Testnet</DropdownItem> */}
                  {/* <DropdownItem key="mainnet-beta">Mainnet Beta</DropdownItem> */}
                  <DropdownItem key="devnet">Devnet</DropdownItem>
                  <DropdownItem key="local">Local</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
      {/* to home */}
      <Link
        href="/"
        className="fixed bottom-4 right-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Home
      </Link>
    </div>
  );
}
