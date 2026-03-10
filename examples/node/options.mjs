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
  process.exit(1);
});
