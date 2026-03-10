import { createTigerClient } from 'tiger-openapi/browser';

function toJson(data, init = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return toJson({
        message: 'Cloudflare example is ready.',
        usage: [
          'GET /account/info',
          'GET /quote/common/permission',
          'GET /quote/stock/market-status?market=US',
          'GET /quote/options/symbols',
          'GET /quote/scanner?market=US&page=1&page_size=10',
          'GET /quote/crypto/symbols',
          'GET /quote/funds/symbols',
          'GET /quote/warrants/briefs?symbol=29145',
          'GET /quote/futures/exchanges',
        ],
      });
    }

    if (!env.TIGER_ID || !env.ACCOUNT || !env.PRIVATE_KEY) {
      return toJson(
        {
          message: 'Missing env bindings. Please configure TIGER_ID / ACCOUNT / PRIVATE_KEY.',
        },
        { status: 500 }
      );
    }

    const market = url.searchParams.get('market') || 'US';

    try {
      const client = createTigerClient({
        tigerId: env.TIGER_ID,
        account: env.ACCOUNT,
        privateKey: env.PRIVATE_KEY,
      });

      switch (url.pathname) {
        case '/account/info':
          return toJson(await client.account.getAccountInfo());
        case '/quote/common/permission':
          return toJson(await client.quote.common.getQuotePermission());
        case '/quote/stock/market-status':
          return toJson(await client.quote.stock.getMarketStatus({ market }));
        case '/quote/options/symbols':
          return toJson(await client.quote.options.getOptionSymbols());
        case '/quote/scanner': {
          const page = Number(url.searchParams.get('page') || 1);
          const pageSize = Number(url.searchParams.get('page_size') || 10);
          return toJson(
            await client.quote.scanner.getScanner({
              market,
              page,
              page_size: pageSize,
            })
          );
        }
        case '/quote/crypto/symbols':
          return toJson(await client.quote.crypto.getSymbols());
        case '/quote/funds/symbols':
          return toJson(await client.quote.funds.getFundSymbols());
        case '/quote/warrants/briefs': {
          const symbol = url.searchParams.get('symbol') || '29145';
          return toJson(await client.quote.warrants.getWarrantBriefs({ symbols: [symbol] }));
        }
        case '/quote/futures/exchanges':
          return toJson(await client.quote.futures.getFutureExchanges());
        default:
          return toJson({ message: 'Not found' }, { status: 404 });
      }
    } catch (error) {
      return toJson(
        {
          message: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  },
};
