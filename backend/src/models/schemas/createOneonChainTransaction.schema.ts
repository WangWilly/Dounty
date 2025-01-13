import { z } from 'zod';
import { OnChainTransactionCreateInputObjectSchema } from './objects/OnChainTransactionCreateInput.schema';
import { OnChainTransactionUncheckedCreateInputObjectSchema } from './objects/OnChainTransactionUncheckedCreateInput.schema';

export const OnChainTransactionCreateOneSchema = z.object({
  data: z.union([
    OnChainTransactionCreateInputObjectSchema,
    OnChainTransactionUncheckedCreateInputObjectSchema,
  ]),
});
