import { getBountyFactoryProgram } from "@/components/anchor/bounty_factory";
import { BountyV1, bountyV1Schema } from "@/components/anchor/dtos/bountyV1";
import { safe } from "@/utils/exception";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";

////////////////////////////////////////////////////////////////////////////////

export async function getBounty(
  provider: anchor.AnchorProvider,
  bountyPda: PublicKey,
): Promise<BountyV1 | null> {
  const program = getBountyFactoryProgram(provider);

  const bountyRes = await safe(
    program.account.bountyV1.fetch(bountyPda.toBase58()),
  );
  if (!bountyRes.success) {
    toast.error("Bounty not found: " + bountyRes.error);
    return null;
  }
  const bounty = bountyRes.data;
  if (!bounty) {
    toast.error("Bounty not found");
    return null;
  }

  return bountyV1Schema.parse({ address: bountyPda, ...bounty });
}
