import { getDeviceId } from 'tiger-openapi-shared';
import type { TigerClient } from '../../tiger-client.js';
import type { TigerRequestOptions, TigerApiResponse } from '../../types.js';
import type {
  GetKlineQuoteParams,
  GetKlineQuoteResponse,
  QuotePermissionResponse,
} from './types.js';

/**
 * @see https://docs-en.itigerup.com/docs/quote-common
 */
export class QuoteCommonClient {
  constructor(private readonly client: TigerClient) {}

  async grabQuotePermission(
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<QuotePermissionResponse>>> {
    const deviceId = await getDeviceId();
    const payload = await this.client.buildDefaultParams('grab_quote_permission', {}, deviceId);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getQuotePermission(
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<QuotePermissionResponse>>> {
    const deviceId = await getDeviceId();
    const payload = await this.client.buildDefaultParams('get_quote_permission', {}, deviceId);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getKlineQuote(
    params: GetKlineQuoteParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<GetKlineQuoteResponse>>> {
    const payload = await this.client.buildDefaultParams('kline_quota', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createQuoteCommonClient(client: TigerClient): QuoteCommonClient {
  return new QuoteCommonClient(client);
}
