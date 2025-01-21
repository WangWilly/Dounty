import { Controller, Post, Body, Logger, Get, UseGuards, Request, NotFoundException } from '@nestjs/common';

import { AccountService } from './account.service';

import { AccountV1CreateReq, AccountV1CreateResp, AccountV1GetResp } from './dtos/account.dto';
import { AuthGuard } from '@nestjs/passport';
import { safe } from '../../../utils/exception';

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

  @UseGuards(AuthGuard('jwt'))
  @Get('/v1')
  async getAccountById(
    @Request() reqCtx: any,
  ): Promise<AccountV1GetResp> {
    this.logger.log('getAccountByEmail');
    console.log(reqCtx);

    const account = await safe(this.accountService.getById(reqCtx.user.userId));
    if (!account.success) {
      this.logger.error(account.error);
      throw new NotFoundException(account.error);
    }
    if (account.data === null) {
      this.logger.error('Account not found');
      throw new NotFoundException('Account not found');
    }

    return {
      email: account.data.email,
    }
  }
}
