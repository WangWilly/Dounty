import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionCountAggregateInputType> = z
  .object({
    public_key: z.literal(true).optional(),
    serialized_tx: z.literal(true).optional(),
    _all: z.literal(true).optional(),
  })
  .strict();

export const OnChainTransactionCountAggregateInputObjectSchema = Schema;
