import type { TigerClient } from '../../tiger-client.js';

export class QuoteWarrantsClient {
  constructor(private readonly client: TigerClient) {}
}

export function createQuoteWarrantsClient(client: TigerClient): QuoteWarrantsClient {
  return new QuoteWarrantsClient(client);
}
