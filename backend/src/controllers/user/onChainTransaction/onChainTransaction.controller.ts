import { Controller, Get, Post, Param, Body, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';

import { safe } from '../../../utils/exception';

import {
  OnChainTransactionV1CreateReq,
  OnChainTransactionV1BatchCreateReq,
  OnChainTransactionV1GetResp,
} from './dtos/onChainTransaction.dto';
import { OnChainTransactionService } from './onChainTransaction.service';

////////////////////////////////////////////////////////////////////////////////

@Controller('/api/onChainTransaction')
export class OnChainTransactionController {
  private readonly logger = new Logger('OnChainTransactionController');

  constructor(
    private readonly onChainTransactionService: OnChainTransactionService,
  ) {}

  //////////////////////////////////////////////////////////////////////////////

  @Post('/v1')
  async createOnChainTransaction(
    @Body() req: OnChainTransactionV1CreateReq,
  ): Promise<void> {
    this.logger.log('createOnChainTransaction');

    const createRes = await safe(this.onChainTransactionService.createOnChainTransaction(req));
    if (!createRes.success) {
      throw new InternalServerErrorException('Failed to create OnChainTransaction', {
        description: 'Failed to create OnChainTransaction',
      });
    }
  }

  @Post('/v1:batch')
  async batchCreateOnChainTransaction(
    @Body() req: OnChainTransactionV1BatchCreateReq,
  ): Promise<void> {
    this.logger.log('batchCreateOnChainTransaction');

    this.onChainTransactionService.batchCreateOnChainTransaction(req);
  }

  @Get('/v1/:txPublicKey')
  async getOnChainTransaction(
    @Param('txPublicKey') txPublicKey: string,
  ): Promise<OnChainTransactionV1GetResp> {
    this.logger.log('getOnChainTransaction');

    const record = await this.onChainTransactionService.getOnChainTransaction(
      txPublicKey,
    );
    if (!record) {
      throw new NotFoundException('OnChainTransaction not found', {
        description: 'OnChainTransaction not found',
      });
    }

    return record;
  }
}
