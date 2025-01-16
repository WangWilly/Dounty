import {
  Controller,
  Post,
  Body,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { SignatureService } from './signature.service';

import {
  SignatureV1CreateReq,
  SignatureV1CreateResp,
  SignatureV1ListReq,
  SignatureV1ListResp,
} from './dtos/signature';

////////////////////////////////////////////////////////////////////////////////

@Controller('/api/signature')
export class SignatureController {
  private readonly logger = new Logger('SignatureController');

  constructor(private readonly signatureService: SignatureService) {}

  //////////////////////////////////////////////////////////////////////////////

  @Post('/v1')
  async createSignature(
    @Body() req: SignatureV1CreateReq,
  ): Promise<SignatureV1CreateResp> {
    this.logger.log('createSignature');

    return this.signatureService.createSignature(req);
  }

  @Post('/v1/listByIxBase64')
  async listByIxBase64(
    @Body() req: SignatureV1ListReq,
  ): Promise<SignatureV1ListResp> {
    this.logger.log('listByIxBase64');

    const res = await this.signatureService.listSignaturesByIxBase64(
      req.ixBase64,
    );
    if (!res || !res.signatures.length) {
      this.logger.error('signature not found');

      throw new NotFoundException('signature not found', {
        description: 'signature not found',
      });
    }

    return res;
  }
}
