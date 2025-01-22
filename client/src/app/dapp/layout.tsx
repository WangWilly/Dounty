"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import { appConfig } from "@/utils/appConfig";
import { MyWalletDropdown } from "@/components/ui/walletDropdown";

import "@solana/wallet-adapter-react-ui/styles.css";

////////////////////////////////////////////////////////////////////////////////

export default function DappLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapseMenuDisplay, setCollapseMenuDisplay] = useState("none");

  const onPressToggle = () => {
    if (collapseMenuDisplay === "block") {
      setCollapseMenuDisplay("none");
    } else {
      setCollapseMenuDisplay("block");
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  // https://github.com/nextui-org/nextui/issues/3626
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // dropdown
  const [selectedKey, setSelectedKey] = React.useState<NetworkType>(
    config.DEFAULT_NETWORK_TYPE,
  );

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo((): string => {
    switch (selectedKey) {
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
  }, [selectedKey]);

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
      new CoinbaseWalletAdapter(),
    ],
    [],
  );

  //////////////////////////////////////////////////////////////////////////////

  return (
    <div className="w-full h-full">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <NextUIProvider>
              <header className="shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] sticky top-0 py-1 px-4 sm:px-10 bg-white z-50 min-h-[70px] content-center">
                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/">
                    <Image
                      className="w-10"
                      src={
                        appConfig.ASSET_BASE_PATH + "/icon/apple-touch-icon.png"
                      }
                      alt="Dounty Logo"
                      width={0}
                      height={0}
                      priority={false}
                    />
                  </Link>

                  <div
                    id="collapseMenu"
                    className="max-lg:hidden lg:!block max-lg:fixed max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50 h-full z-50"
                    style={{ display: collapseMenuDisplay }}
                  >
                    <button
                      id="toggleClose"
                      className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
                      onClick={onPressToggle}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 fill-black"
                        viewBox="0 0 320.591 320.591"
                      >
                        <path
                          d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                          data-original="#000000"
                        ></path>
                      </svg>
                    </button>

                    <ul className="lg:ml-12 lg:flex gap-x-6 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                      <li className="mb-6 hidden max-lg:block">
                        <Link href="/">
                          <Image
                            className="w-10"
                            src={
                              appConfig.ASSET_BASE_PATH +
                              "/icon/apple-touch-icon.png"
                            }
                            alt="Dounty Logo"
                            width={0}
                            height={0}
                            priority={false}
                          />
                        </Link>
                      </li>

                      <MyWalletDropdown />

                      <li className="max-lg:border-b max-lg:py-2 px-3 group relative ">
                        <a
                          href="javascript:void(0)"
                          className="hover:text-blue-600 block font-semibold transition-all content-center"
                        >
                          Network: {selectedKey}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 fill-current inline ml-1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                              clipRule="evenodd"
                              data-original="#000000"
                            />
                          </svg>
                        </a>

                        <ul className="absolute shadow-lg bg-white space-y-3 lg:top-5 max-lg:top-8 -left-0 min-w-[250px] z-50 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[700px] px-6 group-hover:pb-4 group-hover:pt-6 transition-all duration-500">
                          <li className="border-b py-2 ">
                            <a
                              href="javascript:void(0)"
                              className="hover:text-blue-600 font-semibold block transition-all"
                              onClick={() => setSelectedKey(NetworkType.Devnet)}
                            >
                              Devnet
                            </a>
                          </li>
                          <li className="border-b py-2 ">
                            <a
                              href="javascript:void(0)"
                              className="hover:text-blue-600 font-semibold block transition-all"
                              onClick={() => setSelectedKey(NetworkType.Local)}
                            >
                              Local
                            </a>
                          </li>
                          <li className="border-b py-2 ">
                            <a
                              href="javascript:void(0)"
                              className="hover:text-blue-600 font-semibold block transition-all"
                              onClick={() => setSelectedKey(NetworkType.Custom)}
                            >
                              Custom
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div className="flex ml-auto">
                    {/* TODO: */}
                    {/* <button className="mr-6 font-semibold border-none outline-none">
                      <a
                        href="javascript:void(0)"
                        className="text-red-600 hover:underline"
                      >
                        Login
                      </a>
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 transition-all text-white rounded-full px-5 py-2.5">
                      Sign up
                    </button> */}
                    <button
                      id="toggleOpen"
                      className="lg:hidden ml-7"
                      onClick={onPressToggle}
                    >
                      <svg
                        className="w-7 h-7"
                        fill="#000"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </header>
              <div className="pt-5 pb-4 px-2 w-full">{children}</div>
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
