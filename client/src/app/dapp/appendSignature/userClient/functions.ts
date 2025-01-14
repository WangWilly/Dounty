import { getFetcher } from "@/utils/fetcher";
import { config } from "./config";

////////////////////////////////////////////////////////////////////////////////

const fetcher = getFetcher(config.USER_CLIENT_BASE_URL);

// TODO: Add types
// Nonce account should be created by the owner of the txPublicKey
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBountyNonceAccountPublicKey = async (txPublicKey: string): Promise<any> => {
  return await fetcher.get(`/api/nonceAccount/v1?txPublicKey=${txPublicKey}`);
};

// TODO: Add types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTx = async (txPublicKey: string): Promise<any> => {
  return await fetcher.get(`/api/onChainTransaction/v1/${txPublicKey}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTx = async (body: any) => {
  await fetcher.post(`/api/onChainTransaction/v1`, body);
};
