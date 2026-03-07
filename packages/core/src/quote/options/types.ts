export interface OptionExpirationsParams {
  symbols: string[];
  market?: string;
}

export interface OptionExpirationItem {
  symbol: string;
  date: string;
  timestamp: number;
  period_tag: string;
}

export type OptionExpirationsResponse = OptionExpirationItem[];

export interface OptionBriefsParams {
  identifiers: string[];
  market?: string;
  timezone?: string;
}

export interface OptionBriefItem {
  identifier: string;
  symbol: string;
  strike: string;
  bid_price: number;
  bid_size: number;
  ask_price: number;
  ask_size: number;
  latest_price: number;
  latest_time: number;
  [key: string]: unknown;
}

export type OptionBriefsResponse = OptionBriefItem[];

export interface OptionChainParams {
  symbol: string;
  expiry: string | number;
  option_filter?: unknown;
  return_greek_value?: boolean;
  market?: string;
  timezone?: string;
  [key: string]: unknown;
}

export interface OptionChainItem {
  identifier: string;
  symbol: string;
  expiry: number;
  strike: number;
  put_call: string;
  multiplier: number;
  ask_price: number;
  ask_size: number;
  bid_price: number;
  [key: string]: unknown;
}

export type OptionChainResponse = OptionChainItem[];

export interface OptionDepthParams {
  identifiers: string[];
  market: string;
  timezone?: string;
}

export interface OptionDepthResponse {
  identifier: string;
  asks: Array<[number, number, number]>;
  bids: Array<[number, number, number]>;
  [key: string]: unknown;
}

export interface OptionTradeTicksParams {
  identifiers: string[];
}

export interface OptionTradeTickItem {
  symbol: string;
  expiry: string;
  put_call: string;
  strike: number;
  time: number;
  price: number;
  volume: number;
  [key: string]: unknown;
}

export type OptionTradeTicksResponse = OptionTradeTickItem[];

export interface OptionBarsParams {
  identifiers: string[];
  begin_time?: string | number;
  end_time?: string | number;
  period?: string;
  limit?: number;
  sort_dir?: string;
  market?: string;
  timezone?: string;
}

export interface OptionBarItem {
  identifier: string;
  symbol: string;
  expiry: number;
  put_call: string;
  strike: number;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  [key: string]: unknown;
}

export type OptionBarsResponse = OptionBarItem[];

export interface OptionTimelineParams {
  identifiers: string | string[];
  market?: string;
  begin_time?: string | number;
  timezone?: string;
}

export interface OptionTimelineItem {
  identifier: string;
  symbol: string;
  put_call: string;
  expiry: number;
  strike: string;
  pre_close: number;
  volume: number;
  avg_price: number;
  price: number;
  [key: string]: unknown;
}

export type OptionTimelineResponse = OptionTimelineItem[];

export interface OptionSymbolsParams {
  market?: string;
  lang?: string;
}

export interface OptionSymbolItem {
  symbol: string;
  name: string;
  underlying_symbol: string;
  [key: string]: unknown;
}

export type OptionSymbolsResponse = OptionSymbolItem[];

export interface OptionAnalysisParams {
  symbols: Array<string | Record<string, unknown>>;
  period?: string;
  market?: string;
  lang?: string;
}

export interface OptionAnalysisItem {
  symbol: string;
  implied_vol_30_days: number;
  his_volatility: number;
  iv_his_v_ratio: number;
  call_put_ratio: number;
  iv_metric: unknown;
  [key: string]: unknown;
}

export type OptionAnalysisResponse = OptionAnalysisItem[];
