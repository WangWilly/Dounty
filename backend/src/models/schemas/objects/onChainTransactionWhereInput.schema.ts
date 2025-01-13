import { z } from 'zod';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => OnChainTransactionWhereInputObjectSchema),
        z.lazy(() => OnChainTransactionWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => OnChainTransactionWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => OnChainTransactionWhereInputObjectSchema),
        z.lazy(() => OnChainTransactionWhereInputObjectSchema).array(),
      ])
      .optional(),
    publicKey: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    serializedTx: z.lazy(() => JsonFilterObjectSchema).optional(),
  })
  .strict();

export const OnChainTransactionWhereInputObjectSchema = Schema;
