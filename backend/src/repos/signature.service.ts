import { Injectable } from '@nestjs/common';
import { GlobalPrismaService } from '../globals/prismaDb/prismaDb.service';

import type { Prisma, Signature } from '@prisma/client';

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class SignatureRepoService {
  constructor(private prisma: GlobalPrismaService) {}

  // CRUD operations
  async create(data: Prisma.SignatureCreateInput): Promise<Signature> {
    const signature = await this.prisma.signature.create({
      data,
    });
    return signature;
  }

  async listByIxBase64(ixBase64: string): Promise<Signature[]> {
    const signatures = await this.prisma.signature.findMany({
      where: {
        serializedIxBase64: ixBase64,
      },
    });
    return signatures;
  }
}
