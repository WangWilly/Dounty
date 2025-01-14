import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { IsOptional, IsString } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { Program } from '@coral-xyz/anchor';
import { createConnection } from '../../utils/solana/common';
import { BountyFactory } from '../../contract/types/bounty_factory';
import { getBountyFactoryProgramByConn } from '../../utils/solana/bountyFactory';

import { safe } from '../../utils/exception';
import { HttpClient } from '../../utils/httpClient';
import { SECRET_HEADER } from '../../utils/constant';
import { GlobalAppConfigService } from 'src/globals/appConfig/appConfig.service';
import {
  OnChainTransactionV1CreateReq,
  OnChainTransactionV1BatchCreateReq,
} from '../../controllers/user/onChainTransaction/dtos/onChainTransaction.dto';

// TODO: WIP
////////////////////////////////////////////////////////////////////////////////

// TODO: to zod
class ConfigSchema {
  @IsOptional()
  DEBUG = false;

  @IsString()
  @IsOptional()
  HANDLE_CRON = '*/20 * * * * *';

  @IsString()
  @IsOptional()
  SOLANA_ENDPOINT = 'https://api.devnet.solana.com';

  @IsString()
  @IsOptional()
  USER_CTRL_BASE_URL = 'http://localhost:3000/api';

  @IsString()
  @IsOptional()
  USER_CTRL_SECRET = 'bounty';
}

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class PollMultsigTxCronService {
  private readonly config: ConfigSchema;
  private readonly logger = new Logger('PollMultsigTxCronService');
  private schedulerRegistry: SchedulerRegistry = new SchedulerRegistry();
  private bountyFactoryProgram: Program<BountyFactory>;
  private userControllerClient: HttpClient;

  constructor(private readonly globalAppConfigService: GlobalAppConfigService) {
    // setup config
    const cfg = plainToInstance(
      ConfigSchema,
      this.globalAppConfigService.getUnstructedAppConfig(),
    );
    const errors = validateSync(cfg);
    if (errors.length) {
      throw new Error(errors.toString());
    }
    this.config = cfg;

    const connection = createConnection(this.config.SOLANA_ENDPOINT);
    this.bountyFactoryProgram = getBountyFactoryProgramByConn(connection);

    this.userControllerClient = new HttpClient({
      baseURL: this.config.USER_CTRL_BASE_URL,
      headers: {
        [SECRET_HEADER]: this.config.USER_CTRL_SECRET,
      },
    });
  }

  //////////////////////////////////////////////////////////////////////////////

  // onModuleInit() {
  //   // Arrange
  //   const job = new CronJob(this.config.HANDLE_CRON, () => this.handleCron());

  //   // Resolve
  //   this.schedulerRegistry.addCronJob(PollMultsigTxCronService.name, job);
  //   job.start();

  //   this.logger.debug(`cronjobs ${PollMultsigTxCronService.name} initialized`);
  // }

  onApplicationShutdown(signal: string) {
    this.logger.debug(`shutting down with signal: ${signal}`);

    for (const [key, job] of this.schedulerRegistry.getCronJobs()) {
      job.stop();
      this.schedulerRegistry.deleteCronJob(key);
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  // async handleCron() {
  //   // Setup
  //   this.logger.log(`${PollMultsigTxCronService.name} - handleCron`);

  //   // Arrange
  //   const txs = await this.bountyFactoryProgram.account.bountyV1.all([]);
  //   if (!txs.length) {
  //     this.logger.log(`no transactions to process`);
  //     return;
  //   }
  //   const req: OnChainTransactionV1BatchCreateReq = {
  //     transactions: txs.map(
  //       (tx): OnChainTransactionV1CreateReq => ({
  //         publicKey: tx.publicKey.toBase58(),
  //         serializedTx: tx.account,
  //       }),
  //     ),
  //   };

  //   const res = await safe(
  //     this.userControllerClient.post('onChainTransaction/v1:batchCreate', req),
  //   );
  //   if (!res.success) {
  //     this.logger.error(`failed to batch create txs: ${res.error}`);
  //     return;
  //   }

  //   this.logger.log(`batch created txs: ${txs.length}`);
  // }
}
