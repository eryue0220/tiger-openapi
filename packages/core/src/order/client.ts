import type { TigerClient } from '../tiger-client.js';
import type { TigerApiResponse, TigerRequestOptions } from '../types.js';
import type {
  CancelOrderParams,
  CancelOrderResponse,
  CancelledOrdersParams,
  CancelledOrdersResponse,
  ContractParam,
  ContractResponse,
  ContractsParams,
  ContractsResponse,
  DerivativeContractsParams,
  DerivativeContractsResponse,
  FilledOrdersParams,
  FilledOrdersResponse,
  OpenOrdersParams,
  OpenOrdersResponse,
  OrderParams,
  OrdersParams,
  OrdersResponse,
  TransactionsParams,
  TransactionsResponse,
  ModifyOrderParams,
  ModifyOrderResponse,
  PlaceOrderParams,
  PlaceOrderResponse,
  PreviewOrderParams,
  PreviewOrderResponse,
} from './types.js';

export class OrderClient {
  constructor(private readonly client: TigerClient) {}

  async getContract(
    params: ContractParam,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<ContractResponse>> {
    const method = 'contract';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getContracts(
    params: ContractsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<ContractsResponse>> {
    const method = 'contracts';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getDerivativeContracts(
    params: DerivativeContractsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<DerivativeContractsResponse>> {
    const method = 'quote_contract';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async placeOrder(
    params: PlaceOrderParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<PlaceOrderResponse>> {
    const method = 'place_order';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async cancelOrder(
    params: CancelOrderParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<CancelOrderResponse>> {
    const method = 'cancel_order';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async modifyOrder(
    params: ModifyOrderParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<ModifyOrderResponse>> {
    const method = 'modify_order';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOrders(
    params: OrdersParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<OrdersResponse>> {
    const method = 'orders';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOrder(
    params: OrderParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<void>> {
    const method = 'orders';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getOpenOrders(
    params: OpenOrdersParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<OpenOrdersResponse>> {
    const method = 'active_orders';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getCancelledOrders(
    params: CancelledOrdersParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<CancelledOrdersResponse>> {
    const method = 'inactive_orders';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getFilledOrders(
    params: FilledOrdersParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<FilledOrdersResponse>> {
    const method = 'filled_orders';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async getTransactions(
    params: TransactionsParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<TransactionsResponse>> {
    const method = 'order_transactions';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }

  async previewOrder(
    params: PreviewOrderParams,
    options: TigerRequestOptions = {}
  ): Promise<TigerApiResponse<PreviewOrderResponse>> {
    const method = 'preview_order';
    const payload = await this.client.buildDefaultParams(method, params);
    return this.client.request({
      body: payload,
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });
  }
}

export function createOrderClient(client: TigerClient): OrderClient {
  return new OrderClient(client);
}
