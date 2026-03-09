import type { TigerMarket } from '../types.js';

export interface ManagedAccountsParams {
  account?: string;
  lang?: string;
}

export interface ManagedAccountsResponse {
  account: string;
  capability: string;
  status: string;
  accountType: string;
}

export interface PrimeAssetsParams {
  account?: string;
  base_currency?: string;
  consolidated?: boolean;
  lang?: string;
}

export interface PrimeAssetsResponse {
  items: Array<{
    account: string;
    accruedCash: number;
    accruedDividend: number;
    availableFunds: number;
    buyingPower: number;
    capability: string;
    cashBalance: number;
    cashValue: number;
    currency: string;
    cushion: number;
    dayTradesRemaining: number;
    equityWithLoan: number;
    excessLiquidity: number;
    grossPositionValue: number;
    initMarginReq: number;
    maintMarginReq: number;
    netLiquidation: number;
    netLiquidationUncertainty: number;
    previousEquityWithLoanValue: number;
    previousNetLiquidation: number;
    realizedPnl: number;
    unrealizedPnl: number;
    regTEquity: number;
    regTMargin: number;
    SMA: number;
    segments: Array<{
      account: string;
      accruedDividend: number;
      availableFunds: number;
      cashValue: number;
      category: string;
      equityWithLoan: number;
      excessLiquidity: number;
      grossPositionValue: number;
      initMarginReq: number;
      leverage: number;
      maintMarginReq: number;
      netLiquidation: number;
      previousDayEquityWithLoan: number;
      regTEquity: number;
      regTMargin: number;
      sMA: number;
      title: string;
      tradingType: string;
      updateTime: number;
    }>;
    marketValues: Array<{
      account: string;
      accruedCash: number;
      cashBalance: number;
      currency: string;
      exchangeRate: number;
      futureOptionValue: number;
      futuresPnl: number;
      netDividend: number;
      netLiquidation: number;
      optionMarketValue: number;
      realizedPnl: number;
      stockMarketValue: number;
      unrealizedPnl: number;
      updateTime: number;
      warrantValue: number;
    }>;
  }>;
}

export interface AssetsParams {
  account?: string;
  sub_accounts?: string[];
  segment?: boolean;
  market_value?: boolean;
}

export interface AssetsResponse {}

export interface PositionsParams {
  account?: string;
  sec_type?: string;
  currency?: string;
  market?: TigerMarket | 'ALL' | string;
  symbol?: string;
  sub_accounts?: string[];
  expiry?: string;
  strike?: string | number;
  right?: string;
  asset_quote_type?: string;
  lang?: string;
}

export interface PositionsResponse {}

export interface AnalyticsAssetParams {
  account?: string;
  start_date?: string;
  end_date?: string;
  seg_type?: string;
  currency?: string;
  sub_account?: string;
  lang?: string;
}

export interface AnalyticsAssetResponse {}

export interface SegmentFundAvailableParams {
  from_segment?: string;
  currency?: string;
}

export interface SegmentFundAvailableResponse {}

export interface TransferSegmentFundParams {
  from_segment?: string;
  to_segment?: string;
  amount?: number;
  currency?: string;
}

export interface TransferSegmentFundResponse {}

export interface CancelSegmentFundParams {
  id?: number;
}

export interface CancelSegmentFundResponse {}

export interface SegmentFundHistoryParams {
  limit?: number;
}

export interface SegmentFundHistoryResponse {}

export interface EstimateTradableQuantityParams {
  symbol: string;
  sec_type: string;
  action: string;
  order_type: string;
  limit_price?: number;
  stop_price?: number;
  seg_type?: string;
}

export interface EstimateTradableQuantityResponse {}

export interface FundingHistoryParams {
  seg_type?: string;
}

export interface FundingHistoryResponse {}

export interface FundDetailsParams {
  account?: string;
  seg_types: string[];
  fund_type?: string;
  currency?: string;
  start?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  secret_key?: string;
  lang?: string;
}

export interface FundDetailsResponse {}

export interface AggregateAssetsParams {
  account?: string;
  seg_type?: string;
  base_currency?: string;
}

export interface AggregateAssetsResponse {}
