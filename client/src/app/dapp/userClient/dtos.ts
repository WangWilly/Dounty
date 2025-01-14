import * as zod from "zod";

////////////////////////////////////////////////////////////////////////////////

export const OnChainTransactionV1CreateReqSchema = zod.object({
  publicKey: zod.string(),
  serializedTx: zod.any(),
  serializedTxBase64: zod.string(),
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
});

export type OnChainTransactionV1GetResp = zod.infer<
  typeof OnChainTransactionV1GetRespSchema
>;

////////////////////////////////////////////////////////////////////////////////

export const NonceAccountV1CreateReqSchema = zod.object({
  publicKey: zod.string(),
  txPublickey: zod.string(),
});

export type NonceAccountV1CreateReq = zod.infer<
  typeof NonceAccountV1CreateReqSchema
>;

export const NonceAccountV1CreateRespSchema = zod.object({
  publicKey: zod.string(),
  txPublickey: zod.string(),
});

export type NonceAccountV1CreateResp = zod.infer<
  typeof NonceAccountV1CreateRespSchema
>;

export const NonceAccountV1GetRespSchema = NonceAccountV1CreateRespSchema;

export type NonceAccountV1GetResp = NonceAccountV1CreateResp;
