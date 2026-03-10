import { createTigerClient } from 'npm:tiger-openapi';
import { loadEnv } from './_env.ts';

async function main() {
  const env = await loadEnv(new URL('./.env.local', import.meta.url));

  const client = createTigerClient({
    tigerId: env.TIGER_ID,
    account: env.ACCOUNT,
    privateKey: env.PRIVATE_KEY,
  });

  const scanner = await client.quote.scanner.getScanner({
    market: 'US',
    page: 1,
    page_size: 10,
  });
  console.log('scanner::', scanner);
}

main().catch((err) => {
  console.error(err);
  Deno.exit(1);
});
