import type { TigerMarket } from '../../types.js';

export interface WarrantBriefsParams {
  symbols: string[];
  lang?: string;
}

export interface WarrantBriefsResponse {
  items: Array<{
    symbol: string;
    name: string;
    exchange: string;
    market: TigerMarket;
    secType: string;
    currency: string;
    expiry: string;
    strike: string;
    right: string;
    multiplier: number;
    lastTradingDate: number;
    entitlementRatio: number;
    entitlementPrice: number;
    minTick: number;
    listingDate: number;
    halted: string;
    underlyingSymbol: string;
    timestamp: number;
    latestPrice: number;
    preClose: number;
    open: number;
    high: number;
    low: number;
    volume: number;
    amount: number;
    premium: number;
    outstandingRatio: number;
    impliedVolatility: number;
    inOutPrice: number;
    delta: number;
    leverageRatio: number;
    breakevenPoint: number;
  }>;
}

export interface WarrantFilterRange<T> {
  min?: T;
  max?: T;
}

export interface WarrantFilterParams {
  symbol: string;
  page?: number;
  page_size?: number;
  sort_field_name?: string;
  sort_dir?: string;
  warrant_type?: number[];
  in_out_price?: number[];
  issuer_name?: string;
  expire_ym?: string;
  lot_size?: number[];
  entitlement_ratio?: number[];
  leverage_ratio?: WarrantFilterRange<number>;
  strike?: WarrantFilterRange<number>;
  premium?: WarrantFilterRange<number>;
  outstanding_ratio?: WarrantFilterRange<number>;
  implied_volatility?: WarrantFilterRange<number>;
  effective_leverage?: WarrantFilterRange<number>;
  call_price?: WarrantFilterRange<number>;
  state?: number;
  lang?: string;
}

export interface WarrantFilterResponse {
  page: number;
  totalPage: number;
  totalCount: number;
  items: Array<{
    symbol: string;
    name: string;
    type: string;
    secType: string;
    market: TigerMarket;
    entitlementRatio: number;
    entitlementPrice: number;
    premium: number;
    breakevenPoint: number;
    expireDate: string;
    lastTradingDate: string;
    state: string;
    changeRate: number;
    change: number;
    latestPrice: number;
    volume: number;
    amount: number;
    outstandingRatio: number;
    lotSize: number;
    strike: string;
    inOutPrice: number;
    delta: number;
    leverageRatio: number;
    effectiveLeverage: number;
    impliedVolatility: number;
  }>;
  bounds: {
    issuerName: Array<string>;
    expireDate: Array<string>;
    lotSize: Array<number>;
    entitlementRatio: Array<number>;
    leverageRatio: WarrantFilterRange<number>;
    strike: WarrantFilterRange<number>;
    premium: WarrantFilterRange<number>;
    outstandingRatio: WarrantFilterRange<number>;
    impliedVolatility: WarrantFilterRange<number>;
    effectiveLeverage: WarrantFilterRange<number>;
    callPrice: WarrantFilterRange<number>;
  };
}
