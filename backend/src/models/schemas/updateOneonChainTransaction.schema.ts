import { z } from 'zod';
import { OnChainTransactionUpdateInputObjectSchema } from './objects/OnChainTransactionUpdateInput.schema';
import { OnChainTransactionUncheckedUpdateInputObjectSchema } from './objects/OnChainTransactionUncheckedUpdateInput.schema';
import { OnChainTransactionWhereUniqueInputObjectSchema } from './objects/OnChainTransactionWhereUniqueInput.schema';

export const OnChainTransactionUpdateOneSchema = z.object({
  data: z.union([
    OnChainTransactionUpdateInputObjectSchema,
    OnChainTransactionUncheckedUpdateInputObjectSchema,
  ]),
  where: OnChainTransactionWhereUniqueInputObjectSchema,
});
