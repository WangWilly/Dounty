import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import BountyFactoryIDL from '@/contract/idl/bounty_factory.json'
import type { BountyFactory } from '@/contract/types/bounty_factory'

////////////////////////////////////////////////////////////////////////////////

// Re-export the generated IDL and type
export { BountyFactory, BountyFactoryIDL }

// The programId is imported from the program IDL.
export const BOUNTY_FACTORY_PROGRAM_ID = new PublicKey(BountyFactoryIDL.address)

// This is a helper function to get the Anchor program.
export function getBountyFactoryProgram(provider: AnchorProvider) {
  return new Program(BountyFactoryIDL as BountyFactory, provider)
}
