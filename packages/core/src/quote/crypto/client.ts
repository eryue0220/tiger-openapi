import type { TigerClient } from '../../tiger-client.js';

export class QuoteCryptoClient {
  constructor(private readonly client: TigerClient) {
    throw new Error('Not implemented');
  }
}

export function createQuoteCryptoClient(client: TigerClient): QuoteCryptoClient {
  return new QuoteCryptoClient(client);
}
