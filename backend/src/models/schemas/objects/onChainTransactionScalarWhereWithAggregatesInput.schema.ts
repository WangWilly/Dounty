import { z } from 'zod';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.onChainTransactionScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(
            () => onChainTransactionScalarWhereWithAggregatesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                onChainTransactionScalarWhereWithAggregatesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      OR: z
        .lazy(
          () => onChainTransactionScalarWhereWithAggregatesInputObjectSchema,
        )
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(
            () => onChainTransactionScalarWhereWithAggregatesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                onChainTransactionScalarWhereWithAggregatesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      public_key: z
        .union([
          z.lazy(() => StringWithAggregatesFilterObjectSchema),
          z.string(),
        ])
        .optional(),
      serialized_tx: z
        .lazy(() => JsonWithAggregatesFilterObjectSchema)
        .optional(),
    })
    .strict();

export const onChainTransactionScalarWhereWithAggregatesInputObjectSchema =
  Schema;
