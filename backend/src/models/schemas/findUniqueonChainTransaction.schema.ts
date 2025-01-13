import { z } from 'zod';
import { OnChainTransactionWhereUniqueInputObjectSchema } from './objects/OnChainTransactionWhereUniqueInput.schema';

export const OnChainTransactionFindUniqueSchema = z.object({
  where: OnChainTransactionWhereUniqueInputObjectSchema,
});
