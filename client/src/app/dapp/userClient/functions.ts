import { getFetcher } from "@/utils/fetcher";
import { config } from "./config";
import * as dtos from "./dtos";

////////////////////////////////////////////////////////////////////////////////

const fetcher = getFetcher(config.USER_CLIENT_BASE_URL);

////////////////////////////////////////////////////////////////////////////////

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
  return await fetcher.get(`/api/onChainTransaction/v1/${txPublicKey}`);
};
