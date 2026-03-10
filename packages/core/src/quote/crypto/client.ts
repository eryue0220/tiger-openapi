import type { TigerClient } from '../../tiger-client.js';
import type { TigerApiResponse, TigerRequestOptions } from '../../types.js';
import type {
  CryptoBarsParams,
  CryptoBarsResponse,
  CryptoBriefsParams,
  CryptoBriefsResponse,
  CryptoSymbolsResponse,
  CryptoTimelineParams,
  CryptoTimelineResponse,
} from './types.js';

export class QuoteCryptoClient {
  constructor(private readonly client: TigerClient) {}

  private withSecType<T extends { sec_type?: 'CC' }>(params: T): T & { sec_type: 'CC' } {
    return {
      ...params,
      sec_type: 'CC',
    };
  }

  async getSymbols(
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<CryptoSymbolsResponse>>> {
    const method = 'all_symbols';
    const payload = await this.client.buildDefaultParams(method, { sec_type: 'CC ' });
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getCcBriefs(
    params: CryptoBriefsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<CryptoBriefsResponse>>> {
    const method = 'quote_real_time';
    const payload = await this.client.buildDefaultParams(method, this.withSecType(params));
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getBars(
    params: CryptoBarsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<CryptoBarsResponse>>> {
    const method = 'kline';
    const payload = await this.client.buildDefaultParams(method, this.withSecType(params));
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getTimeline(
    params: CryptoTimelineParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<CryptoTimelineResponse>> {
    const method = 'timeline';
    const payload = await this.client.buildDefaultParams(method, this.withSecType(params));
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createQuoteCryptoClient(client: TigerClient): QuoteCryptoClient {
  return new QuoteCryptoClient(client);
}
