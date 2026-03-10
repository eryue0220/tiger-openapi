import type { TigerClient } from '../../tiger-client.js';
import type { TigerApiResponse, TigerRequestOptions } from '../../types.js';
import type {
  WarrantBriefsParams,
  WarrantBriefsResponse,
  WarrantFilterParams,
  WarrantFilterResponse,
} from './types.js';

export class QuoteWarrantsClient {
  constructor(private readonly client: TigerClient) {}

  async getWarrantBriefs(
    params: WarrantBriefsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<WarrantBriefsResponse>>> {
    const method = 'warrant_real_time_quote';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getWarrantFilter(
    params: WarrantFilterParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<WarrantFilterResponse>> {
    const method = 'warrant_filter';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createQuoteWarrantsClient(client: TigerClient): QuoteWarrantsClient {
  return new QuoteWarrantsClient(client);
}
