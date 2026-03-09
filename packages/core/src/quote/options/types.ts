import type { TigerMarket, TigerOptionRight } from '../../types.js';

export interface OptionExpirationsParams {
  symbols: Array<string>;
  market?: TigerMarket;
}

export interface OptionExpirationsResponse {
  symbol: string;
  optionSymbols: Array<string>;
  dates: Array<string>;
  periodTags: Array<string>;
  timestamps: Array<number>;
  count: number;
}

export interface OptionBriefsParams {
  option_basic: Array<{
    symbol: string;
    expiry: number;
    right: TigerOptionRight;
    strike: string | number;
  }>;
  market?: TigerMarket;
}

export interface OptionBriefsResponse {
  symbol: string;
  identifier: string;
  strike: string;
  volume: number;
  multiplier: number;
  right: TigerOptionRight;
  volatility: string;
  expiry: number;
  ratesBonds: number;
  sellingReturn: number;
}

export interface OptionChainParams {
  symbol: string;
  expiry: string | number;
  option_filter?: unknown;
  return_greek_value?: boolean;
  market?: TigerMarket;
  timezone?: string;
  [key: string]: unknown;
}

interface OptionsItem {
  identifier: string;
  strike: string;
  right: TigerOptionRight;
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
  volume: number;
  openInterest: number;
  multiplier: number;
  lastTimestamp: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface OptionChainResponse {
  symbol: string;
  expiry: string | number;
  items: Array<{ put: OptionsItem; call: OptionsItem }>;
}

export interface OptionDepthParams {
  option_basic: Array<{
    symbol: string;
    expiry: string | number;
    right: TigerOptionRight;
    strike: string | number;
  }>;
  market: TigerMarket;
  timezone?: string;
}

export interface OptionDepthResponse {
  identifier: string;
  asks: Array<[number, number, number]>;
  bids: Array<[number, number, number]>;
  [key: string]: unknown;
}

export interface OptionTradeTicksParams {
  symbol: string;
  expiry: string | number;
  right: TigerOptionRight;
  strike: string | number;
}

export interface OptionTradeTicksResponse {
  symbol: string;
  expiry: string | number;
  strike: string | number;
  right: TigerOptionRight;
  items: Array<{
    time: number;
    volume: number;
    price: number;
  }>;
}

export interface OptionBarsParams {
  option_query: Array<{
    symbol: string;
    expiry: string | number;
    right: TigerOptionRight;
    strike: string | number;
    begin_time: string | number;
    end_time: string | number;
  }>;
}

export interface OptionBarsResponse extends Omit<OptionTradeTicksResponse, 'items'> {
  period: string;
  items: Array<{
    time: number;
    volume: number;
    open: number;
    close: number;
    high: number;
    low: number;
    markPrice: number;
    midPrice: number;
    openInterest: number;
  }>;
}

export interface OptionTimelineParams {
  option_query: Array<{
    symbol: string;
    expiry: string | number;
    right: TigerOptionRight;
    strike: string;
  }>;
  market?: TigerMarket;
  begin_time?: string | number;
  timezone?: string;
}

/**
 * After JSON.parse and its representation, the response is a string.
 *
 * Example:
 * ```json
 * [
 *  {
 *    "symbol": "AAPL",
 *    "expiry": 1773374400000,
 *    "strike": "2",
 *    "right": "PUT",
 *    "openAndCloseTimeList": [[1772807400000, 1772830800000]],
 *    "minutes": []
 *  }
 * ]
 * ```
 */
export type OptionTimelineResponse = string;

export interface OptionSymbolsParams {
  market?: TigerMarket;
  lang?: string;
}

/**
 * After JSON.parse and its representation, the response is a string.
 *
 * Example:
 * ```json
 * [
 *   {
 *     "symbol": "AAPL",
 *     "name": "Apple Inc.",
 *     "underlyingSymbol": "AAPL"
 *   }
 * ]
 * ```
 */
export type OptionSymbolsResponse = string;

export interface OptionAnalysisParams {
  symbols: Array<string | Record<string, unknown>>;
  period?: string;
  market?: TigerMarket;
  lang?: string;
}

/**
 * After JSON.parse and its representation, the response is a string.
 *
 * Example:
 * ```json
 * {
 *   "symbol": "AAPL",
 *   "impliedVol30Days": 0.2,
 *   "hisVolatility": 0.2,
 *   "ivHisVRatio": 0.2,
 *   "callPutRatio": 0.2,
 *   "impliedVolMetric": {
 *      "period": "52week",
 *     "percentile": 0.8247011952191236,
 *     "rank": 0.28431943354924705
 *   }
 * }
 */
export type OptionAnalysisResponse = string;
