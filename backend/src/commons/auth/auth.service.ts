import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { AccountRepoService } from '../../repos/account.service';
import { safe } from '../../utils/exception';
import * as bcrypt from 'bcrypt';
import { Account } from '@prisma/client';

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(private readonly accountRepoService: AccountRepoService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Account> {
    this.logger.log('validateUser');

    const getRes = await safe(this.accountRepoService.getByEmail(email));
    if (!getRes.success) {
      this.logger.error(getRes.error);
      throw new InternalServerErrorException(getRes.error);
    }

    if (getRes.data.id === null) {
      this.logger.error('User not found');
      throw new NotFoundException('User not found');
    }

    const isMatch = bcrypt.compareSync(password, getRes.data.password);
    if (!isMatch) {
      this.logger.error('Password incorrect');
      throw new NotFoundException('Password incorrect');
    }

    return getRes.data;
  }
}
