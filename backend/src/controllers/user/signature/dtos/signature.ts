import { IsString, IsArray } from 'class-validator';

import { Signature } from '@prisma/client';

////////////////////////////////////////////////////////////////////////////////

export class SignatureV1CreateReq {
  @IsString()
  serializedTxBase64!: string;

  @IsString()
  serializedIxBase64!: string;

  @IsString()
  signerPublicKeyBase58!: string;

  @IsString()
  signatureBase58!: string;
}

export class SignatureV1CreateResp {
  @IsString()
  serializedTxBase64!: string;

  @IsString()
  serializedIxBase64!: string;

  @IsString()
  signerPublicKeyBase58!: string;

  @IsString()
  signatureBase58!: string;

  //////////////////////////////////////////////////////////////////////////////

  static fromModel(model: Signature): SignatureV1CreateResp {
    return { ...model };
  }
}

export class SignatureV1TxListReq {
  @IsString()
  txBase64!: string;
}

export class SignatureV1ListReq {
  @IsString()
  ixBase64!: string;
}

export class SignatureV1ListResp {
  @IsArray()
  signatures!: SignatureV1CreateResp[];

  //////////////////////////////////////////////////////////////////////////////

  static fromModel(models: Signature[]): SignatureV1ListResp {
    return {
      signatures: models.map((model) => SignatureV1CreateResp.fromModel(model)),
    };
  }
}
