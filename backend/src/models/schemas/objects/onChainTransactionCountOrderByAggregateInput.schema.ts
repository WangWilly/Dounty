import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.onChainTransactionCountOrderByAggregateInput> = z
  .object({
    public_key: z.lazy(() => SortOrderSchema).optional(),
    serialized_tx: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const onChainTransactionCountOrderByAggregateInputObjectSchema = Schema;
