export type QuotePermissionName =
  | 'usQuoteBasic'
  | 'usStockQuoteLv2Totalview'
  | 'hkStockQuoteLv2'
  | 'hkStockQuoteLv2Global'
  | 'usOptionQuote'
  | 'CBOEFuturesQuoteLv2'
  | 'HKEXFuturesQuoteLv2'
  | 'SGXFuturesQuoteLv2'
  | 'OSEFuturesQuoteLv2';

export interface QuotePermissionResponse {
  name: QuotePermissionName;
  expireAt: number;
}

export interface GetKlineQuoteParams {
  with_details?: boolean;
}

export interface GetKlineQuoteResponse {
  used: number;
  remain: number;
  method: 'kline' | 'future_kline' | 'option_kline';
  symbol_details: Array<{ code: string; last_request_timestamp: string }>;
}
