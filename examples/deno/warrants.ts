import { createTigerClient } from 'npm:tiger-openapi';
import { loadEnv } from './_env.ts';

async function probeQuoteWarrants() {
  const env = await loadEnv(new URL('./.env.local', import.meta.url));

  const client = createTigerClient({
    tigerId: env.TIGER_ID,
    account: env.ACCOUNT,
    privateKey: env.PRIVATE_KEY,
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
  Deno.exit(1);
});
