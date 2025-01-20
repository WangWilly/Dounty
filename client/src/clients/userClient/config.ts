import * as zod from "zod";

////////////////////////////////////////////////////////////////////////////////
// https://dev.to/bharathvajganesan/adding-type-safety-to-environment-variables-in-nextjs-54nb

const envSchema = zod
  .object({
    USER_CLIENT_BASE_URL: zod.string(),
  })
  .required({
    USER_CLIENT_BASE_URL: true,
  });

export const config = envSchema.parse({
  USER_CLIENT_BASE_URL: process.env.NEXT_PUBLIC_USER_CLIENT_BASE_URL,
});
