import { getDeviceId } from '@tiger-openapi/shared';
import type { TigerClient } from '../../tiger-client.js';
import type { QuoteRequestOptions } from '../shared-types.js';
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

  async grabQuotePermission(options: QuoteRequestOptions = {}): Promise<QuotePermissionResponse> {
    const deviceId = await getDeviceId();
    const payload = this.client.buildDefaultParams('grab_quote_permission', {}, deviceId);

    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getQuotePermission(options: QuoteRequestOptions = {}): Promise<void> {
    return this.client.request({
      body: {},
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getKlineQuote(
    params: GetKlineQuoteParams,
    options: QuoteRequestOptions = {}
  ): Promise<GetKlineQuoteResponse> {
    const payload = this.client.buildDefaultParams('kline_quota', params);
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
