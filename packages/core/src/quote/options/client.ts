import { getDeviceId } from 'tiger-openapi-shared';
import type { TigerClient } from '../../tiger-client.js';
import type { TigerRequestOptions, TigerApiResponse } from '../../types.js';
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

  async getOptionExpirations(
    params: OptionExpirationsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<OptionExpirationsResponse>>> {
    const deviceId = await getDeviceId();
    const payload = await this.client.buildDefaultParams('option_expiration', params, deviceId);

    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOptionBriefs(
    params: OptionBriefsParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionBriefsResponse> {
    const deviceId = await getDeviceId();
    const payload = await this.client.buildDefaultParams('option_brief', params, deviceId);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOptionChain(
    params: OptionChainParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<OptionChainResponse>>> {
    const deviceId = await getDeviceId();
    const payload = await this.client.buildDefaultParams('option_chain', params, deviceId);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOptionDepth(
    params: OptionDepthParams,
    options: TigerRequestOptions = {}
  ): Promise<OptionDepthResponse> {
    const deviceId = await getDeviceId();
    const payload = await this.client.buildDefaultParams('option_depth', params, deviceId);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOptionTradeTicks(
    params: OptionTradeTicksParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<OptionTradeTicksResponse>>> {
    const deviceId = await getDeviceId();
    const payload = await this.client.buildDefaultParams('option_trade_tick', params, deviceId);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOptionBars(
    params: OptionBarsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<OptionBarsResponse>>> {
    const method = 'option_kline';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOptionTimeline(
    params: OptionTimelineParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<OptionTimelineResponse>> {
    const payload = await this.client.buildDefaultParams('option_timeline', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOptionSymbols(
    params: OptionSymbolsParams = {},
    options: TigerRequestOptions = {}
  ): Promise<OptionSymbolsResponse> {
    const payload = await this.client.buildDefaultParams('all_hk_option_symbols', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOptionAnalysis(
    params: OptionAnalysisParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<OptionAnalysisResponse>> {
    const deviceId = await getDeviceId();
    const payload = await this.client.buildDefaultParams('option_analysis', params, deviceId);
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
