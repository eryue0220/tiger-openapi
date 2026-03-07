import { describe, it } from 'vitest';

import { TigerClient } from '../src/index.js';

describe('@tiger-openapi/node', () => {
  it('supports new TigerClient() and quote methods in node entry', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (_input, init) =>
      new Response(JSON.stringify({ userAgent: new Headers(init?.headers).get('user-agent') }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })) as typeof fetch;

    const client = new TigerClient({
      tigerId: '20150144',
      account: 'U123456789',
      privateKey: 'private-key',
    });

    console.log(client.quote);

    globalThis.fetch = originalFetch;
  });
});
