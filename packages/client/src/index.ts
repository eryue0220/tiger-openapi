import { TigerClient as CoreTigerClient, VERSION } from 'tiger-openapi-core';
import type {
  TigerRuntimeOverrides as CoreTigerRuntimeOverrides,
  TigerSdkConfig,
  TigerWebSocketFactory,
} from 'tiger-openapi-core';

export type * from 'tiger-openapi-core';

export interface TigerRuntimeOverrides extends Omit<CoreTigerRuntimeOverrides, 'createWebSocket'> {
  createWebSocket?: TigerWebSocketFactory;
}

export interface TigerClientConfig extends Omit<TigerSdkConfig, 'runtime'> {
  runtime?: TigerRuntimeOverrides;
}

function resolveNodeWebSocket(factory?: TigerWebSocketFactory): TigerWebSocketFactory {
  if (factory) {
    return factory;
  }

  return (url: string) => {
    if (typeof globalThis.WebSocket !== 'function') {
      throw new Error(
        'No WebSocket implementation available in Node.js. Pass runtime.createWebSocket explicitly.'
      );
    }

    return new globalThis.WebSocket(url);
  };
}

function createNodeConfig(config: TigerClientConfig): TigerSdkConfig {
  return {
    ...config,
    http: {
      ...config.http,
    },
    runtime: {
      ...config.runtime,
      createWebSocket: resolveNodeWebSocket(config.runtime?.createWebSocket),
    },
  };
}

export class TigerClient extends CoreTigerClient {
  static readonly version = VERSION;

  constructor(config: TigerClientConfig) {
    super(createNodeConfig(config));
  }
}

export function createTigerClient(config: TigerClientConfig) {
  return new TigerClient(config);
}
