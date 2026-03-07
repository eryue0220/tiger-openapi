import type { TigerClient } from '../../tiger-client.js';

export class QuoteOptionsClient {
  constructor(private readonly client: TigerClient) {}
}

export function createQuoteOptionsClient(client: TigerClient): QuoteOptionsClient {
  return new QuoteOptionsClient(client);
}
