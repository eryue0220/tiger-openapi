import type { TigerClient } from '../../tiger-client.js';
import type { TigerApiResponse, TigerRequestOptions } from '../../types.js';
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

  async getMarketStatus(
    params: MarketStatusParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<MarketStatusResponse>>> {
    const method = 'market_state';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getTradingCalendar(
    params: TradingCalendarParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<TradingCalendarResponse>>> {
    const method = 'trading_calendar';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getSymbols(
    params: SymbolsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<SymbolsResponse>>> {
    const method = 'all_symbols';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getSymbolNames(
    params: SymbolNamesParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<SymbolNamesResponse>>> {
    const method = 'all_symbol_names';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getSymbolBriefs(
    params: SymbolBriefsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<SymbolBriefsResponse>> {
    const method = 'brief';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getDepthQuote(
    params: DepthQuoteParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<DepthQuoteResponse>> {
    const method = 'quote_depth';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getTradeTicks(
    params: TradeTicksParams,
    options: TigerRequestOptions = {}
  ): Promise<TradeTicksResponse> {
    const method = 'trade_tick';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getBars(
    params: BarsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<BarsResponse>>> {
    const method = 'kline';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getBarsByPage(
    params: BarsByPageParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<BarsResponse>>> {
    const method = 'kline';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getTimeline(
    params: TimelineParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<TimelineResponse>> {
    const method = 'timeline';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getTimelineHistory(
    params: TimelineHistoryParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<TimelineHistoryResponse>>> {
    const method = 'history_timeline';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getStockDelayBriefs(
    params: StockDelayBriefsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<StockDelayBriefsResponse>>> {
    const method = 'quote_delay';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getTradeMetas(
    params: TradeMetasParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<TradeMetasResponse>>> {
    const method = 'quote_stock_trade';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getCapitalFlow(
    params: CapitalFlowParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<CapitalFlowResponse>>> {
    const method = 'capital_flow';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getCapitalDistribution(
    params: CapitalDistributionParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<CapitalDistributionResponse>> {
    const method = 'capital_distribution';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getStockBroker(
    params: StockBrokerParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<StockBrokerResponse>> {
    const method = 'stock_broker';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getBrokerHold(
    params: BrokerHoldParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<BrokerHoldResponse>> {
    const method = 'broker_hold';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getTradeRank(
    params: TradeRankParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<Array<TradeRankResponse>>> {
    const method = 'trade_rank';
    const payload = await this.client.buildDefaultParams(method, params);
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
