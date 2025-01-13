import { Global, Module } from '@nestjs/common';
import { GlobalPrismaService } from './prismaDb.service';

////////////////////////////////////////////////////////////////////////////////

@Global()
@Module({
  providers: [GlobalPrismaService],
  exports: [GlobalPrismaService],
})
export class GlobalAppConfigModule {}
