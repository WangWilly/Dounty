import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { OnChainTransactionCountOrderByAggregateInputObjectSchema } from './OnChainTransactionCountOrderByAggregateInput.schema';
import { OnChainTransactionMaxOrderByAggregateInputObjectSchema } from './OnChainTransactionMaxOrderByAggregateInput.schema';
import { OnChainTransactionMinOrderByAggregateInputObjectSchema } from './OnChainTransactionMinOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionOrderByWithAggregationInput> =
  z
    .object({
      publicKey: z.lazy(() => SortOrderSchema).optional(),
      serializedTx: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => OnChainTransactionCountOrderByAggregateInputObjectSchema)
        .optional(),
      _max: z
        .lazy(() => OnChainTransactionMaxOrderByAggregateInputObjectSchema)
        .optional(),
      _min: z
        .lazy(() => OnChainTransactionMinOrderByAggregateInputObjectSchema)
        .optional(),
    })
    .strict();

export const OnChainTransactionOrderByWithAggregationInputObjectSchema = Schema;
