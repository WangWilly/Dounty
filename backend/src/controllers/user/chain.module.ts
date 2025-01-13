import { Module } from '@nestjs/common';

import { GlobalAppConfigModule } from '../../globals/appConfig/appConfig.module';
import { GlobalPrismaModule } from '../../globals/prismaDb/prismaDb.module';

import { OnChainTransactionService } from './onChainTransaction/onChainTransaction.service';
import { OnChainTransactionController } from './onChainTransaction/onChainTransaction.controller';

////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [GlobalPrismaModule, GlobalAppConfigModule],
  providers: [OnChainTransactionService],
  controllers: [OnChainTransactionController],
})
export class ChainModule {}
