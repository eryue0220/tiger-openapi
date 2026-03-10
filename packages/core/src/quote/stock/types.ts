export interface MarketStatusParams {
  market: string;
  lang?: string;
}

export interface MarketStatusResponse {
  market: string;
  marketStatus: string;
  status: string;
  openTime: string;
}

export interface TradingCalendarParams {
  market: string;
  begin_date?: string;
  end_date?: string;
}

export interface TradingCalendarResponse {
  date: string;
  closeTime: string;
  type: string;
  openTime: string;
}

export interface SymbolsParams {
  market?: string;
  include_otc?: boolean;
}

export type SymbolsResponse = string;

export interface SymbolNamesParams {
  market: string;
  lang?: string;
  include_otc?: boolean;
}

export interface SymbolNamesResponse {
  symbol: string;
  name: string;
}

export interface SymbolBriefsParams {
  symbols: string[];
  include_hour_trading?: boolean;
  lang?: string;
}

/**
 * {
 *   "items": [{
 *     "symbol": "AAPL",
 *     "market": "US",
 *     "secType": "STK",
 *     "name": "Apple",
 *     "latestPrice": 259.88,
 *     "timestamp": 1773086400000,
 *     "preClose": 257.46,
 *     "halted": 0.0,
 *     "delay": 0,
 *     "hourTrading": {
 *       "tag": "盘后",
 *       "latestPrice": 259.0,
 *       "preClose": 259.88,
 *       "latestTime": "19: 59 EDT",
 *       "volume": 4266624,
 *       "timestamp": 1773100794888
 *     }
 *   }]
 * }
 */

export type SymbolBriefsResponse = string;

export interface DepthQuoteParams {
  symbols: string[];
  market: string;
}

// TODO: Fixed
export type DepthQuoteResponse = unknown;

export interface TradeTicksParams {
  symbols: string[];
  trade_session?: string;
  begin_index?: number;
  end_index?: number;
  limit?: number;
  lang?: string;
}

export interface TradeTicksResponse {
  symbol: string;
  beginIndex: number;
  endIndex: number;
  items: Array<{
    time: number;
    volume: number;
    price: number;
    type: string;
  }>;
}

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

export interface BarsResponse {
  symbol: string;
  period: string;
  items: Array<{
    time: number;
    volume: number;
    open: number;
    close: number;
    high: number;
    low: number;
    amount: number;
  }>;
}

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

export interface TimelineParams {
  symbols: string[];
  include_hour_trading?: boolean;
  begin_time?: string | number;
  lang?: string;
  trade_session?: string;
}

/**
 * [{
 *   "symbol": "AAPL",
 *   "period": "day",
 *   "preClose": 257.46,
 *   "intraday": {
 *     "items": [{
 *       "time": 1773063000000,
 *       "volume": 897201,
 *       "price": 256.945,
 *       "avgPrice":255.83316
 *     }]
 *   }
 * }]
 */
export type TimelineResponse = string;

export interface TimelineHistoryParams {
  symbols: string[];
  date: string;
  right?: string;
  trade_session?: string;
}

export interface TimelineHistoryResponse {
  symbol: string;
  items: Array<{
    time: number;
    volume: number;
    price: number;
    avgPrice: number;
  }>;
}

export interface StockDelayBriefsParams {
  symbols: string[];
  lang?: string;
}

export interface StockDelayBriefsResponse {
  symbol: string;
  preClose: number;
  halted: number;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeMetasParams {
  symbols: string[];
}

export interface TradeMetasResponse {
  symbol: string;
  lotSize: number;
  spreadScale: number;
  minTick: number;
}

export interface CapitalFlowParams {
  symbol: string;
  period: string;
  market: string;
  begin_time?: number;
  end_time?: number;
  limit?: number;
  lang?: string;
}

export interface CapitalFlowResponse {
  symbol: string;
  period: string;
  items: Array<{
    time: string;
    timestamp: number;
    netInflow: number;
  }>;
}

export interface CapitalDistributionParams {
  symbol: string;
  market: string;
  lang?: string;
}

export interface CapitalDistributionResponse {
  symbol: string;
  netInflow: number;
  inAll: number;
  inBig: number;
  inMid: number;
  inSmall: number;
  outAll: number;
  outBig: number;
  outMid: number;
  outSmall: number;
}

export interface StockBrokerParams {
  symbol: string;
  limit?: number;
  lang?: string;
}

interface StockBrokerLevelItem {
  level: number;
  price: number;
  brokerCount: number;
  broker: Array<{ id: string; name: string }>;
}

export interface StockBrokerResponse {
  symbol: string;
  bidBroker: StockBrokerLevelItem[];
  askBroker: StockBrokerLevelItem[];
}

export interface BrokerHoldParams {
  market: string;
  limit?: number;
  page?: number;
  order_by?: string;
  direction?: string;
  lang?: string;
}

export interface BrokerHoldResponse {
  page: number;
  totalPage: number;
  totalCount: number;
  date: string;
  items: Array<{
    orgId: string;
    orgName: string;
    date: string;
    sharesHold: number;
    marketValue: number;
    buyAmount: number;
    buyAmount5: number;
    buyAmount20: number;
    buyAmount60: number;
    market: string;
  }>;
}

export interface TradeRankParams {
  market: string;
  lang?: string;
}

export interface TradeRankResponse {
  symbol: string;
  market: string;
  name: string;
  secType: string;
  changeRate: number;
  sellOrderRate: number;
  buyOrderRate: number;
}
