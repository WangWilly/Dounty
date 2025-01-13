import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionMinAggregateInputType> = z
  .object({
    publicKey: z.literal(true).optional(),
  })
  .strict();

export const OnChainTransactionMinAggregateInputObjectSchema = Schema;
