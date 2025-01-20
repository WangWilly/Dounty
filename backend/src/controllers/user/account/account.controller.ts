import { Controller, Post, Body, Logger } from '@nestjs/common';

import { AccountService } from './account.service';

import {
  AccountV1CreateReq,
  AccountV1CreateResp,
} from './dtos/account.dto';

////////////////////////////////////////////////////////////////////////////////

@Controller('/api/account')
export class AccountController {
  private readonly logger = new Logger('AccountController');

  constructor(private readonly accountService: AccountService) {}

  //////////////////////////////////////////////////////////////////////////////

  @Post('/v1')
  async createNonceAccount(
    @Body() req: AccountV1CreateReq,
  ): Promise<AccountV1CreateResp> {
    this.logger.log('createAccount');

    return this.accountService.createNonceAccount(req);
  }
}
