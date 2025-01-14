import { Module } from '@nestjs/common';

import { GlobalAppConfigModule } from '../../globals/appConfig/appConfig.module';
import { GlobalPrismaModule } from '../../globals/prismaDb/prismaDb.module';

import { OnChainTransactionRepoService } from '../../repos/onChainTransaction.service';
import { NonceAccountRepoService } from '../../repos/nonceAccount.service';

import { OnChainTransactionService } from './onChainTransaction/onChainTransaction.service';
import { OnChainTransactionController } from './onChainTransaction/onChainTransaction.controller';
import { NonceAccountService } from './nonceAccount/nonceAccount.service';
import { NonceAccountController } from './nonceAccount/nonceAccount.controller';

////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [GlobalPrismaModule, GlobalAppConfigModule],
  providers: [
    OnChainTransactionRepoService,
    OnChainTransactionService,
    NonceAccountRepoService,
    NonceAccountService,
  ],
  controllers: [OnChainTransactionController, NonceAccountController],
})
export class UserModule {}
