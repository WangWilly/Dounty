import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { GlobalAppConfigService } from '../../../globals/appConfig/appConfig.service';
import { NonceAccountRepoService } from '../../../repos/nonceAccount.service';

import {
  NonceAccountV1CreateReq,
  NonceAccountV1CreateResp,
  NonceAccountV1GetResp,
} from './dtos/nonceAccount.dto';

////////////////////////////////////////////////////////////////////////////////

// TODO: to zod
class ConfigSchema {}

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class NonceAccountService {
  constructor(
    private readonly globalAppConfigService: GlobalAppConfigService,
    private readonly nonceAccountRepoService: NonceAccountRepoService,
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

  async createNonceAccount(
    req: NonceAccountV1CreateReq,
  ): Promise<NonceAccountV1CreateResp> {
    const nonceAccount = await this.nonceAccountRepoService.create({
      publicKey: req.publicKey,
      txPublicKey: req.txPublickey,
    });

    return NonceAccountV1CreateResp.fromModel(nonceAccount);
  }

  async getNonceAccount(
    txPublicKey: string,
  ): Promise<NonceAccountV1GetResp | null> {
    const nonceAccount =
      await this.nonceAccountRepoService.getByTxPublicKey(txPublicKey);

    if (!nonceAccount) {
      return null;
    }

    return NonceAccountV1GetResp.fromModel(nonceAccount);
  }
}
