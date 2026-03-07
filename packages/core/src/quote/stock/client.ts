import type { TigerClient } from '../../tiger-client.js';
import type { TigerRequestOptions } from '../../types.js';
import type {
  MarketStatusParams,
  MarketStatusResponse,
  TradingCalendarParams,
  TradingCalendarResponse,
  SymbolsParams,
  SymbolsResponse,
  SymbolNamesParams,
  SymbolNamesResponse,
  SymbolBriefsParams,
  SymbolBriefsResponse,
  DepthQuoteParams,
  DepthQuoteResponse,
  TradeTicksParams,
  TradeTicksResponse,
  BarsParams,
  BarsResponse,
  BarsByPageParams,
  BarsByPageResponse,
  TimelineParams,
  TimelineResponse,
  TimelineHistoryParams,
  TimelineHistoryResponse,
  StockDelayBriefsParams,
  StockDelayBriefsResponse,
  TradeMetasParams,
  TradeMetasResponse,
  CapitalFlowParams,
  CapitalFlowResponse,
  CapitalDistributionParams,
  CapitalDistributionResponse,
  StockBrokerParams,
  StockBrokerResponse,
  BrokerHoldParams,
  BrokerHoldResponse,
  TradeRankParams,
  TradeRankResponse,
} from './types.js';

export class QuoteStockClient {
  constructor(private readonly client: TigerClient) {}

  getMarketStatus(
    params: MarketStatusParams,
    options: TigerRequestOptions = {}
  ): Promise<MarketStatusResponse> {
    const method = 'market_state';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getTradingCalendar(
    params: TradingCalendarParams,
    options: TigerRequestOptions = {}
  ): Promise<TradingCalendarResponse> {
    const method = 'trading_calendar';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getSymbols(params: SymbolsParams, options: TigerRequestOptions = {}): Promise<SymbolsResponse> {
    const method = 'all_symbols';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getSymbolNames(
    params: SymbolNamesParams,
    options: TigerRequestOptions = {}
  ): Promise<SymbolNamesResponse> {
    const method = 'all_symbol_names';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getSymbolBriefs(
    params: SymbolBriefsParams,
    options: TigerRequestOptions = {}
  ): Promise<SymbolBriefsResponse> {
    const method = 'brief';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getDepthQuote(
    params: DepthQuoteParams,
    options: TigerRequestOptions = {}
  ): Promise<DepthQuoteResponse> {
    const method = 'quote_depth';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getTradeTicks(
    params: TradeTicksParams,
    options: TigerRequestOptions = {}
  ): Promise<TradeTicksResponse> {
    const method = 'trade_tick';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getBars(params: BarsParams, options: TigerRequestOptions = {}): Promise<BarsResponse> {
    const method = 'kline';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getBarsByPage(
    params: BarsByPageParams,
    options: TigerRequestOptions = {}
  ): Promise<BarsByPageResponse> {
    const method = 'kline';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getTimeline(
    params: TimelineParams,
    options: TigerRequestOptions = {}
  ): Promise<TimelineResponse> {
    const method = 'timeline';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getTimelineHistory(
    params: TimelineHistoryParams,
    options: TigerRequestOptions = {}
  ): Promise<TimelineHistoryResponse> {
    const method = 'history_timeline';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getStockDelayBriefs(
    params: StockDelayBriefsParams,
    options: TigerRequestOptions = {}
  ): Promise<StockDelayBriefsResponse> {
    const method = 'quote_delay';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getTradeMetas(
    params: TradeMetasParams,
    options: TigerRequestOptions = {}
  ): Promise<TradeMetasResponse> {
    const method = 'quote_stock_trade';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getCapitalFlow(
    params: CapitalFlowParams,
    options: TigerRequestOptions = {}
  ): Promise<CapitalFlowResponse> {
    const method = 'capital_flow';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getCapitalDistribution(
    params: CapitalDistributionParams,
    options: TigerRequestOptions = {}
  ): Promise<CapitalDistributionResponse> {
    const method = 'capital_distribution';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getStockBroker(
    params: StockBrokerParams,
    options: TigerRequestOptions = {}
  ): Promise<StockBrokerResponse> {
    const method = 'stock_broker';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getBrokerHold(
    params: BrokerHoldParams,
    options: TigerRequestOptions = {}
  ): Promise<BrokerHoldResponse> {
    const method = 'broker_hold';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  getTradeRank(
    params: TradeRankParams,
    options: TigerRequestOptions = {}
  ): Promise<TradeRankResponse> {
    const method = 'trade_rank';
    const payload = this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createQuoteStockClient(client: TigerClient): QuoteStockClient {
  return new QuoteStockClient(client);
}
