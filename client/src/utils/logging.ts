import { isDev } from './appConfig';

////////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function log(...args: any[]) {
  if (isDev()) {
    console.log(...args);
  }
}
