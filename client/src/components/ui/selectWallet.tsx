import Image from "next/image";
import { useCallback, useMemo } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@nextui-org/react";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";

////////////////////////////////////////////////////////////////////////////////

export const SelectWalletModalOnNav = () => {
  const { visible, setVisible } = useWalletModal();

  const handleClick = useCallback(
    () => setVisible(!visible),
    [setVisible, visible],
  );

  return (
    <li className="max-lg:border-b max-lg:py-2 px-3 group relative ">
      <a
        href="javascript:void(0)"
        className="hover:text-blue-600 block font-semibold transition-all"
        onClick={handleClick}
      >
        Select Wallet
      </a>
    </li>
  );
};

////////////////////////////////////////////////////////////////////////////////

export const SelectWalletButton = () => {
  const { visible, setVisible } = useWalletModal();

  const handleClick = useCallback(
    () => setVisible(!visible),
    [setVisible, visible],
  );

  return (
    <Button
      className="inline-block mt-8 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base tracking-wide rounded-md"
      onPress={handleClick}
    >
      Select Wallet
    </Button>
  );
};

export const WalletConnectContentButton = () => {
  const { wallet, connect, connecting, connected } = useWallet();

  const handleClick = useCallback(() => connect().catch(() => {}),
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
    <Button
      className="inline-block mt-8 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base tracking-wide rounded-md"
      onPress={() => wallet && !connecting && !connected && handleClick()}
      disabled={!wallet || connecting || connected}
    >
      <WalletImage wallet={wallet} />
      {content}
    </Button>
  );
};


export const WalletImage = (prop: { wallet: Wallet | null }) =>
  prop.wallet ? (
    <Image
      className="w-5 inline-block m-1"
      src={prop.wallet.adapter.icon}
      alt={`${prop.wallet.adapter.name} icon`}
      width={0}
      height={0}
    />
  ) : null;
