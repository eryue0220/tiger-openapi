import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(currentDir, '.env.local') });

const ENABLE_WRITE = process.env.ENABLE_WRITE_ORDER_APIS === 'true';

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

async function probeOrder() {
  const account = assertRequiredEnv('ACCOUNT');
  const client = createTigerClient({
    tigerId: assertRequiredEnv('TIGER_ID'),
    account,
    privateKey: assertRequiredEnv('PRIVATE_KEY'),
  });

  // 1. getContract
  const contract = await client.order.getContract({ symbol: 'AAPL', sec_type: 'STK' });
  logResult('getContract', contract);

  // 2. getContracts
  const contracts = await client.order.getContracts({ symbols: ['AAPL'], sec_type: 'STK' });
  logResult('getContracts', contracts);

  // 3. getDerivativeContracts
  const derivativeContracts = await client.order.getDerivativeContracts({
    symbol: 'AAPL',
    sec_type: 'OPT',
    expiry: '2026-06-19',
  });
  logResult('getDerivativeContracts', derivativeContracts);

  // 4. getOrders
  const orders = await client.order.getOrders({ market: 'US', sec_type: 'STK', limit: 10 });
  logResult('getOrders', orders);

  const firstOrderId = orders?.data?.items?.[0]?.id;
  const firstOrderOrderId = orders?.data?.items?.[0]?.orderId;

  // 5. getOrder
  if (firstOrderId || firstOrderOrderId) {
    const order = await client.order.getOrder({
      account,
      id: firstOrderId,
      order_id: firstOrderOrderId,
      show_charges: false,
    });
    logResult('getOrder', order);
  } else {
    console.log('getOrder:: skipped (no existing order id found from getOrders)');
  }

  // 6. getOpenOrders
  const openOrders = await client.order.getOpenOrders({ market: 'US', sec_type: 'STK' });
  logResult('getOpenOrders', openOrders);

  // 7. getCancelledOrders
  const cancelledOrders = await client.order.getCancelledOrders({ market: 'US', sec_type: 'STK' });
  logResult('getCancelledOrders', cancelledOrders);

  // 8. getFilledOrders
  const filledOrders = await client.order.getFilledOrders({ market: 'US', sec_type: 'STK' });
  logResult('getFilledOrders', filledOrders);

  // 9. getTransactions
  const transactions = await client.order.getTransactions({ sec_type: 'STK', limit: 10 });
  logResult('getTransactions', transactions);

  // 10. previewOrder
  const previewOrder = await client.order.previewOrder({
    account,
    symbol: 'AAPL',
    sec_type: 'STK',
    market: 'US',
    currency: 'USD',
    action: 'BUY',
    order_type: 'LMT',
    limit_price: 1,
    total_quantity: 1,
    time_in_force: 'DAY',
  });
  logResult('previewOrder', previewOrder);

  if (!ENABLE_WRITE) {
    console.log('placeOrder:: skipped (set ENABLE_WRITE_ORDER_APIS=true to execute)');
    console.log('cancelOrder:: skipped (set ENABLE_WRITE_ORDER_APIS=true to execute)');
    console.log('modifyOrder:: skipped (set ENABLE_WRITE_ORDER_APIS=true to execute)');
    return;
  }

  // 11. placeOrder
  const placed = await client.order.placeOrder({
    account,
    symbol: 'AAPL',
    sec_type: 'STK',
    market: 'US',
    currency: 'USD',
    action: 'BUY',
    order_type: 'LMT',
    limit_price: 1,
    total_quantity: 1,
    time_in_force: 'DAY',
  });
  logResult('placeOrder', placed);

  const placedId = placed?.data?.id;
  const placedOrderId = placed?.data?.order_id ?? placed?.data?.orderId;

  // 12. modifyOrder
  if (placedId || placedOrderId) {
    const modified = await client.order.modifyOrder({
      account,
      id: placedId,
      order_id: placedOrderId,
      limit_price: 1.01,
      quantity: 1,
    });
    logResult('modifyOrder', modified);

    // 13. cancelOrder
    const cancelled = await client.order.cancelOrder({
      account,
      id: placedId,
      order_id: placedOrderId,
    });
    logResult('cancelOrder', cancelled);
  } else {
    console.log('modifyOrder:: skipped (no order id from placeOrder response)');
    console.log('cancelOrder:: skipped (no order id from placeOrder response)');
  }
}

async function main() {
  await probeOrder();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
