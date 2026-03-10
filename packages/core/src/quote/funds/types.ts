export interface FundSymbolsParams {
  lang?: string;
}

/**
 * ```json
 * ["000001","000002","000003"]
 * ```
 */
export type FundSymbolsResponse = string;

export interface FundContractsParams {
  symbols: string[];
  lang?: string;
}

/**
 * ```json
 * []
 * ```
 */
export type FundContractsResponse = string;

export interface FundQuoteParams {
  symbols: string[];
  lang?: string;
}

/**
 * ```json
 * []
 * ```
 */
export type FundQuoteResponse = string;

export interface FundHistoryQuoteParams {
  symbols: string[];
  begin_time: string | number;
  end_time: string | number;
  limit?: number;
  lang?: string;
}

/**
 * ```json
 * []
 * ```
 */
export type FundHistoryQuoteResponse = string;
