import { createTigerClient } from 'npm:tiger-openapi';
import { loadEnv } from './_env.ts';

async function main() {
  const env = await loadEnv(new URL('./.env.local', import.meta.url));

  const client = createTigerClient({
    tigerId: env.TIGER_ID,
    account: env.ACCOUNT,
    privateKey: env.PRIVATE_KEY,
  });

  const optionExpirations = await client.quote.options.getOptionExpirations({
    symbol: 'AAPL',
    expiry: '2026-03-09',
  });
  console.log('optionExpirations::', optionExpirations);

  const optionBriefs = await client.quote.options.getOptionBriefs({
    symbol: 'AAPL',
  });
  console.log('optionBriefs::', optionBriefs);

  const optionChain = await client.quote.options.getOptionChain({
    symbol: 'AAPL',
    expiry: '2026-03-09',
  });
  console.log('optionChain::', optionChain);

  const optionDepth = await client.quote.options.getOptionDepth({
    symbol: 'AAPL',
    expiry: '2026-03-09',
  });
  console.log('optionDepth::', optionDepth);

  const optionTradeTicks = await client.quote.options.getOptionTradeTicks({
    symbol: 'AAPL',
    expiry: '2026-03-09',
  });
  console.log('optionTradeTicks::', optionTradeTicks);

  const optionBars = await client.quote.options.getOptionBars({
    symbol: 'AAPL',
    expiry: '2026-03-09',
  });
  console.log('optionBars::', optionBars);

  const optionTimeline = await client.quote.options.getOptionTimeline({
    symbol: 'AAPL',
    expiry: '2026-03-09',
  });
  console.log('optionTimeline::', optionTimeline);

  const optionSymbols = await client.quote.options.getOptionSymbols();
  console.log('optionSymbols::', optionSymbols);

  const optionAnalysis = await client.quote.options.getOptionAnalysis({
    symbol: 'AAPL',
    expiry: '2026-03-09',
  });
  console.log('optionAnalysis::', optionAnalysis);
}

main().catch((err) => {
  console.error(err);
  Deno.exit(1);
});
