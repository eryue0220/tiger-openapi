import type { TigerMarket } from '../../types.js';

export interface ScannerParams {
  market: TigerMarket;
  page: number;
  page_size: number;
  version?: number;
  cursor_id?: string;
  [key: string]: unknown;
}

export interface ScannerResponse {
  page: number;
  totalPage: number;
  totalCount: number;
  pageSize: number;
  cursorId: string;
  items: Array<{
    symbol: string;
    market: TigerMarket;
    baseDataList: Array<unknown>;
    accumulateDataList: Array<unknown>;
    financialDataList: Array<unknown>;
    multiTagDataList: Array<{
      index: number;
      name: string;
      value: string;
    }>;
  }>;
}
