import { config as loadDotenv } from 'dotenv';
import { loadCliConfig, findEnvPath } from './config.js';
import type { CliConfig } from './config.js';

export interface TigerEnvConfig {
  tigerId: string;
  account: string;
  privateKey: string;
  env?: 'prod' | 'us' | 'sandbox';
}

export interface CreateClientFromEnvOptions extends Partial<CliConfig> {
  /**
   * Optional path to a .env file.
   * If omitted, dotenv will search from cwd upward for .env until found or root.
   * If explicitly set to null, dotenv will NOT be invoked.
   */
  dotenvPath?: string | null;
}

export function loadTigerEnvConfig(options: CreateClientFromEnvOptions = {}): TigerEnvConfig {
  const cliConfig = loadCliConfig();
  const dotenvPath =
    options.dotenvPath !== undefined
      ? options.dotenvPath
      : (options.path ?? cliConfig.dotenvPath ?? cliConfig.path ?? undefined);

  if (dotenvPath !== null) {
    if (dotenvPath) {
      loadDotenv({ path: dotenvPath });
    } else {
      const envPath = findEnvPath();
      if (envPath) {
        loadDotenv({ path: envPath });
      } else {
        loadDotenv();
      }
    }
  }

  const env = process.env;

  const tigerId =
    options.tigerId ??
    options.tiger_id ??
    cliConfig.tigerId ??
    cliConfig.tiger_id ??
    env.TIGER_ID ??
    env.TIGER_OPENAPI_TIGER_ID;
  const account =
    options.account ?? cliConfig.account ?? env.TIGER_ACCOUNT ?? env.TIGER_OPENAPI_ACCOUNT;
  const privateKey =
    options.privateKey ??
    options.private_key ??
    cliConfig.privateKey ??
    cliConfig.private_key ??
    env.TIGER_PRIVATE_KEY ??
    env.TIGER_OPENAPI_PRIVATE_KEY;
  const envName = (options.env ?? cliConfig.env ?? env.TIGER_ENV ?? env.TIGER_OPENAPI_ENV) as
    TigerEnvConfig['env'] | undefined;

  const resolvedEnv: TigerEnvConfig['env'] = envName ?? 'prod';

  const missing: string[] = [];
  if (!tigerId) missing.push('TIGER_ID');
  if (!account) missing.push('TIGER_ACCOUNT');
  if (!privateKey) missing.push('TIGER_PRIVATE_KEY');

  if (missing.length > 0) {
    throw new Error(
      `Missing required Tiger OpenAPI environment variables: ${missing.join(
        ', '
      )}. Make sure they are set in your environment or .env file.`
    );
  }

  return {
    tigerId: tigerId!,
    account: account!,
    privateKey: privateKey!,
    env: resolvedEnv,
  };
}
