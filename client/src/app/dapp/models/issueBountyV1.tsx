import {
  getTx,
  listSignaturesByTx,
} from "@/clients/userClient/functions";
import {
  getBountyFactoryProgram,
} from "@/components/anchor/bounty_factory";
import { useAnchorProvider } from "@/components/solana_provider";
import { safe } from "@/utils/exception";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Button, Spinner } from "@nextui-org/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  VersionedTransaction,
  PublicKey,
} from "@solana/web3.js";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

interface Props {
  issueBountyPda: string;
  setIssueBountyPda: Dispatch<SetStateAction<string | null>>;
}

////////////////////////////////////////////////////////////////////////////////

export default function IssueBountyModel({
  issueBountyPda,
  setIssueBountyPda,
}: Props) {
  const { connection } = useConnection();

  const provider = useAnchorProvider();
  const program = getBountyFactoryProgram(provider);

  const [isLoading, setIsLoading] = useState(false);

  const { sendTransaction } = useWallet();
  if (!sendTransaction) {
    return null;
  }

  let bountyPdaPubkey: PublicKey | null = null;
  try {
    bountyPdaPubkey = new PublicKey(issueBountyPda);
  } catch (e) {
    toast.error("Invalid bounty PDA: " + e);
    return null;
  }

  //////////////////////////////////////////////////////////////////////////////

  const onClickIssue = async () => {
    // Resolve
    if (!bountyPdaPubkey) {
      toast.error("Bounty address is required");
      return;
    }
    const bountyRes = await safe(
      program.account.bountyV1.fetch(bountyPdaPubkey.toBase58()),
    );
    if (!bountyRes.success) {
      toast.error("Bounty not found: " + bountyRes.error);
      return;
    }
    const bounty = bountyRes.data;
    if (!bounty) {
      toast.error("Bounty not found");
      return;
    }
    if (bounty.assignee === null) {
      toast.error("Bounty not assigned");
      return;
    }

    const existingTxRes = await safe(getTx(bountyPdaPubkey.toBase58()));
    if (!existingTxRes.success) {
      toast.error("Failed to get existing transaction: " + existingTxRes.error);
      return;
    }
    if (!existingTxRes.data) {
      toast.error("No existing transaction");
      return;
    }
    const existingTx = existingTxRes.data;

    if (!existingTx.serializedTxBase64) {
      toast.error("No existing transaction");
      return;
    }
    const tx = VersionedTransaction.deserialize(
      Buffer.from(existingTx.serializedTxBase64, "base64"),
    );

    const signaturesRes = await safe(
      listSignaturesByTx({ ixBase64: existingTx.serializedIxBase64 }),
    );
    if (!signaturesRes.success) {
      toast.error("Failed to get signatures: " + signaturesRes.error);
      return;
    }
    const signatures = signaturesRes.data.signatures;
    if (!signatures || !signatures.length) {
      toast.error("No signatures");
      return;
    }
    const txSignatures = signatures.map((signature) => ({
      publicKey: new PublicKey(signature.signerPublicKeyBase58),
      signature: bs58.decode(signature.signatureBase58),
    }));

    // TODO: confirm the transaction
    // https://www.quicknode.com/guides/solana-development/transactions/how-to-send-offline-tx
    for (const txSignature of txSignatures) {
      try {
        tx.addSignature(txSignature.publicKey, txSignature.signature);
      } catch (error) {
        toast.error("Failed to add signature: " + error);
      }
    }
    const sigRes = await safe(sendTransaction(tx, connection));
    if (!sigRes.success) {
      toast.error("Failed to send transaction: " + sigRes.error);
      return;
    }

    toast.success("Transaction sent");
  };

  const onClickIssueWrapped = async () => {
    setIsLoading(true);
    await onClickIssue();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
        <div className="flex items-center pb-3 border-b border-gray-300">
          <h3 className="text-gray-800 text-xl font-bold flex-1">
            Issue the Bounty
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 ml-2 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500"
            viewBox="0 0 320.591 320.591"
            onClick={() => setIssueBountyPda(null)}
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
        </div>

        <div className="my-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            😍 Finally, the project is finished. Give the contributer their deserve.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            🎉 Issue the bounty to the contributer.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            ⚠️ This action is irreversible. The bounty will be sent to the contributer.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            ⚠️ More than half of the commissoners must agree to the decision with their signature.
          </p>
        </div>

        <div className="border-t border-gray-300 pt-6 flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-gray-800 text-sm border-none outline-none tracking-wide bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
            onClick={() => setIssueBountyPda(null)}
          >
            Close
          </button>
          <Button
            type="button"
            className="px-4 py-2 rounded-lg text-white text-sm border-none outline-none tracking-wide bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
            onPress={onClickIssueWrapped}
          >
            {isLoading ? <Spinner /> : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
