import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { GlobalAppConfigService } from '../../../globals/appConfig/appConfig.service';
import { OnChainTransactionRepoService } from '../../../repos/onChainTransaction.service';

import {
  OnChainTransactionV1CreateReq,
  OnChainTransactionV1BatchCreateReq,
  OnChainTransactionV1GetResp,
} from './dtos/onChainTransaction.dto';

import { OnChainTransactionModel } from '../../../models';

////////////////////////////////////////////////////////////////////////////////

// TODO: to zod
class ConfigSchema {}

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class OnChainTransactionService {
  constructor(
    private readonly globalAppConfigService: GlobalAppConfigService,
    private readonly onChainTransactionRepoServices: OnChainTransactionRepoService,
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

  async createOnChainTransaction(
    req: OnChainTransactionV1CreateReq,
  ): Promise<void> {
    const parsed = OnChainTransactionModel.parse(req);
    await this.onChainTransactionRepoServices.create(parsed);
  }

  async batchCreateOnChainTransaction(
    req: OnChainTransactionV1BatchCreateReq,
  ): Promise<void> {
    const serializedTxs = req.transactions.map((tx) =>
      OnChainTransactionModel.parse(tx),
    );
    await this.onChainTransactionRepoServices.batchCreate(serializedTxs);
  }

  async getOnChainTransaction(
    txPublicKey: string,
  ): Promise<OnChainTransactionV1GetResp | null> {
    return await this.onChainTransactionRepoServices.getByPublicKey(
      txPublicKey,
    );
  }
}
