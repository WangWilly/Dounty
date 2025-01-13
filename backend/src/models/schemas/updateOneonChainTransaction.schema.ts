import { z } from 'zod';
import { onChainTransactionUpdateInputObjectSchema } from './objects/onChainTransactionUpdateInput.schema';
import { onChainTransactionUncheckedUpdateInputObjectSchema } from './objects/onChainTransactionUncheckedUpdateInput.schema';
import { onChainTransactionWhereUniqueInputObjectSchema } from './objects/onChainTransactionWhereUniqueInput.schema';

export const onChainTransactionUpdateOneSchema = z.object({
  data: z.union([
    onChainTransactionUpdateInputObjectSchema,
    onChainTransactionUncheckedUpdateInputObjectSchema,
  ]),
  where: onChainTransactionWhereUniqueInputObjectSchema,
});
