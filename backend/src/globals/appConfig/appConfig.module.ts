import { Global, Module } from '@nestjs/common';
import { GlobalAppConfigService } from './appConfig.service';

////////////////////////////////////////////////////////////////////////////////

@Global()
@Module({
  providers: [GlobalAppConfigService],
  exports: [GlobalAppConfigService],
})
export class GlobalAppConfigModule {}
