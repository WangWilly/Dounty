import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { GlobalAppConfigService } from '../../../globals/appConfig/appConfig.service';

import { SessionV1CreateResp } from './dtos/session.dto';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import { JwtPayload } from '../../../commons/auth/dto';

////////////////////////////////////////////////////////////////////////////////

// TODO: to zod
class ConfigSchema {}

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class SessionService {
  constructor(
    private readonly globalAppConfigService: GlobalAppConfigService,
    private readonly jwtService: JwtService,
  ) {
    // setup config
    const cfg = plainToInstance(
      ConfigSchema,
      this.globalAppConfigService.getUnstructedAppConfig(),
    );
    const errors = validateSync(cfg);
    if (errors.length) {
      throw new Error(errors.toString());
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  async createJwt(
    user: Account,
  ): Promise<SessionV1CreateResp> {
    const payload: JwtPayload = { email: user.email, sub: user.id.toString() };
    const accessToken = this.jwtService.sign(payload);

    return {
      status: true,
      message: 'success',
      token: accessToken,
    }
  }
}
