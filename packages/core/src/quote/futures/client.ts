import type { TigerClient } from '../../tiger-client.js';
import type { TigerApiResponse, TigerRequestOptions } from '../../types.js';
import type {
  FutureAllContractsParams,
  FutureAllContractsResponse,
  FutureBarsByPageParams,
  FutureBarsParams,
  FutureBarsResponse,
  FutureBriefParams,
  FutureBriefResponse,
  FutureContinuousContractsParams,
  FutureContinuousContractsResponse,
  FutureContractParams,
  FutureContractResponse,
  FutureContractsParams,
  FutureContractsResponse,
  FutureCurrentContractParams,
  FutureCurrentContractResponse,
  FutureDepthParams,
  FutureDepthResponse,
  FutureExchangesParams,
  FutureExchangesResponse,
  FutureTradeTicksParams,
  FutureTradeTicksResponse,
} from './types.js';

export class QuoteFuturesClient {
  constructor(private readonly client: TigerClient) {}

  async getFutureExchanges(
    params: FutureExchangesParams = {},
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureExchangesResponse>>> {
    const method = 'future_exchange';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFutureContracts(
    params: FutureContractsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureContractsResponse>>> {
    const method = 'future_contract_by_exchange_code';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getCurrentFutureContract(
    params: FutureCurrentContractParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureCurrentContractResponse>>> {
    const method = 'future_current_contract';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getAllFutureContracts(
    params: FutureAllContractsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureAllContractsResponse>>> {
    const method = 'future_contracts';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFutureContract(
    params: FutureContractParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureContractResponse>>> {
    const method = 'future_contract_by_contract_code';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFutureContinuousContracts(
    params: FutureContinuousContractsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureContinuousContractsResponse>>> {
    const method = 'future_continuous_contracts';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFutureBars(
    params: FutureBarsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureBarsResponse>>> {
    const method = 'future_kline';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFutureBarsByPage(
    params: FutureBarsByPageParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureBarsResponse>>> {
    const method = 'future_kline';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFutureTradeTicks(
    params: FutureTradeTicksParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureTradeTicksResponse>>> {
    const method = 'future_tick';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFutureBrief(
    params: FutureBriefParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<FutureBriefResponse>>> {
    const method = 'future_real_time_quote';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFutureDepth(
    params: FutureDepthParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<FutureDepthResponse>> {
    const method = 'future_depth';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createQuoteFuturesClient(client: TigerClient): QuoteFuturesClient {
  return new QuoteFuturesClient(client);
}
