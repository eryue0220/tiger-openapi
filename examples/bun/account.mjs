import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('./.env.local', import.meta.url).pathname });

function assertRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function logResult(label, result) {
  console.log(`${label}::`, result?.data ?? result);
}

async function main() {
  const account = assertRequiredEnv('ACCOUNT');
  const client = createTigerClient({
    tigerId: assertRequiredEnv('TIGER_ID'),
    account,
    privateKey: assertRequiredEnv('PRIVATE_KEY'),
  });

  const managedAccounts = await client.account.getManagedAccounts({ account });
  logResult('getManagedAccounts', managedAccounts);

  const primeAssets = await client.account.getPrimeAssets({
    account,
    base_currency: 'USD',
    consolidated: true,
  });
  logResult('getPrimeAssets', primeAssets);

  const assets = await client.account.getAssets({ account, market_value: true });
  logResult('getAssets', assets);

  const positions = await client.account.getPositions({ account, market: 'US' });
  logResult('getPositions', positions);

  const analyticsAsset = await client.account.getAnalyticsAsset({
    account,
    start_date: '2026-03-01',
    end_date: '2026-03-20',
    seg_type: 'S',
    currency: 'USD',
  });
  logResult('getAnalyticsAsset', analyticsAsset);

  const segmentFundAvailable = await client.account.getSegmentFundAvailable({
    account,
    from_segment: 'SEC',
    currency: 'USD',
  });
  logResult('getSegmentFundAvailable', segmentFundAvailable);

  const segmentFundHistory = await client.account.getSegmentFundHistory({ account, limit: 10 });
  logResult('getSegmentFundHistory', segmentFundHistory);

  const estimateTradableQuantity = await client.account.getEstimateTradableQuantity({
    account,
    symbol: 'AAPL',
    sec_type: 'STK',
    action: 'BUY',
    order_type: 'LMT',
    limit_price: 1,
    seg_type: 'SEC',
  });
  logResult('getEstimateTradableQuantity', estimateTradableQuantity);

  const fundingHistory = await client.account.getFundingHistory({ account, seg_type: 'SEC' });
  logResult('getFundingHistory', fundingHistory);

  const fundDetails = await client.account.getFundDetails({
    account,
    seg_types: ['SEC'],
    limit: 20,
  });
  logResult('getFundDetails', fundDetails);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
