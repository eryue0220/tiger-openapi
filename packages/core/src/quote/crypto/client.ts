import type { TigerClient } from '../../tiger-client.js';

export class QuoteCryptoClient {
  constructor(private readonly client: TigerClient) {
    console.log('Not implemented');
  }
}

export function createQuoteCryptoClient(client: TigerClient): QuoteCryptoClient {
  return new QuoteCryptoClient(client);
}
