import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { onChainTransactionCountOrderByAggregateInputObjectSchema } from './onChainTransactionCountOrderByAggregateInput.schema';
import { onChainTransactionMaxOrderByAggregateInputObjectSchema } from './onChainTransactionMaxOrderByAggregateInput.schema';
import { onChainTransactionMinOrderByAggregateInputObjectSchema } from './onChainTransactionMinOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.onChainTransactionOrderByWithAggregationInput> =
  z
    .object({
      public_key: z.lazy(() => SortOrderSchema).optional(),
      serialized_tx: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => onChainTransactionCountOrderByAggregateInputObjectSchema)
        .optional(),
      _max: z
        .lazy(() => onChainTransactionMaxOrderByAggregateInputObjectSchema)
        .optional(),
      _min: z
        .lazy(() => onChainTransactionMinOrderByAggregateInputObjectSchema)
        .optional(),
    })
    .strict();

export const onChainTransactionOrderByWithAggregationInputObjectSchema = Schema;
