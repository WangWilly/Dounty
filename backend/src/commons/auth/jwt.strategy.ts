
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IsString } from 'class-validator';
import { GlobalAppConfigService } from '../../globals/appConfig/appConfig.service';
import { plainToInstance } from 'class-transformer';
import { JwtPayload, JwtValidateV1Resp } from './dto';

////////////////////////////////////////////////////////////////////////////////

class JwtStrategyConfigSchema {
  @IsString()
  JWT_SECRET!: string;
}

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: GlobalAppConfigService) {
    // setup config
    const cfg = plainToInstance(
      JwtStrategyConfigSchema,
      configService.getUnstructedAppConfig(),
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtValidateV1Resp> {
    return { userId: payload.sub, email: payload.email };
  }
}
