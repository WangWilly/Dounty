import {
  BOUNTY_FACTORY_PROGRAM_ID,
  getBountyFactoryProgram,
} from "@/components/anchor/bounty_factory";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { toast } from "react-toastify";
import { safe } from "@/utils/exception";

import { SendTransactionOptions } from "@solana/wallet-adapter-base";

////////////////////////////////////////////////////////////////////////////////

export const createDoner = async (
  connection: Connection,
  provider: anchor.AnchorProvider,
  userPubkey: PublicKey,
  bountyPda: PublicKey | null,
  donation: number,
  message: string,
  signTransaction: (
    transaction: VersionedTransaction,
  ) => Promise<VersionedTransaction>,
  sendTransaction: (
    transaction: VersionedTransaction,
    connection: Connection,
    options?: SendTransactionOptions,
  ) => Promise<anchor.web3.TransactionSignature>,
): Promise<void> => {
  if (!bountyPda || donation <= 0) {
    return;
  }

  toast.info("Donating");

  const program = getBountyFactoryProgram(provider);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [donerPda, _donerPdaBump] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("doner"),
      userPubkey.toBuffer(),
      bountyPda.toBuffer(),
    ],
    BOUNTY_FACTORY_PROGRAM_ID,
  );
  const createDonerV1Acc = {
    doner: userPubkey,
    donerAccount: donerPda,
    bounty: bountyPda,
    systemProgram: SystemProgram.programId,
  };

  const latestBlockhashRes = await safe(connection.getLatestBlockhash());
  if (!latestBlockhashRes.success) {
    toast.error("Can't get latest blockhash: " + latestBlockhashRes.error);
    return;
  }
  const latestBlockhash = latestBlockhashRes.data;
  const ixRes = await safe(
    program.methods
      .createDonerV1(new anchor.BN(donation), message)
      .accountsPartial(createDonerV1Acc)
      .instruction(),
  );
  if (!ixRes.success) {
    toast.error("Can't create doner instruction: " + ixRes.error);
    return;
  }
  const ix = ixRes.data;

  // Create a new TransactionMessage with version and compile it to legacy
  const messageLegacy = new TransactionMessage({
    payerKey: userPubkey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [ix],
  }).compileToLegacyMessage();
  // Create a new VersionedTransaction which supports legacy and v0
  const transaction = new VersionedTransaction(messageLegacy);
  const txRes = await safe(signTransaction(transaction));
  if (!txRes.success) {
    toast.error("Can't sign transaction: " + txRes.error);
    return;
  }
  const tx = txRes.data;

  const signatureRes = await safe(sendTransaction(tx, connection));
  if (!signatureRes.success) {
    toast.error("Can't send transaction: " + signatureRes.error);
    return;
  }
  const signature = signatureRes.data;
  const res = await safe(
    connection.confirmTransaction(
      { signature, ...latestBlockhash },
      "confirmed",
    ),
  );
  if (!res.success) {
    toast.error("Can't confirm transaction: " + res.error);
    return;
  }

  toast.success("Successfully donated");
};
