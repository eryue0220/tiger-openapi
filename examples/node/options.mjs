import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(currentDir, '.env.local') });

async function main() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
  });

  const optionExpirations = await client.quote.options.getOptionExpirations({
    symbols: ['AAPL'],
    market: 'US',
  });
  console.log('optionExpirations::', optionExpirations);

  const optionBriefs = await client.quote.options.getOptionBriefs({
    option_basic: [{ symbol: 'AAPL', expiry: 1773936000000, right: 'CALL', strike: '250' }],
  });
  console.log('optionBriefs::', optionBriefs);

  const optionChain = await client.quote.options.getOptionChain({
    option_basic: [{ symbol: 'AAPL', expiry: 1777003200000, right: 'CALL' }],
    return_greek_value: true,
  });
  console.log('optionChain::', optionChain);

  const optionDepth = await client.quote.options.getOptionDepth({
    options_basic: [{ symbol: 'AAPL' }],
  });
  console.log('optionDepth::', optionDepth);

  const optionTradeTicks = await client.quote.options.getOptionTradeTicks([
    {
      symbol: 'AAPL',
      expiry: '2026-03-23',
      right: 'CALL',
      strike: '250',
    },
  ]);
  console.log('optionTradeTicks::', optionTradeTicks);

  const optionBars = await client.quote.options.getOptionBars({
    option_query: [
      {
        symbol: 'AAPL',
        expiry: 1777003200000,
        right: 'CALL',
        strike: '252.5',
        begin_time: 1772323200000,
        end_time: 1773792000000,
      },
    ],
    market: 'US',
  });
  console.log('optionBars::', optionBars);

  const optionTimeline = await client.quote.options.getOptionTimeline({
    option_query: [{ symbol: 'AAPL', expiry: '2026-03-23', right: 'CALL', strike: '252.5' }],
    market: 'US',
  });
  console.log('optionTimeline::', optionTimeline);

  // const optionSymbols = await client.quote.options.getOptionSymbols();
  // console.log('optionSymbols::', optionSymbols);

  const optionAnalysis = await client.quote.options.getOptionAnalysis({
    symbols: ['AAPL'],
    period: 'day',
    market: 'US',
  });
  console.log('optionAnalysis::', optionAnalysis);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
