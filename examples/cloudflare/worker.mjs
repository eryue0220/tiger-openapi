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
        usage: 'GET /market-status?market=US',
      });
    }

    if (url.pathname !== '/market-status') {
      return toJson({ message: 'Not found' }, { status: 404 });
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

      const marketStatus = await client.quote.stock.getMarketStatus({ market });
      return toJson(marketStatus);
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
