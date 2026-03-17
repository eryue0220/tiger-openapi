#!/usr/bin/env node

import { Command } from 'commander';
import {
  createTigerClientFromEnv,
  loadTigerEnvConfig,
  loadCliConfig,
  saveCliConfig,
  CLI_CONFIG_PATH,
  type CliConfig,
} from './index.js';
import { TigerClient, type TigerClientApi, type TigerMarket } from 'tiger-openapi';

async function withClient<T>(
  opts: Partial<CliConfig>,
  fn: (client: TigerClientApi) => Promise<T>
): Promise<T> {
  const client = createTigerClientFromEnv(opts);
  try {
    return await fn(client as TigerClientApi);
  } finally {
    (client as TigerClientApi).close();
  }
}

function printJson(obj: unknown) {
  console.log(JSON.stringify(obj, null, 2));
}

const program = new Command();

program
  .name('tiger-openapi')
  .description('CLI for the Tiger OpenAPI SDK')
  .version(TigerClient.version)
  .addHelpText(
    'after',
    `

Environment variables (required):
  TIGER_ID / TIGER_OPENAPI_TIGER_ID
  TIGER_ACCOUNT / TIGER_OPENAPI_ACCOUNT
  TIGER_PRIVATE_KEY / TIGER_OPENAPI_PRIVATE_KEY

Optional:
  TIGER_ENV / TIGER_OPENAPI_ENV   (prod | us | sandbox)

Create a .env file in your project root with the above variables.
Or use: tiger-openapi config --tiger_id X --account Y --private_key Z`
  );

program
  .command('check')
  .description('Verify environment variable configuration is valid')
  .action(async () => {
    try {
      const cfg = loadTigerEnvConfig();
      createTigerClientFromEnv();

      console.log('Tiger OpenAPI configuration is valid.');
      console.log(`tigerId: ${cfg.tigerId}`);
      console.log(`account: ${cfg.account}`);
      console.log(`env: ${cfg.env}`);
      console.log(`SDK version: ${TigerClient.version}`);
    } catch (error) {
      console.error('Tiger OpenAPI configuration check failed.');
      console.error(
        error instanceof Error ? error.message : 'Unknown error while checking configuration.'
      );
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Read or update CLI configuration (stored in ~/.tiger-openapi-cli.json)')
  .option('-p, --path <path>', 'Path to .env file')
  .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
  .option('-k, --private_key <private_key>', 'Private key')
  .option('-a, --account <account>', 'Account')
  .option('-e, --env <env>', 'Environment (prod | us | sandbox)')
  .action((opts: Partial<CliConfig>) => {
    const envValues = ['prod', 'us', 'sandbox'] as const;
    if (opts.env !== undefined) {
      if (!envValues.includes(opts.env as (typeof envValues)[number])) {
        console.error(`Invalid --env. Must be one of: ${envValues.join(', ')}`);
        process.exit(1);
      }
    }
    const updates: Record<string, string | undefined> = {};
    if (opts.path !== undefined) updates.dotenvPath = opts.path;
    if (opts.tiger_id !== undefined) updates.tigerId = opts.tiger_id;
    if (opts.private_key !== undefined) updates.privateKey = opts.private_key;
    if (opts.account !== undefined) updates.account = opts.account;
    if (opts.env !== undefined) updates.env = opts.env as 'prod' | 'us' | 'sandbox';

    if (Object.keys(updates).length > 0) {
      saveCliConfig(updates);
      console.log(`Config saved to ${CLI_CONFIG_PATH}`);
    }
    const cfg = loadCliConfig();
    console.log('Current config:', JSON.stringify(cfg, null, 2));
  });

program
  .command('account')
  .description('Query account information')
  .option('-p, --path <path>', 'Path to .env file')
  .option('-t, --tiger_id <tiger_id>', 'Tiger ID (overrides config/env)')
  .option('-k, --private_key <private_key>', 'Private key (overrides config/env)')
  .option('-a, --account <account>', 'Account (overrides config/env)')
  .action(async (opts) => {
    try {
      await withClient(opts, async (client) => {
        const res = await client.account.getManagedAccounts({ account: opts.account });
        printJson(res);
      });
    } catch (error) {
      console.error('Account query failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('options')
  .description('Query options information')
  .requiredOption('-s, --symbol <symbol>', 'Option symbol (e.g. AAPL, TSLA)')
  .option('-e, --expiry <expiry>', 'Expiry date for option chain')
  .option('-p, --path <path>', 'Path to .env file')
  .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
  .option('-k, --private_key <private_key>', 'Private key')
  .option('-a, --account <account>', 'Account')
  .action(async (opts) => {
    try {
      await withClient(opts, async (client) => {
        if (opts.expiry) {
          const res = await client.quote.options.getOptionChain({
            symbol: opts.symbol,
            expiry: opts.expiry,
          });
          printJson(res);
        } else {
          const res = await client.quote.options.getOptionExpirations({ symbols: [opts.symbol] });
          printJson(res);
        }
      });
    } catch (error) {
      console.error('Options query failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('stock')
  .description('Query stock information')
  .requiredOption('-s, --symbol <symbol>', 'Stock symbol (e.g. AAPL, 00700)')
  .option('-p, --path <path>', 'Path to .env file')
  .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
  .option('-k, --private_key <private_key>', 'Private key')
  .option('-a, --account <account>', 'Account')
  .action(async (opts) => {
    try {
      await withClient(opts, async (client) => {
        const res = await client.quote.stock.getSymbolBriefs({ symbols: [opts.symbol] });
        printJson(res);
      });
    } catch (error) {
      console.error('Stock query failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('fund')
  .description('Query fund information')
  .requiredOption('-s, --symbol <symbol>', 'Fund symbol (e.g. 000001)')
  .option('-p, --path <path>', 'Path to .env file')
  .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
  .option('-k, --private_key <private_key>', 'Private key')
  .option('-a, --account <account>', 'Account')
  .action(async (opts) => {
    try {
      await withClient(opts, async (client) => {
        const res = await client.quote.funds.getFundQuote({ symbols: [opts.symbol] });
        printJson(res);
      });
    } catch (error) {
      console.error('Fund query failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('crypto')
  .description('Query crypto information')
  .requiredOption('-s, --symbol <symbol>', 'Crypto symbol (e.g. BTCUSD)')
  .option('-p, --path <path>', 'Path to .env file')
  .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
  .option('-k, --private_key <private_key>', 'Private key')
  .option('-a, --account <account>', 'Account')
  .action(async (opts) => {
    try {
      await withClient(opts, async (client) => {
        const res = await client.quote.crypto.getCcBriefs({ symbols: [opts.symbol] });
        printJson(res);
      });
    } catch (error) {
      console.error('Crypto query failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('futures')
  .description('Query futures information')
  .requiredOption('-s, --symbol <symbol>', 'Futures contract code')
  .option('-p, --path <path>', 'Path to .env file')
  .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
  .option('-k, --private_key <private_key>', 'Private key')
  .option('-a, --account <account>', 'Account')
  .action(async (opts) => {
    try {
      await withClient(opts, async (client) => {
        const res = await client.quote.futures.getFutureBrief({
          contract_codes: [opts.symbol],
        });
        printJson(res);
      });
    } catch (error) {
      console.error('Futures query failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('warrants')
  .description('Query warrants information')
  .requiredOption('-s, --symbol <symbol>', 'Warrant symbol')
  .option('-p, --path <path>', 'Path to .env file')
  .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
  .option('-k, --private_key <private_key>', 'Private key')
  .option('-a, --account <account>', 'Account')
  .action(async (opts) => {
    try {
      await withClient(opts, async (client) => {
        const res = await client.quote.warrants.getWarrantBriefs({ symbols: [opts.symbol] });
        printJson(res);
      });
    } catch (error) {
      console.error('Warrants query failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('scanner')
  .description('Run market scanner')
  .requiredOption('-m, --market <market>', 'Market (e.g. US, HK)')
  .option('--sec_type <sec_type>', 'Security type (STK, OPT, FUT, etc.)')
  .option('--page <page>', 'Page number', '1')
  .option('--page_size <page_size>', 'Page size', '20')
  .option('-p, --path <path>', 'Path to .env file')
  .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
  .option('-k, --private_key <private_key>', 'Private key')
  .option('-a, --account <account>', 'Account')
  .action(async (opts) => {
    try {
      await withClient(opts, async (client) => {
        const params = {
          market: opts.market as TigerMarket,
          page: parseInt(opts.page || '1', 10),
          page_size: parseInt(opts.page_size || '20', 10),
          ...(opts.sec_type && { sec_type: opts.sec_type }),
        };
        const res = await client.quote.scanner.getScanner(params);
        printJson(res);
      });
    } catch (error) {
      console.error('Scanner failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
