import * as zod from "zod";

import { NetworkType } from "./types";

////////////////////////////////////////////////////////////////////////////////
// https://dev.to/bharathvajganesan/adding-type-safety-to-environment-variables-in-nextjs-54nb

const envSchema = zod.object({
  DEFAULT_NETWORK_TYPE: zod.nativeEnum(NetworkType).default(NetworkType.Local),
  CUSTOM_RPC_URL: zod.string().default(""),
});

export const config = envSchema.parse({
  DEFAULT_NETWORK_TYPE: process.env.NEXT_PUBLIC_DEFAULT_NETWORK_TYPE,
  CUSTOM_RPC_URL: process.env.NEXT_PUBLIC_CUSTOM_RPC_URL,
});
