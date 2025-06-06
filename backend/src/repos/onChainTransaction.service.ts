import { Injectable } from '@nestjs/common';
import { GlobalPrismaService } from '../globals/prismaDb/prismaDb.service';

import type { Prisma, OnChainTransaction } from '@prisma/client';

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class OnChainTransactionRepoService {
  constructor(private prisma: GlobalPrismaService) {}

  // CRUD operations
  async create(
    data: Prisma.OnChainTransactionCreateInput,
  ): Promise<OnChainTransaction> {
    const onChainTransaction = await this.prisma.onChainTransaction.create({
      data,
    });
    return onChainTransaction as OnChainTransaction;
  }

  // https://www.prisma.io/docs/orm/prisma-client/queries/crud#create-and-return-multiple-records
  async batchCreate(
    data: Prisma.OnChainTransactionCreateInput[],
  ): Promise<OnChainTransaction[]> {
    const onChainTransactions = await this.prisma.onChainTransaction.createMany(
      {
        data,
      },
    );
    return onChainTransactions as unknown as OnChainTransaction[];
  }

  async getByPublicKey(publicKey: string): Promise<OnChainTransaction> {
    const onChainTransaction = await this.prisma.onChainTransaction.findUnique({
      where: { publicKey },
    });
    if (!onChainTransaction) {
      throw new Error('OnChainTransaction not found');
    }
    return onChainTransaction;
  }

  async upsert(data: Prisma.OnChainTransactionCreateInput) {
    const onChainTransaction = await this.prisma.onChainTransaction.upsert({
      where: { publicKey: data.publicKey },
      update: data,
      create: data as Prisma.OnChainTransactionCreateInput,
    });
    return onChainTransaction;
  }
}
