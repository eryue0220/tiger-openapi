import { describe, expect, it } from 'vitest';

import { TigerClient, createTigerClient } from '../src/index.ts';

describe('tiger-openapi', () => {
  it('exposes the node entry from the root package', () => {
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
