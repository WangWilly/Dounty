import { IsArray, IsString, IsObject } from 'class-validator';

////////////////////////////////////////////////////////////////////////////////

export class OnChainTransactionV1CreateReq {
  @IsString()
  publicKey!: string;

  @IsObject()
  serializedTx: any;
}

export class OnChainTransactionV1BatchCreateReq {
  @IsArray({each: true})
  transactions!: OnChainTransactionV1CreateReq[];
}
