import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.onChainTransactionWhereUniqueInput> = z
  .object({
    public_key: z.string().optional(),
  })
  .strict();

export const onChainTransactionWhereUniqueInputObjectSchema = Schema;
