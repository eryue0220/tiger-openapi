import { describe, expect, it } from 'vitest';

import { TigerClient, createTigerClient } from '../src/browser.ts';

describe('tiger-openapi/browser', () => {
  it('exposes the browser subpath entry', () => {
    const client = createTigerClient({
      tigerId: '20150144',
      account: 'U123456789',
      privateKey: 'private-key',
    });

    expect(client).toBeInstanceOf(TigerClient);
    expect(client.quote).toBeDefined();
    expect(TigerClient.version).toBeTypeOf('string');
  });
});
