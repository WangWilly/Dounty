import { z } from 'zod';
import { onChainTransactionCreateManyInputObjectSchema } from './objects/onChainTransactionCreateManyInput.schema';

export const onChainTransactionCreateManySchema = z.object({
  data: z.union([
    onChainTransactionCreateManyInputObjectSchema,
    z.array(onChainTransactionCreateManyInputObjectSchema),
  ]),
  skipDuplicates: z.boolean().optional(),
});
