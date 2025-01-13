import { z } from 'zod';
import { OnChainTransactionWhereUniqueInputObjectSchema } from './objects/OnChainTransactionWhereUniqueInput.schema';
import { OnChainTransactionCreateInputObjectSchema } from './objects/OnChainTransactionCreateInput.schema';
import { OnChainTransactionUncheckedCreateInputObjectSchema } from './objects/OnChainTransactionUncheckedCreateInput.schema';
import { OnChainTransactionUpdateInputObjectSchema } from './objects/OnChainTransactionUpdateInput.schema';
import { OnChainTransactionUncheckedUpdateInputObjectSchema } from './objects/OnChainTransactionUncheckedUpdateInput.schema';

export const OnChainTransactionUpsertSchema = z.object({
  where: OnChainTransactionWhereUniqueInputObjectSchema,
  create: z.union([
    OnChainTransactionCreateInputObjectSchema,
    OnChainTransactionUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    OnChainTransactionUpdateInputObjectSchema,
    OnChainTransactionUncheckedUpdateInputObjectSchema,
  ]),
});
