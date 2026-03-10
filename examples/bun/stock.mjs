import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env.local', import.meta.url).pathname });

async function main() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
  });

  const marketStatus = await client.quote.stock.getMarketStatus({ market: 'US' });
  console.log('marketStatus::', marketStatus);

  const symbolBriefs = await client.quote.stock.getSymbolBriefs({ symbols: ['AAPL'] });
  console.log('symbolBriefs::', symbolBriefs);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
