import type { TigerMarket } from '../types.js';

export interface ContractsParams {
  symbol: string | string[];
  sec_type?: string;
  currency?: string;
  exchange?: string;
  lang?: string;
}

export interface ContractParams {
  symbol: string;
  sec_type?: string;
  currency?: string;
  exchange?: string;
  expiry?: string;
  strike?: string | number;
  put_call?: string;
  lang?: string;
}

export interface DerivativeContractsParams {
  symbol: string | string[];
  sec_type: string;
  expiry: string;
  lang?: string;
}

export interface TradingTickSize {
  begin?: string | number;
  end?: string | number;
  tick_size?: number;
  tickSize?: number;
  type?: string;
  [key: string]: unknown;
}

export interface TradingContract {
  contract_id?: number;
  contractId?: number;
  identifier?: string;
  symbol?: string;
  sec_type?: string;
  secType?: string;
  currency?: string;
  exchange?: string;
  market?: string;
  primary_exchange?: string;
  primaryExchange?: string;
  name?: string;
  local_symbol?: string;
  localSymbol?: string;
  trading_class?: string;
  tradingClass?: string;
  expiry?: string;
  strike?: number | string;
  right?: string;
  put_call?: string;
  multiplier?: number;
  lot_size?: number;
  lotSize?: number;
  min_tick?: number;
  minTick?: number;
  shortable?: boolean;
  shortable_count?: number;
  shortableCount?: number;
  short_initial_margin?: number;
  shortInitialMargin?: number;
  short_maintenance_margin?: number;
  shortMaintenanceMargin?: number;
  short_fee_rate?: number;
  shortFeeRate?: number;
  long_initial_margin?: number;
  longInitialMargin?: number;
  long_maintenance_margin?: number;
  longMaintenanceMargin?: number;
  trade?: boolean;
  tradeable?: boolean;
  marginable?: boolean;
  close_only?: boolean;
  closeOnly?: boolean;
  status?: number | string;
  contract_month?: string;
  contractMonth?: string;
  last_trading_date?: string;
  lastTradingDate?: string;
  first_notice_date?: string;
  firstNoticeDate?: string;
  last_bidding_close_time?: number;
  lastBiddingCloseTime?: number;
  continuous?: boolean;
  tick_sizes?: TradingTickSize[];
  tickSizes?: TradingTickSize[];
  is_etf?: boolean;
  isEtf?: boolean;
  etf_leverage?: number;
  etfLeverage?: number;
  support_overnight_trading?: boolean;
  supportOvernightTrading?: boolean;
  support_fractional_share?: boolean;
  supportFractionalShare?: boolean;
  [key: string]: unknown;
}

export type ContractsResponse = TradingContract[];
export type ContractResponse = TradingContract | null;
export type DerivativeContractsResponse = TradingContract[];

export interface TradingOrderLeg {
  symbol?: string;
  sec_type?: string;
  secType?: string;
  expiry?: string;
  strike?: string | number;
  right?: string;
  put_call?: string;
  action?: string;
  ratio?: number;
  market?: string;
  currency?: string;
  multiplier?: number;
  total_quantity?: number;
  totalQuantity?: number;
  filled_quantity?: number;
  filledQuantity?: number;
  avg_filled_price?: number;
  avgFilledPrice?: number;
  created_at?: number;
  createdAt?: number;
  updated_at?: number;
  updatedAt?: number;
  [key: string]: unknown;
}

export interface TradingChargeDetail {
  type?: string;
  type_desc?: string;
  typeDesc?: string;
  original_amount?: number;
  originalAmount?: number;
  after_discount_amount?: number;
  afterDiscountAmount?: number;
  [key: string]: unknown;
}

export interface TradingCharge {
  category?: string;
  category_desc?: string;
  categoryDesc?: string;
  total?: number;
  details?: TradingChargeDetail[];
  [key: string]: unknown;
}

export interface TradingOrder {
  id?: number;
  order_id?: number;
  orderId?: number;
  parent_id?: number;
  parentId?: number;
  account?: string;
  symbol?: string;
  identifier?: string;
  market?: string;
  sec_type?: string;
  secType?: string;
  currency?: string;
  expiry?: string;
  strike?: string | number;
  right?: string;
  action?: string;
  order_type?: string;
  orderType?: string;
  status?: string;
  quantity?: number;
  total_quantity?: number;
  totalQuantity?: number;
  quantity_scale?: number;
  total_quantity_scale?: number;
  totalQuantityScale?: number;
  filled?: number;
  filled_quantity?: number;
  filledQuantity?: number;
  filled_scale?: number;
  filledQuantityScale?: number;
  remaining?: number;
  limit_price?: number;
  limitPrice?: number;
  aux_price?: number;
  auxPrice?: number;
  trail_stop_price?: number;
  trailStopPrice?: number;
  trailing_percent?: number;
  trailingPercent?: number;
  percent_offset?: number;
  percentOffset?: number;
  avg_fill_price?: number;
  avgFillPrice?: number;
  last_fill_price?: number;
  lastFillPrice?: number;
  time_in_force?: string;
  timeInForce?: string;
  outside_rth?: boolean;
  outsideRth?: boolean;
  trading_session_type?: string;
  tradingSessionType?: string;
  order_time?: number;
  openTime?: number;
  update_time?: number;
  updateTime?: number;
  latest_time?: number;
  latestTime?: number;
  trade_time?: number;
  tradeTime?: number;
  commission?: number;
  commissionDiscountAmount?: number;
  orderDiscountAmount?: number;
  gst?: number;
  realized_pnl?: number;
  realizedPnl?: number;
  latest_price?: number;
  latestPrice?: number;
  external_id?: string;
  externalId?: string;
  can_modify?: boolean;
  canModify?: boolean;
  can_cancel?: boolean;
  canCancel?: boolean;
  replace_status?: string;
  replaceStatus?: string;
  cancel_status?: string;
  cancelStatus?: string;
  is_open?: boolean;
  isOpen?: boolean;
  combo_type?: string;
  comboType?: string;
  combo_type_desc?: string;
  comboTypeDesc?: string;
  contract?: TradingContract;
  contract_legs?: TradingOrderLeg[];
  legs?: TradingOrderLeg[];
  charges?: TradingCharge[];
  [key: string]: unknown;
}

export interface TradingOrderListPayload {
  items?: TradingOrder[];
  orders?: TradingOrder[];
  nextPageToken?: string;
  next_page_token?: string;
  [key: string]: unknown;
}

export interface PlaceOrderParams {
  account?: string;
  id?: number;
  order_id?: number;
  symbol?: string;
  sec_type?: string;
  action: string;
  currency?: string;
  total_quantity?: number;
  total_quantity_scale?: number;
  cash_amount?: number;
  time_in_force?: string;
  expire_time?: number;
  order_type: string;
  limit_price?: number;
  adjust_limit?: number;
  aux_price?: number;
  trailing_percent?: number;
  percent_offset?: number;
  trail_stop_price?: number;
  outside_rth?: boolean;
  trading_session_type?: string;
  market?: TigerMarket | string;
  exchange?: string;
  expiry?: string;
  strike?: string;
  right?: string;
  multiplier?: number;
  local_symbol?: string;
  order_legs?: unknown[];
  algo_params?: unknown[];
  source?: string;
  user_mark?: string;
  lang?: string;
  [key: string]: unknown;
}

export interface PlaceOrderResponse {
  id?: number;
  order_id?: number;
  orderId?: number;
  sub_ids?: number[];
  subIds?: number[];
  orders?: TradingOrder[];
  [key: string]: unknown;
}

export interface CancelOrderParams {
  account?: string;
  id?: number;
  order_id?: number;
}

export interface CancelOrderResponse {
  id?: number;
  [key: string]: unknown;
}

export interface ModifyOrderParams {
  account?: string;
  id?: number;
  order_id?: number;
  symbol?: string;
  sec_type?: string;
  action?: string;
  order_type?: string;
  quantity?: number;
  quantity_scale?: number;
  limit_price?: number;
  aux_price?: number;
  trail_stop_price?: number;
  trailing_percent?: number;
  percent_offset?: number;
  time_in_force?: string;
  expire_time?: number;
  outside_rth?: boolean;
  adjust_limit?: number;
  lang?: string;
  [key: string]: unknown;
}

export interface ModifyOrderResponse {
  id?: number;
  [key: string]: unknown;
}

export interface OrdersParams {
  account?: string;
  sec_type?: string;
  market?: TigerMarket | 'ALL' | string;
  symbol?: string;
  start_date?: number | string;
  end_date?: number | string;
  limit?: number;
  is_brief?: boolean;
  states?: string[];
  sort_by?: string;
  seg_type?: string;
  page_token?: string;
  lang?: string;
}

export interface OrderParams {
  account?: string;
  id?: number;
  order_id?: number;
  is_brief?: boolean;
  show_charges?: boolean;
  lang?: string;
}

export interface OpenOrdersParams {
  account?: string;
  sec_type?: string;
  market?: TigerMarket | 'ALL' | string;
  symbol?: string;
  start_date?: number | string;
  end_date?: number | string;
  parent_id?: number;
  sort_by?: string;
  seg_type?: string;
  lang?: string;
}

export interface CancelledOrdersParams {
  account?: string;
  sec_type?: string;
  market?: TigerMarket | 'ALL' | string;
  symbol?: string;
  start_date?: number | string;
  end_date?: number | string;
  sort_by?: string;
  seg_type?: string;
  lang?: string;
}

export interface FilledOrdersParams {
  account?: string;
  sec_type?: string;
  market?: TigerMarket | 'ALL' | string;
  symbol?: string;
  start_date?: number | string;
  end_date?: number | string;
  sort_by?: string;
  seg_type?: string;
  lang?: string;
}

export type OrdersResponse = TradingOrderListPayload;
export type OpenOrdersResponse = TradingOrderListPayload;
export type CancelledOrdersResponse = TradingOrderListPayload;
export type FilledOrdersResponse = TradingOrderListPayload;
export type OrderResponse = TradingOrderListPayload;

export interface TradingTransaction {
  id?: number;
  account?: string;
  order_id?: number;
  orderId?: number;
  action?: string;
  filled_quantity?: number;
  filledQuantity?: number;
  filled_price?: number;
  filledPrice?: number;
  filled_amount?: number;
  filledAmount?: number;
  transacted_at?: number;
  transactedAt?: number;
  contract?: TradingContract;
  [key: string]: unknown;
}

export interface TransactionsParams {
  account?: string;
  order_id?: number;
  symbol?: string;
  sec_type?: string;
  start_date?: number | string;
  end_date?: number | string;
  limit?: number;
  expiry?: string;
  strike?: string | number;
  right?: string;
  page_token?: string;
  lang?: string;
}

export interface TransactionsResponse {
  items?: TradingTransaction[];
  nextPageToken?: string;
  next_page_token?: string;
  [key: string]: unknown;
}

export type PreviewOrderParams = PlaceOrderParams;

export interface PreviewOrderData {
  account?: string;
  initMargin?: number;
  maintMargin?: number;
  equityWithLoan?: number;
  initMarginBefore?: number;
  maintMarginBefore?: number;
  equityWithLoanBefore?: number;
  marginCurrency?: string;
  commission?: number;
  gst?: number;
  commissionCurrency?: string;
  availableEE?: number;
  excessLiquidity?: number;
  overnightLiquidation?: number;
  isPass?: boolean;
  message?: string;
  [key: string]: unknown;
}

export type PreviewOrderResponse = PreviewOrderData;
