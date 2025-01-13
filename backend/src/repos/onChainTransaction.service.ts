import { Injectable } from '@nestjs/common';
import { GlobalPrismaService } from '../globals/prismaDb/prismaDb.service';

import type { Prisma } from '@prisma/client';
import { OnChainTransactionWhereUniqueInputObjectSchema } from 'src/models/schemas/objects/OnChainTransactionWhereUniqueInput.schema';

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class OnChainTransactionRepoService {
  constructor(private prisma: GlobalPrismaService) {}

  // CRUD operations
  async create(data: Prisma.OnChainTransactionCreateInput) {
    const onChainTransaction = await this.prisma.onChainTransaction.create({
      data,
    });
    return onChainTransaction;
  }

  async upsert(data: Prisma.OnChainTransactionUpdateInput) {
    OnChainTransactionWhereUniqueInputObjectSchema.parse(data);

    const onChainTransaction = await this.prisma.onChainTransaction.upsert({
      where: { publicKey: data.publicKey?.toString() },
      update: data,
      create: data as Prisma.OnChainTransactionCreateInput,
    });
    return onChainTransaction;
  }
}
