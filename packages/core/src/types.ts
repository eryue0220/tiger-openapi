import type { RetryPolicy, TigerRequest, TigerResponse } from 'tiger-openapi-http';
import type { PbCodecRegistry } from 'tiger-openapi-pb';
import type { StreamDecoder, StreamMessage } from 'tiger-openapi-stream';

import type { TigerRuntimeOverrides } from './runtime.js';
export type { TigerRuntimeOverrides } from './runtime.js';

export type TigerMarket = 'US' | 'HK';

export type TigerOptionRight = 'PUT' | 'CALL';

export interface TigerRequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface TigerHttpConfig {
  defaultHeaders?: HeadersInit;
  retry?: RetryPolicy;
}

export interface TigerStreamConfig {
  heartbeatIntervalMs?: number;
  reconnect?: {
    retries?: number;
    getDelayMs?(attempt: number): number;
  };
  decoder?: StreamDecoder;
}

export interface TigerSdkConfig {
  tigerId: string;
  account: string;
  privateKey: string;
  env?: 'prod' | 'us' | 'sandbox';
  http?: TigerHttpConfig;
  stream?: TigerStreamConfig;
  pb?: {
    registry?: PbCodecRegistry;
  };
  runtime?: TigerRuntimeOverrides;
}

export interface TigerSubscription {
  topic: string;
  listener(message: StreamMessage): void;
}

export type TigerApiRequest<TBody = unknown> = TigerRequest<TBody>;

export type TigerApiResponse<TBody = unknown> = TigerResponse<TBody>;
