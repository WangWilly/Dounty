import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionMaxAggregateInputType> = z
  .object({
    publicKey: z.literal(true).optional(),
  })
  .strict();

export const OnChainTransactionMaxAggregateInputObjectSchema = Schema;
