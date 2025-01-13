import { z } from 'zod';
import { onChainTransactionCreateInputObjectSchema } from './objects/onChainTransactionCreateInput.schema';
import { onChainTransactionUncheckedCreateInputObjectSchema } from './objects/onChainTransactionUncheckedCreateInput.schema';

export const onChainTransactionCreateOneSchema = z.object({
  data: z.union([
    onChainTransactionCreateInputObjectSchema,
    onChainTransactionUncheckedCreateInputObjectSchema,
  ]),
});
