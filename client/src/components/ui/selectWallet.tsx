import { useCallback } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@nextui-org/react";

////////////////////////////////////////////////////////////////////////////////

export const SelectWalletModal = () => {
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
