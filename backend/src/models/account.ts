import * as z from "zod"

export const AccountModel = z.object({
  id: z.bigint(),
  email: z.string(),
  password: z.string(),
})
