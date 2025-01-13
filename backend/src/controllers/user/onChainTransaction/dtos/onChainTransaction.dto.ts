import { IsString, IsObject } from 'class-validator';

////////////////////////////////////////////////////////////////////////////////

export class OnChainTransactionV1CreateReq {
  @IsString()
  publicKey!: string;

  @IsObject()
  serializedTx: any;
}