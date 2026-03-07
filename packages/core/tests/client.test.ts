import { describe, expect, it } from 'vitest';

import { TigerClient } from '../src/index.js';

describe('@tiger-openapi/core', () => {
  it('mounts quote methods on the client instance', async () => {
    let connected = false;
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
      http: {
        baseUrl: 'https://openapi.example.com',
      },
      stream: {
        url: 'wss://push.example.com',
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

    expect(client.stream).toBeDefined();
    client.stream!.connect = async () => {
      connected = true;
    };

    await expect(
      client.quote.options.getOptions(
        {
          symbol: 'AAPL',
          expiry: '2025-01-17',
        },
        {
          signal: abortController.signal,
        }
      )
    ).resolves.toEqual({ tigerId: '20150144', account: 'U123456789', signalMatches: true });
    await client.connectStream();
    expect(connected).toBe(true);
    globalThis.fetch = originalFetch;
  });

  it('mounts quote, trading and account resource clients', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (input) =>
      new Response(JSON.stringify({ url: String(input) }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
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

    await expect(client.quote.futures.getContracts({ symbols: ['ES'] })).resolves.toEqual({
      url: 'https://openapi.example.com/quote/contracts?symbols=ES&secType=FUT',
    });
    await expect(client.trading.getContract({ symbol: 'AAPL' })).resolves.toEqual({
      url: 'https://openapi.example.com/trading/contract?symbol=AAPL',
    });
    await expect(client.account.getManagedAccounts()).resolves.toEqual({
      url: 'https://openapi.example.com/account/managed-accounts',
    });
    globalThis.fetch = originalFetch;
  });
});
