import Link from "next/link";
import { Button } from "@nextui-org/react";

////////////////////////////////////////////////////////////////////////////////

const NotFoundPage = () => {
  return (
    <div className="font-sans">
      <div className="px-8 py-12 text-center bg-gray-800 rounded-lg shadow-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white text-3xl font-bold mb-8">
            Page not found 🥵
          </h2>
          <div className="flex justify-center mt-8 gap-2">
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

export default NotFoundPage;
