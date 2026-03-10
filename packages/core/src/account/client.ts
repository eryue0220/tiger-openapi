import type { TigerClient } from '../tiger-client.js';
import type { TigerRequestOptions, TigerApiResponse } from '../types.js';
import type {
  ManagedAccountsParams,
  ManagedAccountsResponse,
  PrimeAssetsParams,
  PrimeAssetsResponse,
  AssetsParams,
  AssetsResponse,
  PositionsParams,
  PositionsResponse,
  AnalyticsAssetParams,
  AnalyticsAssetResponse,
  SegmentFundAvailableParams,
  SegmentFundAvailableResponse,
  TransferSegmentFundParams,
  TransferSegmentFundResponse,
  CancelSegmentFundParams,
  CancelSegmentFundResponse,
  SegmentFundHistoryParams,
  SegmentFundHistoryResponse,
  EstimateTradableQuantityParams,
  EstimateTradableQuantityResponse,
  FundingHistoryParams,
  FundingHistoryResponse,
  FundDetailsParams,
  FundDetailsResponse,
} from './types.js';

export class AccountClient {
  constructor(private readonly client: TigerClient) {}

  async getManagedAccounts(
    params: ManagedAccountsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<ManagedAccountsResponse>> {
    const payload = await this.client.buildDefaultParams('accounts', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getPrimeAssets(
    params: PrimeAssetsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<PrimeAssetsResponse>> {
    const payload = await this.client.buildDefaultParams('prime_assets', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getAssets(
    params: AssetsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<AssetsResponse>> {
    const payload = await this.client.buildDefaultParams('assets', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getPositions(
    params: PositionsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<PositionsResponse>> {
    const payload = await this.client.buildDefaultParams('positions', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getAnalyticsAsset(
    params: AnalyticsAssetParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<AnalyticsAssetResponse>> {
    const payload = await this.client.buildDefaultParams('analytics_asset', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getSegmentFundAvailable(
    params: SegmentFundAvailableParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<SegmentFundAvailableResponse>> {
    const payload = await this.client.buildDefaultParams('segment_fund_available', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async transferSegmentFund(
    params: TransferSegmentFundParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<TransferSegmentFundResponse>> {
    const payload = await this.client.buildDefaultParams('transfer_segment_fund', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async cancelSegmentFund(
    params: CancelSegmentFundParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<CancelSegmentFundResponse>> {
    const payload = await this.client.buildDefaultParams('cancel_segment_fund', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getSegmentFundHistory(
    params: SegmentFundHistoryParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<SegmentFundHistoryResponse>> {
    const payload = await this.client.buildDefaultParams('segment_fund_history', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getEstimateTradableQuantity(
    params: EstimateTradableQuantityParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<EstimateTradableQuantityResponse>> {
    const payload = await this.client.buildDefaultParams('estimate_tradable_quantity', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFundingHistory(
    params: FundingHistoryParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<FundingHistoryResponse>> {
    const payload = await this.client.buildDefaultParams('transfer_fund', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFundDetails(
    params: FundDetailsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<FundDetailsResponse>> {
    const payload = await this.client.buildDefaultParams('fund_details', params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createAccountClient(client: TigerClient): AccountClient {
  return new AccountClient(client);
}
