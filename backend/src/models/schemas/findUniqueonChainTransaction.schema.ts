import { z } from 'zod';
import { onChainTransactionWhereUniqueInputObjectSchema } from './objects/onChainTransactionWhereUniqueInput.schema';

export const onChainTransactionFindUniqueSchema = z.object({
  where: onChainTransactionWhereUniqueInputObjectSchema,
});
