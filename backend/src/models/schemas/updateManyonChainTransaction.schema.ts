import { z } from 'zod';
import { onChainTransactionUpdateManyMutationInputObjectSchema } from './objects/onChainTransactionUpdateManyMutationInput.schema';
import { onChainTransactionWhereInputObjectSchema } from './objects/onChainTransactionWhereInput.schema';

export const onChainTransactionUpdateManySchema = z.object({
  data: onChainTransactionUpdateManyMutationInputObjectSchema,
  where: onChainTransactionWhereInputObjectSchema.optional(),
});
