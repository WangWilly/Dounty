import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionOrderByWithRelationInput> = z
  .object({
    publicKey: z.lazy(() => SortOrderSchema).optional(),
    serializedTx: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const OnChainTransactionOrderByWithRelationInputObjectSchema = Schema;
