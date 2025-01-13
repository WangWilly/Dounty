import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionMaxOrderByAggregateInput> = z
  .object({
    publicKey: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const OnChainTransactionMaxOrderByAggregateInputObjectSchema = Schema;
