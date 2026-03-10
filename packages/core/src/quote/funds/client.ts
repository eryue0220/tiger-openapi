import type { TigerClient } from '../../tiger-client.js';
import type { TigerApiResponse, TigerRequestOptions } from '../../types.js';
import type {
  FundContractsParams,
  FundContractsResponse,
  FundHistoryQuoteParams,
  FundHistoryQuoteResponse,
  FundQuoteParams,
  FundQuoteResponse,
  FundSymbolsParams,
  FundSymbolsResponse,
} from './types.js';

export class QuoteFundsClient {
  constructor(private readonly client: TigerClient) {}

  async getFundSymbols(
    params: FundSymbolsParams = {},
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FundSymbolsResponse>>> {
    const method = 'fund_all_symbols';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFundContracts(
    params: FundContractsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FundContractsResponse>>> {
    const method = 'fund_contracts';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFundQuote(
    params: FundQuoteParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FundQuoteResponse>>> {
    const method = 'fund_quote';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFundHistoryQuote(
    params: FundHistoryQuoteParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FundHistoryQuoteResponse>>> {
    const method = 'fund_history_quote';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createQuoteFundsClient(client: TigerClient): QuoteFundsClient {
  return new QuoteFundsClient(client);
}
