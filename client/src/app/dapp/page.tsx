import Image from "next/image";

////////////////////////////////////////////////////////////////////////////////

export default function Page() {
  return (
  <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-800">
          <div className="bg-orange-100 border border-orange-500 p-4 rounded-lg text-center mb-6">
              <h2 className="text-lg font-bold text-orange-600">Bounty! Get SOL for the reward</h2>
          </div>
          <div className="border border-dotted border-gray-600 p-4 rounded-lg text-center mb-6">
              <p className="text-gray-300">The Author created a bounty pool for this ticket</p>
              <div className="mt-4">
                <Image
                  src="https://placehold.co/400x200/orange/white?text=Bounty+Image&font=roboto"
                  alt="Bounty Image"
                  width={400}
                  height={200}
                  className="mx-auto rounded-lg"
                />
              </div>
              <p className="mt-4 text-gray-300">
                  Current Bounty: <span className="text-orange-400 font-semibold">5 SOL</span>
              </p>
              <p className="text-gray-300">
                  Contributors: <span className="text-blue-400">15</span>
              </p>
          </div>
          <div className="flex justify-center space-x-4">
              <button className="bg-gray-100 hover:bg-gray-300 text-black px-6 py-2 rounded-lg font-semibold">
                  Claim it!
              </button>
              <button className="bg-gray-100 hover:bg-gray-300 text-black px-6 py-2 rounded-lg font-semibold">
                  Donate
              </button>
              <button className="bg-gray-100 hover:bg-gray-300 text-black px-6 py-2 rounded-lg font-semibold">
                  More INFO
              </button>
          </div>
      </div>
  </div>
  )
}
