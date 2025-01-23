import Link from "next/link";
import { Button } from "@nextui-org/react";
import {
  SelectWalletButton,
  WalletConnectContentButton,
} from "@/components/ui/selectWallet";
import { useWallet } from "@solana/wallet-adapter-react";

////////////////////////////////////////////////////////////////////////////////

interface NoWalletProps {
  title: string;
  content: string;
}

const NoWallet = ({ title, content }: NoWalletProps) => {
  const { publicKey, wallet } = useWallet();

  return (
    <div className="font-sans">
      <div className="px-8 py-12 text-center bg-gray-800 rounded-lg shadow-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white text-3xl font-bold mb-8">{title} 🥵</h2>
          <p className="text-gray-300 text-base mb-4">{content}</p>
          <p className="text-gray-300 text-base">
            You have to connect your wallet to continue.
          </p>
          <div className="flex flex-col justify-center mt-8 gap-2">
            {wallet ? (
              publicKey ? null : (
                <WalletConnectContentButton />
              )
            ) : (
              <SelectWalletButton />
            )}
            <Button
              as={Link}
              href="/dapp"
              className="inline-block mt-8 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base tracking-wide rounded-md"
            >
              To bounty board
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoWallet;
