import type { TigerClient } from '../../tiger-client.js';

export class QuoteFuturesClient {
  constructor(private readonly client: TigerClient) {
    throw new Error('Not implemented');
  }
}

export function createQuoteFuturesClient(client: TigerClient): QuoteFuturesClient {
  return new QuoteFuturesClient(client);
}
