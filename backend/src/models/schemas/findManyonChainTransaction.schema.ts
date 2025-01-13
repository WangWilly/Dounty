import { z } from 'zod';
import { OnChainTransactionOrderByWithRelationInputObjectSchema } from './objects/OnChainTransactionOrderByWithRelationInput.schema';
import { OnChainTransactionWhereInputObjectSchema } from './objects/OnChainTransactionWhereInput.schema';
import { OnChainTransactionWhereUniqueInputObjectSchema } from './objects/OnChainTransactionWhereUniqueInput.schema';
import { OnChainTransactionScalarFieldEnumSchema } from './enums/OnChainTransactionScalarFieldEnum.schema';

export const OnChainTransactionFindManySchema = z.object({
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
  distinct: z.array(OnChainTransactionScalarFieldEnumSchema).optional(),
});
