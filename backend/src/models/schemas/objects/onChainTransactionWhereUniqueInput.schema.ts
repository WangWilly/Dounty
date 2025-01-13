import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionWhereUniqueInput> = z
  .object({
    publicKey: z.string().optional(),
  })
  .strict();

export const OnChainTransactionWhereUniqueInputObjectSchema = Schema;
