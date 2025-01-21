import * as zod from "zod";

////////////////////////////////////////////////////////////////////////////////

export const OnChainTransactionV1CreateReqSchema = zod.object({
  publicKey: zod.string(),
  serializedTx: zod.any(),
  serializedTxBase64: zod.string(),
  serializedIxBase64: zod.string(),
});

export type OnChainTransactionV1CreateReq = zod.infer<
  typeof OnChainTransactionV1CreateReqSchema
>;

export const OnChainTransactionV1BatchCreateReqSchema = zod.object({
  transactions: zod.array(OnChainTransactionV1CreateReqSchema),
});

export type OnChainTransactionV1BatchCreateReq = zod.infer<
  typeof OnChainTransactionV1BatchCreateReqSchema
>;

export const OnChainTransactionV1GetRespSchema = zod.object({
  publicKey: zod.string(),
  serializedTx: zod.any(),
  serializedTxBase64: zod.string(),
  serializedIxBase64: zod.string(),
});

export type OnChainTransactionV1GetResp = zod.infer<
  typeof OnChainTransactionV1GetRespSchema
>;

////////////////////////////////////////////////////////////////////////////////

export const NonceAccountV1CreateReqSchema = zod.object({
  publicKey: zod.string(),
  txPublickey: zod.string(),
  secretKey: zod.string(),
});

export type NonceAccountV1CreateReq = zod.infer<
  typeof NonceAccountV1CreateReqSchema
>;

export const NonceAccountV1CreateRespSchema = zod.object({
  publicKey: zod.string(),
  txPublickey: zod.string(),
  secretKey: zod.string(),
});

export type NonceAccountV1CreateResp = zod.infer<
  typeof NonceAccountV1CreateRespSchema
>;

export const NonceAccountV1GetRespSchema = NonceAccountV1CreateRespSchema;

export type NonceAccountV1GetResp = NonceAccountV1CreateResp;

////////////////////////////////////////////////////////////////////////////////

export const SignatureV1CreateReqSchema = zod.object({
  serializedTxBase64: zod.string(),
  serializedIxBase64: zod.string(),
  signerPublicKeyBase58: zod.string(),
  signatureBase58: zod.string(),
});

export type SignatureV1CreateReq = zod.infer<typeof SignatureV1CreateReqSchema>;

export const SignatureV1CreateRespSchema = SignatureV1CreateReqSchema;

export type SignatureV1CreateResp = SignatureV1CreateReq;

export const SignatureV1IxListReqSchema = zod.object({
  ixBase64: zod.string(),
});

export type SignatureV1ListReq = zod.infer<typeof SignatureV1IxListReqSchema>;

export const SignatureV1TxListReqSchema = zod.object({
  txBase64: zod.string(),
});

export type SignatureV1TxListReq = zod.infer<typeof SignatureV1TxListReqSchema>;

export const SignatureV1ListRespSchema = zod.object({
  signatures: zod.array(SignatureV1CreateRespSchema),
});

export type SignatureV1ListResp = zod.infer<typeof SignatureV1ListRespSchema>;

////////////////////////////////////////////////////////////////////////////////

export const AccountV1CreateReqSchema = zod.object({
  email: zod.string(),
  password: zod.string(),
});

export type AccountV1CreateReq = zod.infer<typeof AccountV1CreateReqSchema>;

export const AccountV1CreateRespSchema = zod.object({
  status: zod.boolean(),
  message: zod.string(),
});

export type AccountV1CreateResp = zod.infer<typeof AccountV1CreateRespSchema>;

////////////////////////////////////////////////////////////////////////////////

export const AccountV1GetRespSchema = zod.object({
  email: zod.string(),
});

export type AccountV1GetResp = zod.infer<typeof AccountV1GetRespSchema>;

////////////////////////////////////////////////////////////////////////////////

export const SessionV1CreateReqSchema = zod.object({
  email: zod.string(),
  password: zod.string(),
});

export type SessionV1CreateReq = zod.infer<typeof SessionV1CreateReqSchema>;

export const SessionV1CreateRespSchema = zod.object({
  token: zod.string(),
});

export type SessionV1CreateResp = zod.infer<typeof SessionV1CreateRespSchema>;

////////////////////////////////////////////////////////////////////////////////
