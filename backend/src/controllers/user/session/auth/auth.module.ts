import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountRepoService } from '../../../../repos/account.service';
import { PassportModule } from '@nestjs/passport';
import { GlobalPrismaModule } from '../../../../globals/prismaDb/prismaDb.module';
import { LocalStrategy } from './local.strategy';

////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [GlobalPrismaModule, PassportModule],
  providers: [AccountRepoService, AuthService, LocalStrategy],
})
export class AuthModule {}
