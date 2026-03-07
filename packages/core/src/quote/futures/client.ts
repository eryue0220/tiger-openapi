import type { TigerClient } from '../../tiger-client.js';

export class QuoteFuturesClient {
  constructor(private readonly client: TigerClient) {}
}

export function createQuoteFuturesClient(client: TigerClient): QuoteFuturesClient {
  return new QuoteFuturesClient(client);
}
