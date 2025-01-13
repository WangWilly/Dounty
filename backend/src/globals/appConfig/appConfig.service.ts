// import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class GlobalAppConfigService {
  getUnstructedAppConfig(): Record<string, any> {
    // const { NODE_ENV } = process.env;
    // const ENV_MAP: Record<string, string> = {
    //   production: 'prod',
    //   development: 'dev',
    //   test: 'test',
    // };
    // const envFile = `.env.${ENV_MAP[NODE_ENV as string] ?? NODE_ENV}`;

    let CONFIGS: Record<string, any> = {};
    try {
      CONFIGS = {
        // ...(dotenv.config({path: path.resolve(PROJECT_ROOT, `${envFile}.env`).parsed ?? {}),
        ...process.env,
      };

      return CONFIGS;
    } catch (error) {
      console.error(error);
      process.abort();
    }
  }
}
