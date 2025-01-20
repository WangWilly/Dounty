import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { GlobalAppConfigService } from '../../../globals/appConfig/appConfig.service';
import { AccountRepoService } from '../../../repos/account.service';

import {
  AccountV1CreateReq,
  AccountV1CreateResp,
} from './dtos/account.dto';
import { safe } from '../../../utils/exception';

////////////////////////////////////////////////////////////////////////////////

// TODO: to zod
class ConfigSchema {}

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AccountService {
  constructor(
    private readonly globalAppConfigService: GlobalAppConfigService,
    private readonly accountRepoService: AccountRepoService,
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
    req: AccountV1CreateReq,
  ): Promise<AccountV1CreateResp> {
    const createRes = await safe(this.accountRepoService.create({...req}));
    if (!createRes.success) {
      return {
        status: false,
        message: createRes.error,
      }
    }

    return {
      status: true,
      message: '',
    };
  }
}
