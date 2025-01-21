import * as zod from "zod";

////////////////////////////////////////////////////////////////////////////////
// https://dev.to/bharathvajganesan/adding-type-safety-to-environment-variables-in-nextjs-54nb

const envSchema = zod
  .object({
    NODE_ENV: zod.string(),
    IS_DEV: zod.string().transform((val: string): boolean => {
      switch (val) {
        case "development":
          return true;
        case "production":
          return false;
        default:
          throw new Error(`Unexpected NODE_ENV: ${val}`);
      }
    }),
    ASSET_BASE_PATH: zod.string(),
  })
  .required({
    NODE_ENV: true,
  });

export const appConfig = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  IS_DEV: process.env.NODE_ENV,
  ASSET_BASE_PATH: process.env.NEXT_PUBLIC_ASSET_BASE_PATH,
});
