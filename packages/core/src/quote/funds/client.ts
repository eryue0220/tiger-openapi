import type { TigerClient } from '../../tiger-client.js';

export class QuoteFundsClient {
  constructor(private readonly client: TigerClient) {
    throw new Error('Not implemented');
  }
}

export function createQuoteFundsClient(client: TigerClient): QuoteFundsClient {
  return new QuoteFundsClient(client);
}
