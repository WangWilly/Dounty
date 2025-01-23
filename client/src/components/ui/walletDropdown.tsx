import { MouseEventHandler, useCallback, useMemo, useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { SelectWalletModalOnNav, WalletImage } from "./selectWallet";

////////////////////////////////////////////////////////////////////////////////

export const MyWalletDropdown = () => {
  const { publicKey, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);

  const openModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  //////////////////////////////////////////////////////////////////////////////

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [base58]);

  //////////////////////////////////////////////////////////////////////////////

  const dropdown = useMemo(
    () => (
      <ul
        className="absolute shadow-lg bg-white space-y-3 lg:top-5 max-lg:top-8 -left-0 min-w-[250px] z-50 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-[700px] px-6 group-hover:pb-4 group-hover:pt-6 transition-all duration-500"
        aria-label="dropdown-list"
        role="menu"
      >
        <li className="border-b py-2" onClick={copyAddress} role="menuitem">
          <a
            href="javascript:void(0)"
            className="hover:text-blue-600 font-semibold block transition-all"
          >
            {copied ? "Copied" : "Copy address"}
          </a>
        </li>
        <li className="border-b py-2" onClick={openModal} role="menuitem">
          <a
            href="javascript:void(0)"
            className="hover:text-blue-600 font-semibold block transition-all"
          >
            Change wallet
          </a>
        </li>
        <li className="border-b py-2" onClick={disconnect} role="menuitem">
          <a
            href="javascript:void(0)"
            className="hover:text-blue-600 font-semibold block transition-all"
          >
            Disconnect
          </a>
        </li>
      </ul>
    ),
    [copied, copyAddress, disconnect, openModal],
  );

  //////////////////////////////////////////////////////////////////////////////

  const content = useMemo(() => {
    // if (children) return children;
    if (!wallet || !base58) return null;
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }, [wallet, base58]);

  //////////////////////////////////////////////////////////////////////////////

  if (!wallet) return <SelectWalletModalOnNav />;
  if (!base58) return <WalletConnectContentOnNav />;

  return (
    <li className="max-lg:border-b max-lg:py-2 px-3 group relative ">
      <a
        href="javascript:void(0)"
        className="hover:text-blue-600 block font-semibold transition-all content-center"
      >
        <WalletImage wallet={wallet} />
        {content}
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

      {dropdown}
    </li>
  );
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const WalletConnectContentOnNav = () => {
  const { wallet, connect, connecting, connected } = useWallet();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) connect().catch(() => {});
    },
    [connect],
  );

  const content = useMemo(() => {
    if (connecting) return "Connecting ...";
    if (connected) return "Connected";
    if (wallet) return "Connect";
    return "Connect Wallet";
  }, [connecting, connected, wallet]);

  //////////////////////////////////////////////////////////////////////////////

  return (
    <li className="max-lg:border-b max-lg:py-2 px-3 group relative ">
      {!wallet || connecting || connected ? (
        <Link
          href="javascript:void(0)"
          className="hover:text-blue-600 block font-semibold transition-all"
        >
          <WalletImage wallet={wallet} />
          {content}
        </Link>
      ) : (
        <Link
          href="javascript:void(0)"
          className="hover:text-blue-600 block font-semibold transition-all"
          onClick={handleClick}
        >
          <WalletImage wallet={wallet} />
          {content}
        </Link>
      )}
    </li>
  );
};
