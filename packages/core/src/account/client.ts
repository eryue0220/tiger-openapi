import type { TigerClient } from '../tiger-client.js';

export class AccountClient {
  constructor(private readonly client: TigerClient) {}
}

export function createAccountClient(client: TigerClient): AccountClient {
  return new AccountClient(client);
}
