import { describe, expect, it } from 'vitest';

import { createTigerClient } from '../../src/index.js';
import { createQuoteClient } from '../../src/quote/index.js';

describe('@tiger-openapi/core', () => {
  it('mounts quote methods on the client instance', async () => {
    const quoteClient = createQuoteClient(
      createTigerClient({
        tigerId: '20150144',
        account: 'U123456789',
        privateKey: 'private-key',
      })
    );

    expect(quoteClient.common).toBeDefined();
    expect(quoteClient.crypto).toBeDefined();
    expect(quoteClient.funds).toBeDefined();
    expect(quoteClient.futures).toBeDefined();
    expect(quoteClient.options).toBeDefined();
    expect(quoteClient.stock).toBeDefined();
    expect(quoteClient.warrants).toBeDefined();
  });
});
