export type CryptoSecType = 'CC';

export type CryptoSymbolsResponse = string;

export interface CryptoBriefsParams {
  symbols: string[];
  sec_type?: CryptoSecType;
  lang?: string;
}

export interface CryptoBriefsResponse {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  preClose: number;
  latestPrice: number;
  latestTime: number;
  change: number;
  changeRate: number;
  volumeDecimal: number;
}

export interface CryptoBarsParams {
  symbols: string[];
  sec_type?: CryptoSecType;
  period?: string;
  begin_time?: string | number;
  end_time?: string | number;
  date?: string;
  right?: string;
  limit?: number;
  lang?: string;
  page_token?: string;
  trade_session?: string;
}

export interface CryptoBarsResponse {
  symbol: string;
  period: string;
  nextPageToken?: string;
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

export interface CryptoTimelineParams {
  symbols: string[];
  sec_type?: CryptoSecType;
  begin_time?: string | number;
  lang?: string;
  trade_session?: string;
}

/**
 * ```json
 * [{
 *    "symbol": "BTC",
 *    "period": "day",
 *    "preClose": 68885.75,
 *    "intraday": {
 *      "endTime": 1773145612487,
 *      "items": [{
 *        "time": 1773072000000,
 *        "price": 68883.38,
 *        "volumeDecimal": 0.01963
 *      }]
 *    }
 * }]
 * ```
 */
export type CryptoTimelineResponse = string;
