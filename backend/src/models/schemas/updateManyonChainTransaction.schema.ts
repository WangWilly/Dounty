import { z } from 'zod';
import { OnChainTransactionUpdateManyMutationInputObjectSchema } from './objects/OnChainTransactionUpdateManyMutationInput.schema';
import { OnChainTransactionWhereInputObjectSchema } from './objects/OnChainTransactionWhereInput.schema';

export const OnChainTransactionUpdateManySchema = z.object({
  data: OnChainTransactionUpdateManyMutationInputObjectSchema,
  where: OnChainTransactionWhereInputObjectSchema.optional(),
});
