import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Logger,
  NotFoundException,
} from '@nestjs/common';

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

  @Post('/v1')
  async createNonceAccount(
    @Body() req: NonceAccountV1CreateReq,
  ): Promise<NonceAccountV1CreateResp> {
    this.logger.log('createNonceAccount');

    return this.nonceAccountService.createNonceAccount(req);
  }

  @Get('/v1/txPublicKey/:txPublicKey')
  async getNonceAccount(
    @Param('txPublicKey') txPublicKey: string,
  ): Promise<NonceAccountV1GetResp> {
    this.logger.log('getNonceAccount');

    const record = await this.nonceAccountService.getNonceAccount(txPublicKey);
    if (!record) {
      this.logger.error('NonceAccount not found');

      throw new NotFoundException('NonceAccount not found', {
        description: 'NonceAccount not found',
      });
    }

    return record;
  }
}
