import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env.local', import.meta.url).pathname });

async function main() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
  });

  const optionExpirations = await client.quote.options.getOptionExpirations({
    symbols: ['SPY'],
    market: 'US',
  });
  console.log('optionExpirations::', optionExpirations.data[0].timestamps[1]);

  const optionBriefs = await client.quote.options.getOptionBriefs({
    option_basic: [
      {
        symbol: 'SPY',
        expiry: optionExpirations.data[0].timestamps[1],
        right: 'CALL',
      },
    ],
  });
  console.log('optionBriefs::', optionBriefs);

  const optionChain = await client.quote.options.getOptionChain({
    option_basic: [
      {
        symbol: 'SPY',
        expiry: optionExpirations.data[0].timestamps[0],
        right: 'CALL',
        strike: '240.0',
      },
    ],
    return_greek_value: true,
  });
  console.log(
    'example::optionChain::',
    optionExpirations.data[0].timestamps[0],
    optionChain.data[0].items[optionChain.data[0].items.length - 2]
  );

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

  const optionSymbols = await client.quote.options.getOptionSymbols();
  console.log('optionSymbols::', optionSymbols);

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
