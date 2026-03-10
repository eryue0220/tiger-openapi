import { createTigerClient } from 'tiger-openapi';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(currentDir, '.env.local') });

async function probeQuoteStock() {
  const client = createTigerClient({
    tigerId: process.env.TIGER_ID,
    account: process.env.ACCOUNT,
    privateKey: process.env.PRIVATE_KEY,
  });

  const marketStatus = await client.quote.stock.getMarketStatus({ market: 'US' });
  console.log('marketStatus::', marketStatus);

  const tradingCalendar = await client.quote.stock.getTradingCalendar({
    market: 'US',
    begin_date: '2026-03-01',
    end_date: '2026-03-31',
  });
  console.log('tradingCalendar::', tradingCalendar);

  const symbols = await client.quote.stock.getSymbols({ market: 'US' });
  console.log('symbols::', symbols);

  const symbolNames = await client.quote.stock.getSymbolNames({ market: 'US' });
  console.log('symbolNames::', symbolNames);

  const symbolBriefs = await client.quote.stock.getSymbolBriefs({ symbols: ['AAPL'] });
  console.log('symbolBriefs::', symbolBriefs);

  const depthQuote = await client.quote.stock.getDepthQuote({ symbols: ['AAPL'], market: 'US' });
  console.log('depthQuote::', depthQuote);

  const tradeTicks = await client.quote.stock.getTradeTicks({ symbols: ['AAPL'], limit: 10 });
  console.log('tradeTicks::', tradeTicks);

  const bars = await client.quote.stock.getBars({ symbols: ['AAPL'], period: 'day', limit: 10 });
  console.log('bars::', bars.data[0].items);

  const barsByPage = await client.quote.stock.getBarsByPage({
    symbols: ['AAPL'],
    period: 'day',
    page_size: 10,
    total: 10,
  });
  console.log('barsByPage::', barsByPage.data[0].items);

  const timeline = await client.quote.stock.getTimeline({ symbols: ['AAPL'] });
  console.log('timeline::', timeline);

  const timelineHistory = await client.quote.stock.getTimelineHistory({
    symbols: ['AAPL'],
    date: '2026-03-09',
  });
  console.log('timelineHistory::', timelineHistory.data[0].items);

  const stockDelayBriefs = await client.quote.stock.getStockDelayBriefs({ symbols: ['AAPL'] });
  console.log('stockDelayBriefs::', stockDelayBriefs);

  const tradeMetas = await client.quote.stock.getTradeMetas({ symbols: ['AAPL'] });
  console.log('tradeMetas::', tradeMetas);

  const capitalFlow = await client.quote.stock.getCapitalFlow({
    symbol: 'AAPL',
    market: 'US',
    period: 'day',
    limit: 10,
  });
  console.log('capitalFlow::', capitalFlow);

  const capitalDistribution = await client.quote.stock.getCapitalDistribution({
    symbol: 'AAPL',
    market: 'US',
  });
  console.log('capitalDistribution::', capitalDistribution);

  // only HK stock
  const stockBroker = await client.quote.stock.getStockBroker({ symbol: '09988', limit: 10 });
  console.log('stockBroker::', stockBroker);

  // only HK market
  const brokerHold = await client.quote.stock.getBrokerHold({ market: 'HK', limit: 10, page: 1 });
  console.log('brokerHold::', brokerHold.data.items[0]);

  // only HK market
  const tradeRank = await client.quote.stock.getTradeRank({ market: 'HK' });
  console.log('tradeRank::', tradeRank);
}

async function main() {
  await probeQuoteStock();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
