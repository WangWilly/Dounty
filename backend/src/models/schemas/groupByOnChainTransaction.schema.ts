import { z } from 'zod';
import { OnChainTransactionWhereInputObjectSchema } from './objects/OnChainTransactionWhereInput.schema';
import { OnChainTransactionOrderByWithAggregationInputObjectSchema } from './objects/OnChainTransactionOrderByWithAggregationInput.schema';
import { OnChainTransactionScalarWhereWithAggregatesInputObjectSchema } from './objects/OnChainTransactionScalarWhereWithAggregatesInput.schema';
import { OnChainTransactionScalarFieldEnumSchema } from './enums/OnChainTransactionScalarFieldEnum.schema';

export const OnChainTransactionGroupBySchema = z.object({
  where: OnChainTransactionWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      OnChainTransactionOrderByWithAggregationInputObjectSchema,
      OnChainTransactionOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having:
    OnChainTransactionScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(OnChainTransactionScalarFieldEnumSchema),
});
