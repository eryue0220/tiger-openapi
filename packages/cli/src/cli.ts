#!/usr/bin/env node

import { pathToFileURL } from 'node:url';
import { Command } from 'commander';
import { TigerClient, type TigerClientApi, type TigerMarket, type TigerOptionRight } from 'tiger-openapi';
import {
  createTigerClientFromEnv,
  loadTigerEnvConfig,
  loadCliConfig,
  saveCliConfig,
  CLI_CONFIG_PATH,
  type CliConfig,
} from './index.js';
import { parseOptionalNumber, parseOptionalBoolean, parseOptionalStringArray } from './utils.js';

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

function resolveAccount(opts: Partial<CliConfig>): string {
  return loadTigerEnvConfig(opts).account;
}

function addCredentialOverrideOptions(command: Command): Command {
  return command
    .option('-p, --path <path>', 'Path to .env file')
    .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
    .option('-k, --private_key <private_key>', 'Private key')
    .option('-a, --account <account>', 'Account');
}

async function runWithClientAction(
  opts: Partial<CliConfig>,
  errorMessage: string,
  action: (client: TigerClientApi) => Promise<void>
): Promise<void> {
  try {
    await withClient(opts, action);
  } catch (error) {
    console.error(errorMessage, error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

type OrderInput = Partial<CliConfig> & Record<string, string | undefined>;

function buildPlaceLikeOrderParams(opts: OrderInput) {
  return {
    account: resolveAccount(opts),
    symbol: opts.symbol,
    sec_type: opts.sec_type,
    action: opts.action!,
    order_type: opts.order_type!,
    currency: opts.currency,
    market: opts.market,
    exchange: opts.exchange,
    time_in_force: opts.time_in_force,
    total_quantity: parseOptionalNumber(opts.total_quantity),
    cash_amount: parseOptionalNumber(opts.cash_amount),
    limit_price: parseOptionalNumber(opts.limit_price),
    aux_price: parseOptionalNumber(opts.aux_price),
    trailing_percent: parseOptionalNumber(opts.trailing_percent),
    percent_offset: parseOptionalNumber(opts.percent_offset),
    trail_stop_price: parseOptionalNumber(opts.trail_stop_price),
    outside_rth: parseOptionalBoolean(opts.outside_rth),
  };
}

function buildOrderListQueryParams(opts: OrderInput) {
  return {
    account: resolveAccount(opts),
    sec_type: opts.sec_type,
    market: opts.market,
    symbol: opts.symbol,
    start_date: opts.start_date,
    end_date: opts.end_date,
    sort_by: opts.sort_by,
    seg_type: opts.seg_type,
  };
}

function resolveSymbolOrSymbols(value?: string): string | string[] {
  if (!value) {
    throw new Error('Missing required symbol value.');
  }
  const symbols = parseOptionalStringArray(value);
  if (!symbols || symbols.length === 0) {
    return value;
  }
  return symbols.length === 1 ? symbols[0] : symbols;
}

export function createProgram(): Command {
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

  const orderCommand = program
    .command('order')
    .description('Place, query, modify, and cancel orders');

  const placeOrderCommand = addCredentialOverrideOptions(
    new Command('place')
      .description('Place a new order')
      .requiredOption('--action <action>', 'Order action (e.g. BUY, SELL)')
      .requiredOption('--order_type <order_type>', 'Order type (e.g. LMT, MKT)')
      .option('-s, --symbol <symbol>', 'Symbol (e.g. AAPL, TSLA)')
      .option('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .option('--currency <currency>', 'Currency (e.g. USD, HKD)')
      .option('--market <market>', 'Market (e.g. US, HK)')
      .option('--exchange <exchange>', 'Exchange code')
      .option('--time_in_force <time_in_force>', 'Time in force (e.g. DAY, GTC)')
      .option('--total_quantity <total_quantity>', 'Order quantity')
      .option('--cash_amount <cash_amount>', 'Order cash amount')
      .option('--limit_price <limit_price>', 'Limit price')
      .option('--aux_price <aux_price>', 'Aux price (for STP/STP LMT etc.)')
      .option('--trailing_percent <trailing_percent>', 'Trailing percent')
      .option('--percent_offset <percent_offset>', 'Percent offset')
      .option('--trail_stop_price <trail_stop_price>', 'Trail stop price')
      .option('--outside_rth <outside_rth>', 'Allow outside regular trading hours (true/false)')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Place order failed:', async (client) => {
          const res = await client.order.placeOrder(buildPlaceLikeOrderParams(opts));
          printJson(res);
        });
      })
  );

  const queryOrderCommand = addCredentialOverrideOptions(
    new Command('query')
      .description('Query orders or a single order by id')
      .option('--id <id>', 'Internal order id')
      .option('--order_id <order_id>', 'Broker order id')
      .option('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .option('--market <market>', 'Market (e.g. US, HK, ALL)')
      .option('--symbol <symbol>', 'Symbol')
      .option('--start_date <start_date>', 'Start timestamp/date')
      .option('--end_date <end_date>', 'End timestamp/date')
      .option('--limit <limit>', 'Result limit')
      .option('--is_brief <is_brief>', 'Brief response for single order (true/false)')
      .option('--states <states>', 'Comma-separated states (e.g. FILLED,CANCELLED)')
      .option('--sort_by <sort_by>', 'Sort field')
      .option('--page_token <page_token>', 'Page token')
      .option('--seg_type <seg_type>', 'Segment type')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Order query failed:', async (client) => {
          const id = parseOptionalNumber(opts.id);
          const orderId = parseOptionalNumber(opts.order_id);
          if (id !== undefined || orderId !== undefined) {
            const res = await client.order.getOrder({
              account: resolveAccount(opts),
              id,
              order_id: orderId,
              is_brief: parseOptionalBoolean(opts.is_brief),
            });
            printJson(res);
            return;
          }

          const res = await client.order.getOrders({
            ...buildOrderListQueryParams(opts),
            limit: parseOptionalNumber(opts.limit),
            states: parseOptionalStringArray(opts.states),
            page_token: opts.page_token,
          });
          printJson(res);
        });
      })
  );

  const modifyOrderCommand = addCredentialOverrideOptions(
    new Command('modify')
      .description('Modify an existing order')
      .requiredOption('--id <id>', 'Internal order id')
      .option('--order_id <order_id>', 'Broker order id')
      .option('-s, --symbol <symbol>', 'Symbol')
      .option('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .option('--action <action>', 'Order action (e.g. BUY, SELL)')
      .option('--order_type <order_type>', 'Order type (e.g. LMT, MKT)')
      .option('--quantity <quantity>', 'Order quantity')
      .option('--quantity_scale <quantity_scale>', 'Order quantity scale')
      .option('--limit_price <limit_price>', 'Limit price')
      .option('--aux_price <aux_price>', 'Aux price')
      .option('--trail_stop_price <trail_stop_price>', 'Trail stop price')
      .option('--trailing_percent <trailing_percent>', 'Trailing percent')
      .option('--percent_offset <percent_offset>', 'Percent offset')
      .option('--time_in_force <time_in_force>', 'Time in force (e.g. DAY, GTC)')
      .option('--expire_time <expire_time>', 'Expire timestamp')
      .option('--outside_rth <outside_rth>', 'Allow outside regular trading hours (true/false)')
      .option('--adjust_limit <adjust_limit>', 'Adjust limit price')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Modify order failed:', async (client) => {
          const res = await client.order.modifyOrder({
            account: resolveAccount(opts),
            id: parseOptionalNumber(opts.id),
            order_id: parseOptionalNumber(opts.order_id),
            symbol: opts.symbol,
            sec_type: opts.sec_type,
            action: opts.action,
            order_type: opts.order_type,
            quantity: parseOptionalNumber(opts.quantity),
            quantity_scale: parseOptionalNumber(opts.quantity_scale),
            limit_price: parseOptionalNumber(opts.limit_price),
            aux_price: parseOptionalNumber(opts.aux_price),
            trail_stop_price: parseOptionalNumber(opts.trail_stop_price),
            trailing_percent: parseOptionalNumber(opts.trailing_percent),
            percent_offset: parseOptionalNumber(opts.percent_offset),
            time_in_force: opts.time_in_force,
            expire_time: parseOptionalNumber(opts.expire_time),
            outside_rth: parseOptionalBoolean(opts.outside_rth),
            adjust_limit: parseOptionalNumber(opts.adjust_limit),
          });
          printJson(res);
        });
      })
  );

  const openOrdersCommand = addCredentialOverrideOptions(
    new Command('open')
      .description('Query open (active) orders')
      .option('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .option('--market <market>', 'Market (e.g. US, HK, ALL)')
      .option('--symbol <symbol>', 'Symbol')
      .option('--start_date <start_date>', 'Start timestamp/date')
      .option('--end_date <end_date>', 'End timestamp/date')
      .option('--parent_id <parent_id>', 'Parent order id')
      .option('--sort_by <sort_by>', 'Sort field')
      .option('--seg_type <seg_type>', 'Segment type')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Open orders query failed:', async (client) => {
          const res = await client.order.getOpenOrders({
            ...buildOrderListQueryParams(opts),
            parent_id: parseOptionalNumber(opts.parent_id),
          });
          printJson(res);
        });
      })
  );

  const cancelledOrdersCommand = addCredentialOverrideOptions(
    new Command('cancelled')
      .description('Query cancelled (inactive) orders')
      .option('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .option('--market <market>', 'Market (e.g. US, HK, ALL)')
      .option('--symbol <symbol>', 'Symbol')
      .option('--start_date <start_date>', 'Start timestamp/date')
      .option('--end_date <end_date>', 'End timestamp/date')
      .option('--sort_by <sort_by>', 'Sort field')
      .option('--seg_type <seg_type>', 'Segment type')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Cancelled orders query failed:', async (client) => {
          const res = await client.order.getCancelledOrders(buildOrderListQueryParams(opts));
          printJson(res);
        });
      })
  );

  const filledOrdersCommand = addCredentialOverrideOptions(
    new Command('filled')
      .description('Query filled orders')
      .option('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .option('--market <market>', 'Market (e.g. US, HK, ALL)')
      .option('--symbol <symbol>', 'Symbol')
      .option('--start_date <start_date>', 'Start timestamp/date')
      .option('--end_date <end_date>', 'End timestamp/date')
      .option('--sort_by <sort_by>', 'Sort field')
      .option('--seg_type <seg_type>', 'Segment type')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Filled orders query failed:', async (client) => {
          const res = await client.order.getFilledOrders(buildOrderListQueryParams(opts));
          printJson(res);
        });
      })
  );

  const previewOrderCommand = addCredentialOverrideOptions(
    new Command('preview')
      .description('Preview a new order')
      .requiredOption('--action <action>', 'Order action (e.g. BUY, SELL)')
      .requiredOption('--order_type <order_type>', 'Order type (e.g. LMT, MKT)')
      .option('-s, --symbol <symbol>', 'Symbol (e.g. AAPL, TSLA)')
      .option('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .option('--currency <currency>', 'Currency (e.g. USD, HKD)')
      .option('--market <market>', 'Market (e.g. US, HK)')
      .option('--exchange <exchange>', 'Exchange code')
      .option('--time_in_force <time_in_force>', 'Time in force (e.g. DAY, GTC)')
      .option('--total_quantity <total_quantity>', 'Order quantity')
      .option('--cash_amount <cash_amount>', 'Order cash amount')
      .option('--limit_price <limit_price>', 'Limit price')
      .option('--aux_price <aux_price>', 'Aux price (for STP/STP LMT etc.)')
      .option('--trailing_percent <trailing_percent>', 'Trailing percent')
      .option('--percent_offset <percent_offset>', 'Percent offset')
      .option('--trail_stop_price <trail_stop_price>', 'Trail stop price')
      .option('--outside_rth <outside_rth>', 'Allow outside regular trading hours (true/false)')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Preview order failed:', async (client) => {
          const res = await client.order.previewOrder(buildPlaceLikeOrderParams(opts));
          printJson(res);
        });
      })
  );

  const transactionsCommand = addCredentialOverrideOptions(
    new Command('transactions')
      .description('Query order transactions')
      .option('--order_id <order_id>', 'Broker order id')
      .option('--symbol <symbol>', 'Symbol')
      .option('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .option('--start_date <start_date>', 'Start timestamp/date')
      .option('--end_date <end_date>', 'End timestamp/date')
      .option('--limit <limit>', 'Result limit')
      .option('--expiry <expiry>', 'Expiry for derivative contracts')
      .option('--strike <strike>', 'Strike price')
      .option('--right <right>', 'Right (CALL/PUT)')
      .option('--page_token <page_token>', 'Page token')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Transactions query failed:', async (client) => {
          const res = await client.order.getTransactions({
            account: resolveAccount(opts),
            order_id: parseOptionalNumber(opts.order_id),
            symbol: opts.symbol,
            sec_type: opts.sec_type,
            start_date: opts.start_date,
            end_date: opts.end_date,
            limit: parseOptionalNumber(opts.limit),
            expiry: opts.expiry,
            strike: opts.strike,
            right: opts.right,
            page_token: opts.page_token,
          });
          printJson(res);
        });
      })
  );

  const contractCommand = addCredentialOverrideOptions(
    new Command('contract')
      .description('Query contract information')
      .requiredOption('--symbol <symbol>', 'Symbol or comma-separated symbols')
      .option('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .option('--currency <currency>', 'Currency')
      .option('--exchange <exchange>', 'Exchange')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Contract query failed:', async (client) => {
          const res = await client.order.getContract({
            symbol: resolveSymbolOrSymbols(opts.symbol),
            sec_type: opts.sec_type,
            currency: opts.currency,
            exchange: opts.exchange,
          });
          printJson(res);
        });
      })
  );

  const contractsCommand = addCredentialOverrideOptions(
    new Command('contracts')
      .description('Query contracts by symbols and security type')
      .requiredOption('--symbols <symbols>', 'Comma-separated symbols')
      .requiredOption('--sec_type <sec_type>', 'Security type (e.g. STK, OPT, FUT)')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Contracts query failed:', async (client) => {
          const symbols = parseOptionalStringArray(opts.symbols);
          if (!symbols || symbols.length === 0) {
            throw new Error('Invalid --symbols. Provide one or more comma-separated symbols.');
          }
          const res = await client.order.getContracts({
            symbols,
            sec_type: opts.sec_type,
          });
          printJson(res);
        });
      })
  );

  const derivativeContractsCommand = addCredentialOverrideOptions(
    new Command('derivative-contracts')
      .description('Query derivative contracts')
      .requiredOption('--symbol <symbol>', 'Symbol or comma-separated symbols')
      .requiredOption('--sec_type <sec_type>', 'Security type (e.g. OPT, FUT)')
      .requiredOption('--expiry <expiry>', 'Expiry date')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Derivative contracts query failed:', async (client) => {
          const res = await client.order.getDerivativeContracts({
            symbol: resolveSymbolOrSymbols(opts.symbol),
            sec_type: opts.sec_type,
            expiry: opts.expiry,
          });
          printJson(res);
        });
      })
  );

  const cancelOrderCommand = addCredentialOverrideOptions(
    new Command('cancel')
      .description('Cancel an existing order')
      .requiredOption('--id <id>', 'Internal order id')
      .option('--order_id <order_id>', 'Broker order id')
      .action(async (opts) => {
        await runWithClientAction(opts, 'Cancel order failed:', async (client) => {
          const res = await client.order.cancelOrder({
            account: resolveAccount(opts),
            id: parseOptionalNumber(opts.id)!,
            order_id: parseOptionalNumber(opts.order_id),
          });
          printJson(res);
        });
      })
  );

  orderCommand
    .addCommand(placeOrderCommand)
    .addCommand(queryOrderCommand)
    .addCommand(modifyOrderCommand)
    .addCommand(openOrdersCommand)
    .addCommand(cancelledOrdersCommand)
    .addCommand(filledOrdersCommand)
    .addCommand(previewOrderCommand)
    .addCommand(transactionsCommand)
    .addCommand(contractCommand)
    .addCommand(contractsCommand)
    .addCommand(derivativeContractsCommand)
    .addCommand(cancelOrderCommand);

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
    .option('-m, --market <market>', 'Market (e.g. US, HK)')
    .option('-r, --right <right>', 'Option right for option chain (CALL or PUT)')
    .option('--strike <strike>', 'Strike for option chain')
    .option(
      '--return_greek_value <return_greek_value>',
      'Include greek values in option chain (true or false)'
    )
    .option('-p, --path <path>', 'Path to .env file')
    .option('-t, --tiger_id <tiger_id>', 'Tiger ID')
    .option('-k, --private_key <private_key>', 'Private key')
    .option('-a, --account <account>', 'Account')
    .action(async (opts) => {
      try {
        await withClient(opts, async (client) => {
          const market = opts.market as TigerMarket | undefined;
          if (opts.expiry) {
            const res = await client.quote.options.getOptionChain({
              option_basic: [
                {
                  symbol: opts.symbol,
                  expiry: opts.expiry,
                  right: opts.right as TigerOptionRight | undefined,
                  strike: opts.strike,
                },
              ],
              return_greek_value: parseOptionalBoolean(opts.return_greek_value),
              market,
            });
            printJson(res);
          } else {
            const res = await client.quote.options.getOptionExpirations({
              symbols: [opts.symbol],
              market,
            });
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

  return program;
}

function isExecutedDirectly(): boolean {
  const argv1 = process.argv[1];
  if (!argv1) return false;
  return import.meta.url === pathToFileURL(argv1).href;
}

if (isExecutedDirectly()) {
  createProgram().parse();
}
