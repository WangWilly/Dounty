import Link from 'next/link';

////////////////////////////////////////////////////////////////////////////////

interface NoWalletProps {
  title: string;
  content: string;
}

const NoWallet = ({ title, content }: NoWalletProps) => {
  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
        <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
          <h2 className="text-lg font-bold text-orange-600">
            {title}
          </h2>
        </div>
        <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-300">
            {content}
          </p>
        </div>
        <Link href="/dapp">
          <div className="bg-gray-100 text-black px-6 py-2 rounded-lg font-semibold">
            To bounty board
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NoWallet;
