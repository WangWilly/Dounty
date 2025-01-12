import * as crypto from 'crypto';

////////////////////////////////////////////////////////////////////////////////

export function toHashedSeed(str: string): Uint8Array {
  const hexString = crypto.createHash('sha256').update(str,'utf-8').digest('hex');
  const seed = Uint8Array.from(Buffer.from(hexString,'hex'));
  return seed;
}
