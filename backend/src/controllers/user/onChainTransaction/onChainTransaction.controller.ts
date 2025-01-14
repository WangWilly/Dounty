import { Controller, Get, Post, Param, Body, Logger } from '@nestjs/common';
import { OnChainTransactionService } from './onChainTransaction.service';

import {
  OnChainTransactionV1CreateReq,
  OnChainTransactionV1BatchCreateReq,
  OnChainTransactionV1GetResp,
} from './dtos/onChainTransaction.dto';

////////////////////////////////////////////////////////////////////////////////

@Controller('/api/onChainTransaction')
export class OnChainTransactionController {
  private readonly logger = new Logger('OnChainTransactionController');

  constructor(
    private readonly onChainTransactionService: OnChainTransactionService,
  ) {}

  //////////////////////////////////////////////////////////////////////////////

  @Post('v1')
  async createOnChainTransaction(
    @Body() req: OnChainTransactionV1CreateReq,
  ): Promise<void> {
    this.logger.log('createOnChainTransaction');

    this.onChainTransactionService.createOnChainTransaction(req);
  }

  @Post('v1:batch')
  async batchCreateOnChainTransaction(
    @Body() req: OnChainTransactionV1BatchCreateReq,
  ): Promise<void> {
    this.logger.log('batchCreateOnChainTransaction');

    this.onChainTransactionService.batchCreateOnChainTransaction(req);
  }

  @Get('v1/:txPublicKey')
  async getOnChainTransaction(
    @Param('txPublicKey') txPublicKey: string,
  ): Promise<OnChainTransactionV1GetResp | null> {
    this.logger.log('getOnChainTransaction');

    return await this.onChainTransactionService.getOnChainTransaction(
      txPublicKey,
    );
  }
}
