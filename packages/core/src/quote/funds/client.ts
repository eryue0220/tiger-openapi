import type { TigerClient } from '../../tiger-client.js';

export class QuoteFundsClient {
  constructor(private readonly client: TigerClient) {}
}

export function createQuoteFundsClient(client: TigerClient): QuoteFundsClient {
  return new QuoteFundsClient(client);
}
