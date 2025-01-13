import { z } from 'zod';
import { onChainTransactionWhereUniqueInputObjectSchema } from './objects/onChainTransactionWhereUniqueInput.schema';

export const onChainTransactionDeleteOneSchema = z.object({
  where: onChainTransactionWhereUniqueInputObjectSchema,
});
