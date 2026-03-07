import type { TigerClient } from '../../tiger-client.js';

export class QuoteFundsClient {
  constructor(private readonly client: TigerClient) {
    console.log('Not implemented');
  }
}

export function createQuoteFundsClient(client: TigerClient): QuoteFundsClient {
  return new QuoteFundsClient(client);
}
