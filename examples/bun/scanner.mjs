import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env.local', import.meta.url).pathname });

async function main() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
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
  process.exit(1);
});
