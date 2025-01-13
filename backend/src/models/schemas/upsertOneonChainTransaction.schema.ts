import { z } from 'zod';
import { onChainTransactionWhereUniqueInputObjectSchema } from './objects/onChainTransactionWhereUniqueInput.schema';
import { onChainTransactionCreateInputObjectSchema } from './objects/onChainTransactionCreateInput.schema';
import { onChainTransactionUncheckedCreateInputObjectSchema } from './objects/onChainTransactionUncheckedCreateInput.schema';
import { onChainTransactionUpdateInputObjectSchema } from './objects/onChainTransactionUpdateInput.schema';
import { onChainTransactionUncheckedUpdateInputObjectSchema } from './objects/onChainTransactionUncheckedUpdateInput.schema';

export const onChainTransactionUpsertSchema = z.object({
  where: onChainTransactionWhereUniqueInputObjectSchema,
  create: z.union([
    onChainTransactionCreateInputObjectSchema,
    onChainTransactionUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    onChainTransactionUpdateInputObjectSchema,
    onChainTransactionUncheckedUpdateInputObjectSchema,
  ]),
});
