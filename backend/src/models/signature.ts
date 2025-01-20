import * as z from "zod"

export const SignatureModel = z.object({
  serializedTxBase64: z.string(),
  serializedIxBase64: z.string(),
  signerPublicKeyBase58: z.string(),
  signatureBase58: z.string(),
})
