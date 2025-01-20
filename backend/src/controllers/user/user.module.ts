import { Module } from '@nestjs/common';

import { GlobalAppConfigModule } from '../../globals/appConfig/appConfig.module';
import { GlobalPrismaModule } from '../../globals/prismaDb/prismaDb.module';

import { AuthModule } from './session/auth/auth.module';

import { OnChainTransactionRepoService } from '../../repos/onChainTransaction.service';
import { NonceAccountRepoService } from '../../repos/nonceAccount.service';
import { SignatureRepoService } from 'src/repos/signature.service';
import { AccountRepoService } from 'src/repos/account.service';

import { OnChainTransactionService } from './onChainTransaction/onChainTransaction.service';
import { OnChainTransactionController } from './onChainTransaction/onChainTransaction.controller';
import { NonceAccountService } from './nonceAccount/nonceAccount.service';
import { NonceAccountController } from './nonceAccount/nonceAccount.controller';
import { SignatureService } from './signature/signature.service';
import { SignatureController } from './signature/signature.controller';
import { AccountService } from './account/account.service';
import { AccountController } from './account/account.controller';
// import { SessionService } from './session/session.service';
import { SessionController } from './session/session.controller';


////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [GlobalPrismaModule, GlobalAppConfigModule, AuthModule],
  providers: [
    OnChainTransactionRepoService,
    OnChainTransactionService,
    NonceAccountRepoService,
    NonceAccountService,
    SignatureRepoService,
    SignatureService,

    AccountRepoService,
    AccountService,
    // SessionService,
  ],
  controllers: [
    OnChainTransactionController,
    NonceAccountController,
    SignatureController,
    AccountController,
    SessionController,
  ],
})
export class UserModule {}
