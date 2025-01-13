import { z } from 'zod';
import { onChainTransactionWhereInputObjectSchema } from './objects/onChainTransactionWhereInput.schema';

export const onChainTransactionDeleteManySchema = z.object({
  where: onChainTransactionWhereInputObjectSchema.optional(),
});
