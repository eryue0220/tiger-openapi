import type { TigerClient } from '../../tiger-client.js';

export class QuoteStockClient {
  constructor(private readonly client: TigerClient) {}
}

export function createQuoteStockClient(client: TigerClient): QuoteStockClient {
  return new QuoteStockClient(client);
}
