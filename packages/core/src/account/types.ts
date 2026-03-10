import type { TigerMarket } from '../types.js';

export interface ManagedAccountsParams {
  account?: string;
  lang?: string;
}

/**
 * The type of the response is string:
 *
 * Example of the response after `JSON.parse`:
 * ```json
 * {
 *   "items": [
 *     {
 *       "account": "",
 *       "capability": "",
 *       "accountType": "",
 *       "status": ""
 *     }
 *   ]
 * }
 * ```
 */
export type ManagedAccountsResponse = string;

export interface PrimeAssetsParams {
  account: string;
  base_currency?: string;
  consolidated?: boolean;
  lang?: string;
}

export interface PrimeAssetsResponse {
  accountId: string;
  updateTimestamp: number;
  segments: Array<{
    capability: string;
    category: string;
    currency: string;
    cashBalance: number;
    cashAvailableForTrade: number;
    grossPositionValue: number;
    equityWithLoan: number;
    netLiquidation: number;
    initMargin: number;
    maintainMargin: number;
    overnightMargin: number;
    unrealizedPL: number;
    unrealizedPLByCostOfCarry: number;
    realizedPL: number;
    totalTodayPL: number;
    excessLiquidation: number;
    overnightLiquidation: number;
    buyingPower: number;
    lockedFunds: number;
    leverage: number;
    uncollected: number;
    currencyAssets: Array<{
      currency: string;
      cashBalance: number;
      cashAvailableForTrade: number;
      forexRate: number;
    }>;
  }>;
}

export interface AssetsParams {
  account?: string;
  sub_accounts?: string[];
  segment?: boolean;
  market_value?: boolean;
}

/**
 * The type of the response is string:
 *
 * Example of the response after `JSON.parse`:
 * ```json
 * {
 *   "items": [
 *     {
 *       "account": string;
 *       "capability": string;
 *       "accruedCash": number;
 *       "accruedDividend": number;
 *       "buyingPower": number;
 *       "equityWithLoan": number;
 *       "grossPositionValue": number;
 *       "regTEquity": number;
 *       "initMarginReq": number;
 *       "maintMarginReq": number;
 *       "availableFunds": number;
 *       "excessLiquidity": number;
 *       "cushion": number;
 *       "dayTradesRemaining": number;
 *       "realizedPnL": number;
 *       "unrealizedPnL": number;
 *       "netLiquidation": number;
 *       "cashValue": number;
 *       "currency": string;
 *       "updateTime": number;
 *       "sma": number;
 *     }
 *   ]
 * }
 * ```
 */
export type AssetsResponse = string;

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

/**
 * Example of the response after `JSON.parse`:
 * ```json
 * {
 *   "items": [
 *     {
 *       "stockId": string;
 *       "symbol": string;
 *       "localSymbol": string;
 *       "market": string;
 *       "exchange": string;
 *       "contractId": number;
 *       "secType": string;
 *       "account": string;
 *       "position": number;
 *       "averageCost": number;
 *       "unrealizedPnl": number;
 *       "realizedPnl": number;
 *       "marketValue": number;
 *       "currency": string;
 *       "multiplier": number;
 *       "salable": number;
 *       "updateTime": number;
 *       "status": number;
 *       "identifier": string;
 *       "latestPrice": number;
 *       "updateTimestamp": number;
 *     }
 *   ]
 * }
 */
export type PositionsResponse = string;

export interface AnalyticsAssetParams {
  account?: string;
  start_date?: string;
  end_date?: string;
  seg_type?: string;
  currency?: string;
  sub_account?: string;
  lang?: string;
}

export interface AnalyticsAssetResponse {
  summary: {
    pnl: number;
    pnlPercentage: number;
    annualizedReturn: number;
  };
  history: Array<{
    date: number;
    asset: number;
    pnl: number;
    pnlPercentage: number;
    cashBalance: number;
    grossPositionValue: number;
    deposit: number;
    withdrawal: number;
  }>;
}

export interface SegmentFundAvailableParams {
  from_segment?: string;
  currency?: string;
}

// TODO: FIXED
export type SegmentFundAvailableResponse = unknown;

export interface TransferSegmentFundParams {
  from_segment?: string;
  to_segment?: string;
  amount?: number;
  currency?: string;
}

// TODO: FIXED
export type TransferSegmentFundResponse = unknown;

export interface CancelSegmentFundParams {
  id?: number;
}

// TODO: FIXED
export type CancelSegmentFundResponse = unknown;

export interface SegmentFundHistoryParams {
  limit?: number;
}

// TODO: FIXED
export type SegmentFundHistoryResponse = unknown;

export interface EstimateTradableQuantityParams {
  symbol: string;
  sec_type: string;
  action: string;
  order_type: string;
  limit_price?: number;
  stop_price?: number;
  seg_type?: string;
}

// TODO: FIXED
export type EstimateTradableQuantityResponse = unknown;

export interface FundingHistoryParams {
  seg_type?: string;
}

// TODO: FIXED
export type FundingHistoryResponse = unknown;

export interface FundDetailsParams {
  seg_types: Array<'SEC' | 'FUT' | 'FUND'>;
  account?: string;
  fund_type?: string;
  currency?: string;
  start?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  secret_key?: string;
  lang?: string;
}

export interface FundDetailsResponse {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  timestamp: number;
  items: Array<{
    id: string;
    currency: string;
    type: string;
    desc: string;
    contractName: string;
    segType: string;
    amount: number;
    businessDate: string;
    updatedAt: number;
  }>;
}
