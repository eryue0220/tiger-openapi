import type { TigerClient } from '../../tiger-client.js';
import type { TigerRequestOptions } from '../../types.js';
import type {
  OptionAnalysisParams,
  OptionAnalysisResponse,
  OptionBarsParams,
  OptionBarsResponse,
  OptionBriefsParams,
  OptionBriefsResponse,
  OptionChainParams,
  OptionChainResponse,
  OptionDepthParams,
  OptionDepthResponse,
  OptionExpirationsParams,
  OptionExpirationsResponse,
  OptionSymbolsParams,
  OptionSymbolsResponse,
  OptionTimelineParams,
  OptionTimelineResponse,
  OptionTradeTicksParams,
  OptionTradeTicksResponse,
} from './types.js';

export class QuoteOptionsClient {
  constructor(private readonly client: TigerClient) {}

  getOptionExpirations(
    params: OptionExpirationsParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionExpirationsResponse> {
    const method = 'option_expiration';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getOptionBriefs(
    params: OptionBriefsParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionBriefsResponse> {
    const method = 'option_brief';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getOptionChain(
    params: OptionChainParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionChainResponse> {
    const method = 'option_chain';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getOptionDepth(
    params: OptionDepthParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionDepthResponse> {
    const method = 'option_depth';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getOptionTradeTicks(
    params: OptionTradeTicksParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionTradeTicksResponse> {
    const method = 'option_trade_tick';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getOptionBars(
    params: OptionBarsParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionBarsResponse> {
    const method = 'option_kline';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getOptionTimeline(
    params: OptionTimelineParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionTimelineResponse> {
    const method = 'option_timeline';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getOptionSymbols(
    params: OptionSymbolsParams = {},
    options: TigerRequestOptions = {}
  ): Promise<OptionSymbolsResponse> {
    const method = 'all_hk_option_symbols';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getOptionAnalysis(
    params: OptionAnalysisParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionAnalysisResponse> {
    const method = 'option_analysis';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createQuoteOptionsClient(client: TigerClient): QuoteOptionsClient {
  return new QuoteOptionsClient(client);
}
