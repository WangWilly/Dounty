import { z } from 'zod';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.onChainTransactionWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => onChainTransactionWhereInputObjectSchema),
        z.lazy(() => onChainTransactionWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => onChainTransactionWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => onChainTransactionWhereInputObjectSchema),
        z.lazy(() => onChainTransactionWhereInputObjectSchema).array(),
      ])
      .optional(),
    public_key: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    serialized_tx: z.lazy(() => JsonFilterObjectSchema).optional(),
  })
  .strict();

export const onChainTransactionWhereInputObjectSchema = Schema;
