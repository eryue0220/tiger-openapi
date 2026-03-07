import type { TigerClient } from '../tiger-client.js';

export class TradingClient {
  constructor(private readonly client: TigerClient) {}
}

export function createTradingClient(client: TigerClient): TradingClient {
  return new TradingClient(client);
}
