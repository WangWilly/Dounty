import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountRepoService } from '../../repos/account.service';
import { PassportModule } from '@nestjs/passport';
import { GlobalPrismaModule } from '../../globals/prismaDb/prismaDb.module';
import { GlobalAppConfigModule } from 'src/globals/appConfig/appConfig.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

////////////////////////////////////////////////////////////////////////////////

@Module({
  imports: [GlobalPrismaModule, PassportModule, GlobalAppConfigModule],
  providers: [AccountRepoService, AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
