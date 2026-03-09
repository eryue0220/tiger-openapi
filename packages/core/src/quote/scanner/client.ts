import type { TigerClient } from '../../tiger-client.js';
import { TigerApiResponse, TigerRequestOptions } from '../../types.js';
import { ScannerParams, ScannerResponse } from './types.js';

export class QuoteScannerClient {
  constructor(private readonly client: TigerClient) {}

  async getScanner(
    params: ScannerParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<ScannerResponse>> {
    const payload = await this.client.buildDefaultParams('market_scanner', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createQuoteScannerClient(client: TigerClient): QuoteScannerClient {
  return new QuoteScannerClient(client);
}
