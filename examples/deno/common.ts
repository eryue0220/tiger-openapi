import { createTigerClient } from 'npm:tiger-openapi';
import { loadEnv } from './_env.ts';

async function main() {
  const env = await loadEnv(new URL('./.env.local', import.meta.url));

  const client = createTigerClient({
    tigerId: env.TIGER_ID,
    account: env.ACCOUNT,
    privateKey: env.PRIVATE_KEY,
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
  Deno.exit(1);
});
