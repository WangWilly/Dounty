import { z } from 'zod';
import { onChainTransactionOrderByWithRelationInputObjectSchema } from './objects/onChainTransactionOrderByWithRelationInput.schema';
import { onChainTransactionWhereInputObjectSchema } from './objects/onChainTransactionWhereInput.schema';
import { onChainTransactionWhereUniqueInputObjectSchema } from './objects/onChainTransactionWhereUniqueInput.schema';
import { onChainTransactionScalarFieldEnumSchema } from './enums/onChainTransactionScalarFieldEnum.schema';

export const onChainTransactionFindManySchema = z.object({
  orderBy: z
    .union([
      onChainTransactionOrderByWithRelationInputObjectSchema,
      onChainTransactionOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: onChainTransactionWhereInputObjectSchema.optional(),
  cursor: onChainTransactionWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(onChainTransactionScalarFieldEnumSchema).optional(),
});
