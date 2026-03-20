import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(currentDir, '.env.local') });

async function probeQuoteCrypto() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
  });

  const symbols = await client.quote.crypto.getSymbols({ market: 'US' });
  console.log('symbols::', symbols);

  const ccBriefs = await client.quote.crypto.getCcBriefs({ symbols: ['BTC', 'ETH'] });
  console.log('ccBriefs::', ccBriefs);

  const bars = await client.quote.crypto.getBars({
    symbols: ['BTC'],
    period: 'day',
  });
  console.log('bars::', bars);

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
