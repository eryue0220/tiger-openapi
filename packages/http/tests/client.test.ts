import { describe, expect, it, vi } from 'vitest';

import { createHttpClient } from '../src/index.js';

describe('@tiger-openapi/http', () => {
  it('retries on 429 and returns the successful payload', async () => {
    const originalFetch = globalThis.fetch;
    const fetchMock = vi
      .fn<[string | URL, RequestInit?], Promise<Response>>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'rate limited' }), {
          status: 429,
          headers: { 'content-type': 'application/json' },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
    globalThis.fetch = (async (input, init) => fetchMock(input, init)) as typeof fetch;

    const client = createHttpClient({
      baseUrl: 'https://openapi.example.com',
      retry: {
        retries: 1,
        getDelayMs: () => 0,
      },
    });

    await expect(client.request({ path: '/quote' })).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    globalThis.fetch = originalFetch;
  });
});
