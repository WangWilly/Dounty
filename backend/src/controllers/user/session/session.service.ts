import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { GlobalAppConfigService } from '../../../globals/appConfig/appConfig.service';
import { AccountRepoService } from '../../../repos/account.service';

import {
  SessionV1CreateReq,
  SessionV1CreateResp,
} from './dtos/session.dto';
import { safe } from '../../../utils/exception';

////////////////////////////////////////////////////////////////////////////////

// TODO: to zod
class ConfigSchema {}

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class SessionService {
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

  // async createAccount(
  //   req: SessionV1CreateReq,
  // ): Promise<SessionV1CreateResp> {
  //   const getRes = await safe(this.accountRepoService.getByEmail(req.email));
  //   if (!getRes.success) {
  //     return {
  //       status: false,
  //       message: getRes.error,
  //       token: '',
  //     }
  //   }

  //   if (!getRes.data) {
  //     return {
  //       status: false,
  //       message: 'User not found',
  //       token: '',
  //     }
  //   }

  //   if (getRes.data.password !== req.password) {
  //     return {
  //       status: false,
  //       message: 'Password incorrect',
  //       token: '',
  //     }
  //   }
  // }
}
