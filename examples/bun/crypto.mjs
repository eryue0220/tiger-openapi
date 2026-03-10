import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env.local', import.meta.url).pathname });

async function probeQuoteCrypto() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
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
  process.exit(1);
});
