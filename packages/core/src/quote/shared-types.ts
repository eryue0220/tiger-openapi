import type { TigerRequestOptions } from '../types.js';

export type QuoteRequestOptions = TigerRequestOptions;

export type QuoteSecurityType = 'STK' | 'FUT' | 'OPT' | 'CRYPTO' | 'FUND' | 'WARRANT';

export interface GetContractsParams {
  symbols: string[];
  market?: string;
  secType?: QuoteSecurityType;
}

export interface Contract {
  symbol: string;
  secType: QuoteSecurityType;
}

export interface GetQuoteRealTimeParams {
  symbols: string[];
  market?: string;
}

export interface QuoteRealTime {
  symbol: string;
}
