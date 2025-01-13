import { z } from 'zod';

export const OnChainTransactionScalarFieldEnumSchema = z.enum([
  'publicKey',
  'serializedTx',
]);
