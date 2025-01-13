import { z } from 'zod';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.OnChainTransactionScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(
            () => OnChainTransactionScalarWhereWithAggregatesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                OnChainTransactionScalarWhereWithAggregatesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      OR: z
        .lazy(
          () => OnChainTransactionScalarWhereWithAggregatesInputObjectSchema,
        )
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(
            () => OnChainTransactionScalarWhereWithAggregatesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                OnChainTransactionScalarWhereWithAggregatesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      publicKey: z
        .union([
          z.lazy(() => StringWithAggregatesFilterObjectSchema),
          z.string(),
        ])
        .optional(),
      serializedTx: z
        .lazy(() => JsonWithAggregatesFilterObjectSchema)
        .optional(),
    })
    .strict();

export const OnChainTransactionScalarWhereWithAggregatesInputObjectSchema =
  Schema;
