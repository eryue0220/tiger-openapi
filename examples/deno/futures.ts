import { createTigerClient } from 'npm:tiger-openapi';
import { loadEnv } from './_env.ts';

async function probeQuoteFutures() {
  const env = await loadEnv(new URL('./.env.local', import.meta.url));

  const client = createTigerClient({
    tigerId: env.TIGER_ID,
    account: env.ACCOUNT,
    privateKey: env.PRIVATE_KEY,
  });

  const futureExchanges = await client.quote.futures.getFutureExchanges();
  console.log('futureExchanges::', futureExchanges);

  const futureContracts = await client.quote.futures.getFutureContracts({
    exchange_code: 'CME',
  });
  console.log('futureContracts::', futureContracts);

  const currentFutureContract = await client.quote.futures.getCurrentFutureContract({
    type: 'ES',
  });
  console.log('currentFutureContract::', currentFutureContract);

  const allFutureContracts = await client.quote.futures.getAllFutureContracts({
    type: 'ES',
  });
  console.log('allFutureContracts::', allFutureContracts);

  const futureContract = await client.quote.futures.getFutureContract({
    contract_code: 'ESmain',
  });
  console.log('futureContract::', futureContract);

  const futureContinuousContracts = await client.quote.futures.getFutureContinuousContracts({
    type: 'ES',
  });
  console.log('futureContinuousContracts::', futureContinuousContracts);

  const futureBars = await client.quote.futures.getFutureBars({
    contract_codes: ['ESmain'],
    period: 'day',
    limit: 10,
  });
  console.log('futureBars::', futureBars);

  const futureBarsByPage = await client.quote.futures.getFutureBarsByPage({
    contract_codes: ['ESmain'],
    period: 'day',
    page_size: 10,
    total: 10,
  });
  console.log('futureBarsByPage::', futureBarsByPage);

  const futureTradeTicks = await client.quote.futures.getFutureTradeTicks({
    contract_code: 'ESmain',
    limit: 10,
  });
  console.log('futureTradeTicks::', futureTradeTicks);

  const futureBrief = await client.quote.futures.getFutureBrief({
    contract_codes: ['ESmain'],
  });
  console.log('futureBrief::', futureBrief);

  const futureDepth = await client.quote.futures.getFutureDepth({
    contract_codes: ['ESmain'],
  });
  console.log('futureDepth::', futureDepth);
}

async function main() {
  await probeQuoteFutures();
}

main().catch((err) => {
  console.error(err);
  Deno.exit(1);
});
