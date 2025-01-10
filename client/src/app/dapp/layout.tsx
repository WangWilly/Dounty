"use client";
import React, { useMemo, useState } from "react";

import { isDev } from "@/app/appConfig";

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
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Testnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => isDev() ? "http://localhost:8899/" : clusterApiUrl(network), [network]);

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
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div
            draggable
            onDrag={handleDrag}
            style={{ position: "absolute", left: position.x, top: position.y }}
          >
            <WalletMultiButton />
          </div>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
