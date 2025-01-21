import {
  Controller,
  Post,
  Logger,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';

import { SessionV1CreateResp } from './dtos/session.dto';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '@prisma/client';
import { SessionService } from './session.service';

////////////////////////////////////////////////////////////////////////////////
// TODO: use pipe

@Controller('/api/session')
export class SessionController {
  private readonly logger = new Logger('SessionController');

  constructor(private readonly sessionService: SessionService) {}

  //////////////////////////////////////////////////////////////////////////////

  @UseGuards(AuthGuard('local'))
  @Post('/v1')
  async createSession(
    @Request() reqCtx: any,
    // TODO: @Body() req: SessionV1CreateReq,
  ): Promise<SessionV1CreateResp> {
    this.logger.log('createSession');

    const validateUser = reqCtx.user as Account;
    if (!validateUser) {
      this.logger.error('User not found');

      throw new NotFoundException('User not found');
    }

    const resp = this.sessionService.createJwt(validateUser);
    console.log('resp', resp);
    return resp;
  }
}
