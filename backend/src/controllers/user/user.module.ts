import { Module } from '@nestjs/common';

import { GlobalAppConfigModule } from '../../globals/appConfig/appConfig.module';
import { GlobalPrismaModule } from '../../globals/prismaDb/prismaDb.module';

import { OnChainTransactionRepoService } from '../../repos/onChainTransaction.service';
import { NonceAccountRepoService } from '../../repos/nonceAccount.service';
import { SignatureRepoService } from 'src/repos/signature.service';

import { OnChainTransactionService } from './onChainTransaction/onChainTransaction.service';
import { OnChainTransactionController } from './onChainTransaction/onChainTransaction.controller';
import { NonceAccountService } from './nonceAccount/nonceAccount.service';
import { NonceAccountController } from './nonceAccount/nonceAccount.controller';
import { SignatureService } from './signature/signature.service';
import { SignatureController } from './signature/signature.controller';

////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [GlobalPrismaModule, GlobalAppConfigModule],
  providers: [
    OnChainTransactionRepoService,
    OnChainTransactionService,
    NonceAccountRepoService,
    NonceAccountService,
    SignatureRepoService,
    SignatureService,
  ],
  controllers: [
    OnChainTransactionController,
    NonceAccountController,
    SignatureController,
  ],
})
export class UserModule {}
