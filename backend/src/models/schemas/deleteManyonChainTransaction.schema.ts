import { z } from 'zod';
import { OnChainTransactionWhereInputObjectSchema } from './objects/OnChainTransactionWhereInput.schema';

export const OnChainTransactionDeleteManySchema = z.object({
  where: OnChainTransactionWhereInputObjectSchema.optional(),
});
