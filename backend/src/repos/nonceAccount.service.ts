import { Injectable } from '@nestjs/common';
import { GlobalPrismaService } from '../globals/prismaDb/prismaDb.service';

import type { Prisma, NonceAccount } from '@prisma/client';

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class NonceAccountRepoService {
  constructor(private prisma: GlobalPrismaService) {}

  // CRUD operations
  async create(data: Prisma.NonceAccountCreateInput): Promise<NonceAccount> {
    const nonceAccount = await this.prisma.nonceAccount.create({
      data,
    });
    return nonceAccount;
  }

  async getByTxPublicKey(txPublicKey: string): Promise<NonceAccount | null> {
    const nonceAccount = await this.prisma.nonceAccount.findFirst({
      where: {
        txPublicKey,
      },
    });
    return nonceAccount;
  }
}
