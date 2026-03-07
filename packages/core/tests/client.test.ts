import { describe, expect, it } from 'vitest';

import { TigerClient } from '../src/index.js';

describe('@tiger-openapi/core', () => {
  it('mounts quote methods on the client instance', async () => {
    const client = new TigerClient({
      tigerId: '20150144',
      account: 'U123456789',
      privateKey: 'private-key',
    });

    expect(client.quote).toBeDefined();
    expect(client.quote.common).toBeDefined();
    expect(client.quote.crypto).toBeDefined();
    expect(client.quote.funds).toBeDefined();
    expect(client.quote.futures).toBeDefined();
    expect(client.quote.options).toBeDefined();
    expect(client.quote.stock).toBeDefined();
    expect(client.quote.warrants).toBeDefined();
    expect(client.trading).toBeDefined();
    expect(client.account).toBeDefined();
  });
});
