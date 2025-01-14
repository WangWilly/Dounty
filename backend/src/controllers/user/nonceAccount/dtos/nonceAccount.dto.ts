import { IsString } from 'class-validator';

import { NonceAccount } from '@prisma/client';

////////////////////////////////////////////////////////////////////////////////

export class NonceAccountV1CreateReq {
  @IsString()
  publicKey!: string;

  @IsString()
  txPublickey!: string;
}

export class NonceAccountV1CreateResp {
  @IsString()
  publicKey!: string;

  @IsString()
  txPublickey!: string;

  //////////////////////////////////////////////////////////////////////////////

  static fromModel(model: NonceAccount): NonceAccountV1CreateResp {
    return {
      publicKey: model.publicKey,
      txPublickey: model.txPublicKey,
    };
  }
}

export class NonceAccountV1GetResp extends NonceAccountV1CreateResp {}
