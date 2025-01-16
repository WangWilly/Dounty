import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { GlobalAppConfigService } from '../../../globals/appConfig/appConfig.service';
import { SignatureRepoService } from '../../../repos/signature.service';

import {
  SignatureV1CreateReq,
  SignatureV1CreateResp,
  SignatureV1ListResp,
} from './dtos/signature';

////////////////////////////////////////////////////////////////////////////////

// TODO: to zod
class ConfigSchema {}

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class SignatureService {
  constructor(
    private readonly globalAppConfigService: GlobalAppConfigService,
    private readonly signatureRepoService: SignatureRepoService,
  ) {
    // setup config
    const cfg = plainToInstance(
      ConfigSchema,
      this.globalAppConfigService.getUnstructedAppConfig(),
    );
    const errors = validateSync(cfg);
    if (errors.length) {
      throw new Error(errors.toString());
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  async createSignature(
    req: SignatureV1CreateReq,
  ): Promise<SignatureV1CreateResp> {
    const signature = await this.signatureRepoService.create({
      serializedIxBase64: req.serializedIxBase64,
      signerPublicKeyBase58: req.signerPublicKeyBase58,
      signatureBase58: req.signatureBase58,
    });

    return SignatureV1CreateResp.fromModel(signature);
  }

  async listSignaturesByIxBase64(
    ixBase64: string,
  ): Promise<SignatureV1ListResp> {
    const signatures = await this.signatureRepoService.listByIxBase64(ixBase64);

    return SignatureV1ListResp.fromModel(signatures);
  }
}
