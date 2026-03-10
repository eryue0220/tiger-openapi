import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env.local', import.meta.url).pathname });

async function main() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
  });

  const grabQuotePermission = await client.quote.common.grabQuotePermission();
  console.log('grabQuotePermission::', grabQuotePermission);

  const quotePermission = await client.quote.common.getQuotePermission();
  console.log('quotePermission::', quotePermission);

  const klineQuote = await client.quote.common.getKlineQuote({
    symbol: 'AAPL',
    period: 'day',
    limit: 10,
  });
  console.log('klineQuote::', klineQuote);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
