"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import type { Selection } from "@nextui-org/react";
import { NextUIProvider, Button } from "@nextui-org/react";

import { config } from "./config";
import { NetworkType } from "./types";

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

export default function DappLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // https://github.com/nextui-org/nextui/issues/3626
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // dropdown
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([config.DEFAULT_NETWORK_TYPE]),
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
      case NetworkType.Custom:
        return config.CUSTOM_RPC_URL;
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

  return (
    <div className="w-full h-full">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <NextUIProvider>
              <header>
                <div
                  className="z-50 grid grid-cols-6 items-center gap-4 p-4 bg-violet-400 text-white w-full"
                  style={{ position: "fixed" }}
                >
                  <WalletMultiButton />
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="bg-default text-white px-4 py-2 rounded-md h-full text-lg font-semibold">
                        {networkChoose.toString()}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      className="bg-white text-black font-semibold"
                      selectedKeys={selectedKeys}
                      selectionMode="single"
                      variant="flat"
                      onSelectionChange={setSelectedKeys}
                    >
                      {/* <DropdownItem key="testnet">Testnet</DropdownItem> */}
                      {/* <DropdownItem key="mainnet-beta">Mainnet Beta</DropdownItem> */}
                      <DropdownItem key="devnet">Devnet</DropdownItem>
                      <DropdownItem key="local">Local</DropdownItem>
                      <DropdownItem key="custom">Custom</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </header>
              <div className="pt-24 px-4 w-full">{children}</div>
            </NextUIProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
      <Button
        as={Link}
        href="/"
        color="success"
        className="fixed bottom-4 right-4 text-lg size-lg"
      >
        🥾🏠
      </Button>
    </div>
  );
}
