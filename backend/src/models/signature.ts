import * as z from 'zod';

export const SignatureModel = z.object({
  serializedIxBase64: z.string(),
  signerPublicKeyBase58: z.string(),
  signatureBase58: z.string(),
});
