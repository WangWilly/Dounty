import { Module } from '@nestjs/common';

import { GlobalAppConfigModule } from '../../globals/appConfig/appConfig.module';
import { GlobalPrismaModule } from '../../globals/prismaDb/prismaDb.module';

import { OnChainTransactionRepoService } from 'src/repos/onChainTransaction.service';

import { OnChainTransactionService } from './onChainTransaction/onChainTransaction.service';
import { OnChainTransactionController } from './onChainTransaction/onChainTransaction.controller';

////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [GlobalPrismaModule, GlobalAppConfigModule],
  providers: [OnChainTransactionRepoService, OnChainTransactionService],
  controllers: [OnChainTransactionController],
})
export class UserModule {}
