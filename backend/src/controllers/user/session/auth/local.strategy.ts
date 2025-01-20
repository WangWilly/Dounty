import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LocalValidateV1Resp } from './dto';
import { AuthService } from './auth.service';

////////////////////////////////////////////////////////////////////////////////
// TODO: use pipe

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<LocalValidateV1Resp> {
    const userRes = await this.authService.validateUser(email, password);
    if (!userRes || !userRes.status) {
      throw new UnauthorizedException();
    }
    return userRes;
  }
}
