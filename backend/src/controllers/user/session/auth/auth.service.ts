import { Injectable, Logger } from '@nestjs/common';
import { AccountRepoService } from '../../../../repos/account.service';
import { safe } from '../../../../utils/exception';
import { LocalValidateV1Resp } from './dto';
import * as bcrypt from 'bcrypt';

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(private readonly accountRepoService: AccountRepoService) {}

  async validateUser(email: string, password: string): Promise<LocalValidateV1Resp> {
    this.logger.log('validateUser');

    const getRes = await safe(this.accountRepoService.getByEmail(email));
    if (!getRes.success) {
      this.logger.error(getRes.error);
      return {
        status: false,
        message: getRes.error,
        token: '',
      }
    }

    if (getRes.data.id === null) {
      this.logger.error('User not found');
      return {
        status: false,
        message: 'User not found',
        token: '',
      }
    }

    const isMatch = bcrypt.compareSync(password, getRes.data.password);
    if (!isMatch) {
      this.logger.error('Password incorrect');
      return {
        status: false,
        message: 'Password incorrect',
        token: '',
      }
    }

    return {
      status: true,
      message: '',
      token: 'tbd',
    }
  }
}
