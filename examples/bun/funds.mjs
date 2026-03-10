import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env.local', import.meta.url).pathname });

async function probeQuoteFunds() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
  });

  const symbols = await client.quote.funds.getFundSymbols();
  console.log('symbols::', symbols);

  const fundContracts = await client.quote.funds.getFundContracts({
    symbols: ['510300'],
  });
  console.log('fundContracts::', fundContracts);

  const fundQuote = await client.quote.funds.getFundQuote({
    symbols: ['510300'],
  });
  console.log('fundQuote::', fundQuote);

  const fundHistoryQuote = await client.quote.funds.getFundHistoryQuote({
    symbols: ['510300'],
    begin_time: '2026-03-01',
    end_time: '2026-03-10',
    limit: 20,
  });
  console.log('fundHistoryQuote::', fundHistoryQuote);
}

async function main() {
  await probeQuoteFunds();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
