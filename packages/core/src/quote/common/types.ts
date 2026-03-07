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
  expires_at: string | number;
}

export interface GetKlineQuoteParams {
  with_details?: boolean;
}

export interface GetKlineQuoteResponse {
  used: number;
  remain: number;
  method: string;
  symbol_details: Array<{ code: string; last_request_timestamp: string }>;
}
