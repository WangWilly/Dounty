import { getFetcher } from "@/utils/fetcher";
import { config } from "./config";
import * as dtos from "./dtos";
import { getClientSideCookie } from "@/utils/cookies";
import { COOKIE_SESSION_NAME } from "@/utils/const";

////////////////////////////////////////////////////////////////////////////////

const fetcher = getFetcher(config.USER_CLIENT_BASE_URL);

////////////////////////////////////////////////////////////////////////////////

// TODO: login required
// Nonce account should be created by the owner of the txPublicKey
export const createNonceAccount = async (
  req: dtos.NonceAccountV1CreateReq,
): Promise<dtos.NonceAccountV1CreateResp> => {
  return await fetcher.post(`/api/nonceAccount/v1`, req);
};

export const getBountyNonceAccountPublicKey = async (
  txPublicKey: string,
): Promise<dtos.NonceAccountV1GetResp> => {
  const res = await fetcher.get(
    `/api/nonceAccount/v1/txPublicKey/${txPublicKey}`,
  );
  return dtos.NonceAccountV1GetRespSchema.parse(res.data);
};

////////////////////////////////////////////////////////////////////////////////

export const createTx = async (
  req: dtos.OnChainTransactionV1CreateReq,
): Promise<void> => {
  await fetcher.post(`/api/onChainTransaction/v1`, req);
};

export const getTx = async (
  txPublicKey: string,
): Promise<dtos.OnChainTransactionV1GetResp> => {
  const res = await fetcher.get(`/api/onChainTransaction/v1/${txPublicKey}`);
  return dtos.OnChainTransactionV1GetRespSchema.parse(res.data);
};

////////////////////////////////////////////////////////////////////////////////

export const createSignature = async (
  req: dtos.SignatureV1CreateReq,
): Promise<void> => {
  await fetcher.post(`/api/signature/v1`, req);
};

export const listSignaturesByTx = async (
  req: dtos.SignatureV1ListReq,
): Promise<dtos.SignatureV1ListResp> => {
  const res = await fetcher.post(`/api/signature/v1/listByIxBase64`, req);
  return dtos.SignatureV1ListRespSchema.parse(res.data);
};

export const listSignaturesByIx = async (
  req: dtos.SignatureV1ListReq,
): Promise<dtos.SignatureV1ListResp> => {
  const res = await fetcher.post(`/api/signature/v1/listByIxBase64`, req);
  return dtos.SignatureV1ListRespSchema.parse(res.data);
};

////////////////////////////////////////////////////////////////////////////////

export const getMyAccount = async (): Promise<dtos.AccountV1GetResp> => {
  const res = await fetcher.get(`/api/account/v1`, {
    headers: {
      Authorization: `Bearer ${getClientSideCookie(COOKIE_SESSION_NAME)}`,
    },
  });
  return dtos.AccountV1GetRespSchema.parse(res.data);
};

export const createAccount = async (
  req: dtos.AccountV1CreateReq,
): Promise<dtos.AccountV1CreateResp> => {
  const res = await fetcher.post(`/api/account/v1`, req);
  return dtos.AccountV1CreateRespSchema.parse(res.data);
};

export const createSession = async (
  req: dtos.SessionV1CreateReq,
): Promise<dtos.SessionV1CreateResp> => {
  const res = await fetcher.post(`/api/session/v1`, req);
  return dtos.SessionV1CreateRespSchema.parse(res.data);
};
