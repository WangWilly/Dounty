import { z } from 'zod';

export const OnChainTransactionScalarFieldEnumSchema = z.enum([
  'public_key',
  'serialized_tx',
]);
