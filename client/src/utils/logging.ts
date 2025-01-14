import { appConfig } from "./appConfig";

////////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function log(...args: any[]) {
  if (appConfig.IS_DEV) {
    console.log(...args);
  }
}
