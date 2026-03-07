import { describe, expect, it } from 'vitest';

import { TigerClient } from '../src/index.js';

describe('@tiger-openapi/browser', () => {
  it('supports new TigerClient() and quote methods in browser entry', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (_input, init) =>
      new Response(JSON.stringify({ tigerId: new Headers(init?.headers).get('x-tiger-id') }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })) as typeof fetch;
    const client = new TigerClient({
      tigerId: '20150144',
      account: 'U123456789',
      privateKey: 'private-key',
      http: {
        baseUrl: 'https://openapi.example.com',
      },
      runtime: {
        createWebSocket: () =>
          ({
            binaryType: 'arraybuffer',
            readyState: WebSocket.OPEN,
            onopen: null,
            onerror: null,
            onclose: null,
            onmessage: null,
            send() {},
            close() {},
          }) as WebSocket,
      },
    });

    await expect(
      client.quote.options.getOptions({
        symbol: 'AAPL',
        expiry: '2025-01-17',
      })
    ).resolves.toEqual({
      tigerId: '20150144',
    });
    globalThis.fetch = originalFetch;
  });
});
