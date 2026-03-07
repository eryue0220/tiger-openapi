export interface MarketStatusParams {
  market: string;
  lang?: string;
}

export interface MarketStatusItem {
  market: string;
  trading_status: string;
  status: string;
  open_time: string | number;
  [key: string]: unknown;
}

export type MarketStatusResponse = MarketStatusItem[];

export interface TradingCalendarParams {
  market: string;
  begin_date?: string;
  end_date?: string;
}

export interface TradingCalendarItem {
  date: string;
  type: string;
  open_time?: string;
  close_time?: string;
  [key: string]: unknown;
}

export type TradingCalendarResponse = TradingCalendarItem[];

export interface SymbolsParams {
  market?: string;
  include_otc?: boolean;
}

export type SymbolsResponse = string[];

export interface SymbolNamesParams {
  market: string;
  lang?: string;
  include_otc?: boolean;
}

export type SymbolNamesResponse = Array<[string, string]>;

export interface SymbolBriefsParams {
  symbols: string[];
  include_hour_trading?: boolean;
  lang?: string;
}

export interface SymbolBriefItem {
  symbol: string;
  ask_price: number;
  ask_size: number;
  bid_price: number;
  bid_size: number;
  latest_price: number;
  latest_time: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  [key: string]: unknown;
}

export type SymbolBriefsResponse = SymbolBriefItem[];

export interface DepthQuoteParams {
  symbols: string[];
  market: string;
}

export interface DepthQuoteResponse {
  symbol: string;
  asks: Array<[number, number, number]>;
  bids: Array<[number, number, number]>;
  [key: string]: unknown;
}

export interface TradeTicksParams {
  symbols: string[];
  trade_session?: string;
  begin_index?: number;
  end_index?: number;
  limit?: number;
  lang?: string;
}

export interface TradeTickItem {
  symbol: string;
  time: number;
  price: number;
  volume: number;
  [key: string]: unknown;
}

export type TradeTicksResponse = TradeTickItem[];

export interface BarsParams {
  symbols: string[];
  period?: string;
  begin_time?: string | number;
  end_time?: string | number;
  date?: string;
  right?: string;
  limit?: number;
  lang?: string;
  page_token?: string;
  trade_session?: string;
  with_fundamental?: boolean;
}

export interface BarItem {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  next_page_token?: string;
  [key: string]: unknown;
}

export type BarsResponse = BarItem[];

export interface BarsByPageParams {
  symbol: string;
  period?: string;
  begin_time?: string | number;
  end_time?: string | number;
  total?: number;
  page_size?: number;
  right?: string;
  time_interval?: number;
  lang?: string;
  trade_session?: string;
}

export type BarsByPageResponse = BarItem[];

export interface TimelineParams {
  symbols: string[];
  include_hour_trading?: boolean;
  begin_time?: string | number;
  lang?: string;
  trade_session?: string;
}

export interface TimelineItem {
  symbol: string;
  time: number;
  price: number;
  avg_price: number;
  pre_close?: number;
  volume?: number;
  trading_session?: string;
  [key: string]: unknown;
}

export type TimelineResponse = TimelineItem[];

export interface TimelineHistoryParams {
  symbols: string[];
  date: string;
  right?: string;
  trade_session?: string;
}

export interface TimelineHistoryItem {
  symbol: string;
  time: number;
  price: number;
  avg_price: number;
  [key: string]: unknown;
}

export type TimelineHistoryResponse = TimelineHistoryItem[];

export interface StockDelayBriefsParams {
  symbols: string[];
  lang?: string;
}

export interface StockDelayBriefItem {
  symbol: string;
  pre_close: number;
  time: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
  halted: number;
  [key: string]: unknown;
}

export type StockDelayBriefsResponse = StockDelayBriefItem[];

export interface TradeMetasParams {
  symbols: string[];
}

export interface TradeMetaItem {
  symbol: string;
  lot_size: number;
  min_tick: number;
  spread_scale: number;
  [key: string]: unknown;
}

export type TradeMetasResponse = TradeMetaItem[];

export interface CapitalFlowParams {
  symbol: string;
  period: string;
  market: string;
  begin_time?: number;
  end_time?: number;
  limit?: number;
  lang?: string;
}

export interface CapitalFlowItem {
  symbol: string;
  period: string;
  time: string;
  timestamp: number;
  net_inflow: number;
  [key: string]: unknown;
}

export type CapitalFlowResponse = CapitalFlowItem[];

export interface CapitalDistributionParams {
  symbol: string;
  market: string;
  lang?: string;
}

export interface CapitalDistributionResponse {
  symbol: string;
  net_inflow: number;
  in_all: number;
  in_big: number;
  in_mid: number;
  in_small: number;
  out_all: number;
  out_big: number;
  out_mid: number;
  out_small: number;
  [key: string]: unknown;
}

export interface StockBrokerParams {
  symbol: string;
  limit?: number;
  lang?: string;
}

export interface StockBrokerLevelItem {
  level: number;
  price: number;
  broker_count: number;
  broker: Array<{ id: string; name: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

export interface StockBrokerResponse {
  symbol: string;
  bid_broker: StockBrokerLevelItem[];
  ask_broker: StockBrokerLevelItem[];
  [key: string]: unknown;
}

export interface BrokerHoldParams {
  market: string;
  limit?: number;
  page?: number;
  order_by?: string;
  direction?: string;
  lang?: string;
}

export interface BrokerHoldItem {
  org_id: string;
  org_name: string;
  date: string;
  shares_hold: number;
  market_value: number;
  buy_amount: number;
  buy_amount5: number;
  buy_amount20: number;
  buy_amount60: number;
  market: string;
  [key: string]: unknown;
}

export type BrokerHoldResponse = BrokerHoldItem[];

export interface TradeRankParams {
  market: string;
  lang?: string;
}

export interface TradeRankItem {
  symbol: string;
  market: string;
  name: string;
  sec_type: string;
  change_rate: number;
  sell_order_rate: number;
  buy_order_rate: number;
  hour_trading_trading_status?: number;
  hour_trading_trade_session?: string;
  hour_trading_change_rate?: number;
  [key: string]: unknown;
}

export type TradeRankResponse = TradeRankItem[];
