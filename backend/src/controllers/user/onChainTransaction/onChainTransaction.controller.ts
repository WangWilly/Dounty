import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { OnChainTransactionService } from './onChainTransaction.service';

import { OnChainTransactionV1CreateReq } from './dtos/onChainTransaction.dto';

////////////////////////////////////////////////////////////////////////////////

@Controller('api/onChainTransaction')
export class OnChainTransactionController {
  constructor(
    private readonly onChainTransactionService: OnChainTransactionService,
  ) {}

  //////////////////////////////////////////////////////////////////////////////

  @Post('v1')
  async createOnChainTransaction(
    @Body() req: OnChainTransactionV1CreateReq,
  ): Promise<void> {
    this.onChainTransactionService.createOnChainTransaction(req);
  }
}
