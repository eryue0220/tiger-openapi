import { createTigerClient } from 'npm:tiger-openapi';
import { loadEnv } from './_env.ts';

async function probeQuoteCrypto() {
  const env = await loadEnv(new URL('./.env.local', import.meta.url));

  const client = createTigerClient({
    tigerId: env.TIGER_ID,
    account: env.ACCOUNT,
    privateKey: env.PRIVATE_KEY,
  });

  const symbols = await client.quote.crypto.getSymbols();
  console.log('symbols::', symbols);

  const ccBriefs = await client.quote.crypto.getCcBriefs({ symbols: ['BTC', 'ETH'] });
  console.log('ccBriefs::', ccBriefs);

  const bars = await client.quote.crypto.getBars({
    symbols: ['BTC'],
    period: 'day',
    limit: 10,
  });
  console.log('bars::', bars.data[0].items);

  const timeline = await client.quote.crypto.getTimeline({ symbols: ['BTC'] });
  console.log('timeline::', timeline);
}

async function main() {
  await probeQuoteCrypto();
}

main().catch((err) => {
  console.error(err);
  Deno.exit(1);
});
