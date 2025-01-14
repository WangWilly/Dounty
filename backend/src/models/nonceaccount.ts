import * as z from 'zod';

export const NonceAccountModel = z.object({
  publicKey: z.string(),
  txPublicKey: z.string(),
});
