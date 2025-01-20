import { Controller, Post, Body, Logger, UseGuards, Request, NotFoundException } from '@nestjs/common';

import {
  SessionV1CreateReq,
  SessionV1CreateResp,
} from './dtos/session.dto';
import { AuthGuard } from '@nestjs/passport';

////////////////////////////////////////////////////////////////////////////////
// TODO: use pipe

@Controller('/api/session')
export class SessionController {
  private readonly logger = new Logger('SessionController');

  constructor() {}

  //////////////////////////////////////////////////////////////////////////////

  @UseGuards(AuthGuard('local'))
  @Post('/v1')
  async createNonceAccount(
    @Request() reqCtx: any,
    @Body() req: SessionV1CreateReq,
  ): Promise<SessionV1CreateResp> {
    this.logger.log('createSession');

    if (!reqCtx.user) {
      this.logger.error('User not found');

      throw new NotFoundException('User not found');
    }

    return reqCtx.user;
  }
}
