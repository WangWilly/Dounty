import { z } from 'zod';
import { OnChainTransactionCreateManyInputObjectSchema } from './objects/OnChainTransactionCreateManyInput.schema';

export const OnChainTransactionCreateManySchema = z.object({
  data: z.union([
    OnChainTransactionCreateManyInputObjectSchema,
    z.array(OnChainTransactionCreateManyInputObjectSchema),
  ]),
  skipDuplicates: z.boolean().optional(),
});
