import { Module } from '@nestjs/common';

import { GlobalAppConfigModule } from '../../globals/appConfig/appConfig.module';
import { GlobalPrismaModule } from '../../globals/prismaDb/prismaDb.module';

import { AuthModule } from '../../commons/auth/auth.module';

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
import { SessionService } from './session/session.service';
import { SessionController } from './session/session.controller';

import { JwtModule } from '@nestjs/jwt';
import { GlobalAppConfigService } from '../../globals/appConfig/appConfig.service';

////////////////////////////////////////////////////////////////////////////////

import { plainToInstance } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

class JwtConfigSchema {
  @IsString()
  JWT_SECRET!: string;

  @IsNumber()
  JWT_EXPIRES_IN: number = 3600;
}

////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [
    GlobalPrismaModule,
    GlobalAppConfigModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [GlobalAppConfigModule],
      useFactory: async (configService: GlobalAppConfigService) => {
        // setup config
        const cfg = plainToInstance(
          JwtConfigSchema,
          configService.getUnstructedAppConfig(),
        );
        return { secret: cfg.JWT_SECRET, signOptions: { expiresIn: cfg.JWT_EXPIRES_IN } };
      },
      inject: [GlobalAppConfigService],
    }),
  ],
  providers: [
    OnChainTransactionRepoService,
    OnChainTransactionService,
    NonceAccountRepoService,
    NonceAccountService,
    SignatureRepoService,
    SignatureService,

    AccountRepoService,
    AccountService,
    SessionService,
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
