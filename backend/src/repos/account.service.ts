import { Injectable } from '@nestjs/common';
import { GlobalPrismaService } from '../globals/prismaDb/prismaDb.service';

import type { Prisma, Account } from '@prisma/client';

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AccountRepoService {
  constructor(private prisma: GlobalPrismaService) {}

  // CRUD operations
  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    const account = await this.prisma.account.create({
      data,
    });
    return account;
  }

  async getById(id: string): Promise<Account> {
    const accountRes = await this.prisma.account.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!accountRes) {
      throw new Error('Account not found');
    }
    return accountRes;
  }

  async getByEmail(email: string): Promise<Account> {
    const accountRes = await this.prisma.account.findUnique({
      where: {
        email,
      },
    });

    if (!accountRes) {
      throw new Error('Account not found');
    }
    return accountRes;

    // if (!accountRes.success) {
    //   throw new Error('Db error: ' + accountRes.error);
    // }
    // if (!accountRes.data) {
    //   throw new Error('Account not found');
    // }

    // return accountRes.data;
  }
}
