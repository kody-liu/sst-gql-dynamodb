import { Config, StackContext } from 'sst/constructs';

/**
 * @param {Stack} ctx.stack
 */
export function Secrets({ stack }: StackContext) {
  const MONGO_DB_PASSWORD = new Config.Secret(stack, 'MONGO_DB_PASSWORD');
  return [MONGO_DB_PASSWORD];
}
