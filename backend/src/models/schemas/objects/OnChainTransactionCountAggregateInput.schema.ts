import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionCountAggregateInputType> = z
  .object({
    publicKey: z.literal(true).optional(),
    serializedTx: z.literal(true).optional(),
    _all: z.literal(true).optional(),
  })
  .strict();

export const OnChainTransactionCountAggregateInputObjectSchema = Schema;
