import { createTigerClient, type TigerClient, type TigerClientConfig } from 'tiger-openapi';
import { loadTigerEnvConfig, type CreateClientFromEnvOptions } from './env.js';
import { loadCliConfig, saveCliConfig, CLI_CONFIG_PATH } from './config.js';

export type { TigerClient } from 'tiger-openapi';
export type { CliConfig } from './config.js';
export type { TigerEnvConfig, CreateClientFromEnvOptions } from './env.js';
export { loadCliConfig, saveCliConfig, CLI_CONFIG_PATH };
export { loadTigerEnvConfig } from './env.js';

export function createTigerClientFromEnv(options: CreateClientFromEnvOptions = {}): TigerClient {
  const baseConfig = loadTigerEnvConfig(options);

  const clientConfig: TigerClientConfig = {
    tigerId: baseConfig.tigerId,
    account: baseConfig.account,
    privateKey: baseConfig.privateKey,
    env: baseConfig.env,
  };

  return createTigerClient(clientConfig);
}
