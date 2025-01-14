import { IsArray, IsString, IsObject } from 'class-validator';

////////////////////////////////////////////////////////////////////////////////

export class OnChainTransactionV1CreateReq {
  @IsString()
  publicKey!: string;

  @IsObject()
  serializedTx!: any;

  @IsString()
  serializedTxBase64!: string;
}

export class OnChainTransactionV1BatchCreateReq {
  @IsArray({ each: true })
  transactions!: OnChainTransactionV1CreateReq[];
}

export class OnChainTransactionV1GetResp {
  @IsString()
  publicKey!: string;

  @IsObject()
  serializedTx!: any;

  @IsString()
  serializedTxBase64!: string;
}
