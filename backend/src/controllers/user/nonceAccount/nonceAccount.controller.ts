import { Controller, Get, Post, Param, Body, Logger } from '@nestjs/common';

import { NonceAccountService } from './nonceAccount.service';

import {
  NonceAccountV1CreateReq,
  NonceAccountV1CreateResp,
  NonceAccountV1GetResp,
} from './dtos/nonceAccount.dto';

////////////////////////////////////////////////////////////////////////////////

@Controller('/api/nonceAccount')
export class NonceAccountController {
  private readonly logger = new Logger('NonceAccountController');

  constructor(private readonly nonceAccountService: NonceAccountService) {}

  //////////////////////////////////////////////////////////////////////////////

  @Post('v1')
  async createNonceAccount(
    @Body() req: NonceAccountV1CreateReq,
  ): Promise<NonceAccountV1CreateResp> {
    this.logger.log('createNonceAccount');
    return this.nonceAccountService.createNonceAccount(req);
  }

  @Get('v1/:txPublicKey')
  async getNonceAccount(
    @Param('txPublicKey') txPublicKey: string,
  ): Promise<NonceAccountV1GetResp | null> {
    this.logger.log('getNonceAccount');
    return this.nonceAccountService.getNonceAccount(txPublicKey);
  }
}
