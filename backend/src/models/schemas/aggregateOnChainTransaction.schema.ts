import { z } from 'zod';
import { OnChainTransactionOrderByWithRelationInputObjectSchema } from './objects/OnChainTransactionOrderByWithRelationInput.schema';
import { OnChainTransactionWhereInputObjectSchema } from './objects/OnChainTransactionWhereInput.schema';
import { OnChainTransactionWhereUniqueInputObjectSchema } from './objects/OnChainTransactionWhereUniqueInput.schema';
import { OnChainTransactionCountAggregateInputObjectSchema } from './objects/OnChainTransactionCountAggregateInput.schema';
import { OnChainTransactionMinAggregateInputObjectSchema } from './objects/OnChainTransactionMinAggregateInput.schema';
import { OnChainTransactionMaxAggregateInputObjectSchema } from './objects/OnChainTransactionMaxAggregateInput.schema';

export const OnChainTransactionAggregateSchema = z.object({
  orderBy: z
    .union([
      OnChainTransactionOrderByWithRelationInputObjectSchema,
      OnChainTransactionOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: OnChainTransactionWhereInputObjectSchema.optional(),
  cursor: OnChainTransactionWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), OnChainTransactionCountAggregateInputObjectSchema])
    .optional(),
  _min: OnChainTransactionMinAggregateInputObjectSchema.optional(),
  _max: OnChainTransactionMaxAggregateInputObjectSchema.optional(),
});
