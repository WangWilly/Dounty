import { Injectable } from '@nestjs/common';
import { GlobalPrismaService } from '../globals/prismaDb/prismaDb.service';

import type { Prisma } from '@prisma/client';
import { onChainTransactionWhereUniqueInputObjectSchema } from 'src/models/schemas/objects/onChainTransactionWhereUniqueInput.schema';

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class OnChainTransactionRepoService {
  constructor(private prisma: GlobalPrismaService) {}

  // CRUD operations
  async create(data: Prisma.onChainTransactionCreateInput) {
    const onChainTransaction = await this.prisma.onChainTransaction.create({ data });
    return onChainTransaction;
  }

  async upsert(data: Prisma.onChainTransactionUpdateInput) {
    onChainTransactionWhereUniqueInputObjectSchema.parse(data);

    const onChainTransaction = await this.prisma.onChainTransaction.upsert({ where: { public_key: data.public_key?.toString() }, update: data, create: data as Prisma.onChainTransactionCreateInput });
    return onChainTransaction;
  }
}
