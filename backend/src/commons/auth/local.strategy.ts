import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { safe } from '../../utils/exception';
import { Account } from '@prisma/client';

////////////////////////////////////////////////////////////////////////////////
// TODO: use pipe

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
private readonly logger = new Logger('LocalStrategy');

  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Account> {
    this.logger.log('validate');

    const userRes = await safe(this.authService.validateUser(email, password));
    if (!userRes.success) {
      this.logger.error(userRes.error);
      throw new UnauthorizedException(userRes.error);
    }

    return userRes.data;
  }
}
