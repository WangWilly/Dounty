import { z } from 'zod';
import { OnChainTransactionWhereUniqueInputObjectSchema } from './objects/OnChainTransactionWhereUniqueInput.schema';

export const OnChainTransactionDeleteOneSchema = z.object({
  where: OnChainTransactionWhereUniqueInputObjectSchema,
});
