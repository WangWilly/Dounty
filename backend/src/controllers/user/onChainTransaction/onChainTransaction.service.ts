import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { GlobalAppConfigService } from '../../../globals/appConfig/appConfig.service';
import { OnChainTransactionRepoService } from '../../../repos/onChainTransaction.service';

import { OnChainTransactionV1CreateReq } from './dtos/onChainTransaction.dto';

import { onChainTransactionCreateInputObjectSchema } from 'src/models/schemas/objects/onChainTransactionCreateInput.schema';

////////////////////////////////////////////////////////////////////////////////

// TODO: to zod
class ConfigSchema {
}

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

  async createOnChainTransaction(req: OnChainTransactionV1CreateReq): Promise<void> {
    const parsed = onChainTransactionCreateInputObjectSchema.parse(req);
    await this.onChainTransactionRepoServices.create(parsed);
  }
}
