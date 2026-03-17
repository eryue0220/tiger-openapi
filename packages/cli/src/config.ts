import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export interface CliConfig {
  dotenvPath?: string | null;
  path?: string;
  tigerId?: string;
  tiger_id?: string;
  account?: string;
  privateKey?: string;
  private_key?: string;
  env?: 'prod' | 'us' | 'sandbox';
}

export const CLI_CONFIG_PATH = join(homedir(), '.tiger-openapi-cli.json');

export function loadCliConfig(): CliConfig {
  if (!existsSync(CLI_CONFIG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CLI_CONFIG_PATH, 'utf8')) as CliConfig;
  } catch {
    return {};
  }
}

export function saveCliConfig(updates: Partial<CliConfig>): void {
  const current = loadCliConfig();
  const next = { ...current, ...updates };
  writeFileSync(CLI_CONFIG_PATH, JSON.stringify(next, null, 2));
}

export function findEnvPath(): string | null {
  let dir = process.cwd();
  while (true) {
    const envPath = join(dir, '.env');
    if (existsSync(envPath)) return envPath;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
