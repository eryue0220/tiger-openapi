import { describe, expect, it } from 'vitest';

import { TigerClient } from '../src/index.js';

describe('@tiger-openapi/core', () => {
  it('mounts quote methods on the client instance', async () => {
    const abortController = new AbortController();
    const originalFetch = globalThis.fetch;

    globalThis.fetch = (async (_input, init) =>
      new Response(
        JSON.stringify({
          tigerId: new Headers(init?.headers).get('x-tiger-id'),
          account: new Headers(init?.headers).get('x-account'),
          signalMatches: init?.signal === abortController.signal,
        }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      )) as typeof fetch;

    const client = new TigerClient({
      tigerId: '20150144',
      account: 'U123456789',
      privateKey: 'private-key',
    });

    expect(client.quote).toBeDefined();
    expect(client.trading).toBeDefined();
    expect(client.account).toBeDefined();

    globalThis.fetch = originalFetch;
  });
});
