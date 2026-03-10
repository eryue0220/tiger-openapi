export interface FutureExchangesParams {
  sec_type?: 'FUT' | 'FOP' | string;
  lang?: string;
}

export type FutureExchangesResponse = string;

export interface FutureContractsParams {
  exchange_code: string;
  lang?: string;
}

export type FutureContractsResponse = string;

export interface FutureCurrentContractParams {
  type: string;
  lang?: string;
}

export type FutureCurrentContractResponse = string;

export interface FutureAllContractsParams {
  type: string;
  lang?: string;
}

export type FutureAllContractsResponse = string;

export interface FutureContractParams {
  contract_code: string;
  lang?: string;
}

export type FutureContractResponse = string;

export interface FutureContinuousContractsParams {
  type: string;
  lang?: string;
}

export type FutureContinuousContractsResponse = string;

export interface FutureBarsParams {
  contract_codes: string[];
  period?: string;
  begin_time?: string | number;
  end_time?: string | number;
  limit?: number;
  page_token?: string;
  lang?: string;
}

export interface FutureBarsByPageParams {
  contract_codes: string[];
  period?: string;
  begin_time?: string | number;
  end_time?: string | number;
  page_size?: number;
  total?: number;
  page_token?: string;
  lang?: string;
}

export interface FutureBarsResponse {
  identifier: string;
  next_page_token?: string;
  items?: Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface FutureTradeTicksParams {
  contract_code: string;
  begin_index?: number;
  end_index?: number;
  limit?: number;
  lang?: string;
  version?: string;
}

export type FutureTradeTicksResponse = string;

export interface FutureBriefParams {
  contract_codes: string[];
  lang?: string;
}

export type FutureBriefResponse = string;

export interface FutureDepthParams {
  contract_codes: string[];
  lang?: string;
}

export type FutureDepthResponse = string;
