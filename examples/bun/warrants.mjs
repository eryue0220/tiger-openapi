import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env.local', import.meta.url).pathname });

async function probeQuoteWarrants() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
  });

  const warrantBriefs = await client.quote.warrants.getWarrantBriefs({
    symbols: ['29145'],
  });
  console.log('warrantBriefs::', warrantBriefs);

  const warrantFilter = await client.quote.warrants.getWarrantFilter({
    symbol: '00700',
    page: 1,
    page_size: 10,
  });
  console.log('warrantFilter::', warrantFilter);
}

async function main() {
  await probeQuoteWarrants();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
