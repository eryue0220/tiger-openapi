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

function resolveBrowserWebSocket(factory?: TigerWebSocketFactory): TigerWebSocketFactory {
  if (factory) {
    return factory;
  }

  return (url: string) => {
    if (typeof globalThis.WebSocket !== 'function') {
      throw new Error(
        'No WebSocket implementation available in the browser. Pass runtime.createWebSocket explicitly.'
      );
    }

    return new globalThis.WebSocket(url);
  };
}

function createBrowserConfig(config: TigerClientConfig): TigerSdkConfig {
  return {
    ...config,
    runtime: {
      ...config.runtime,
      createWebSocket: resolveBrowserWebSocket(config.runtime?.createWebSocket),
    },
  };
}

export class TigerClient extends CoreTigerClient {
  static readonly version = VERSION;

  constructor(config: TigerClientConfig) {
    super(createBrowserConfig(config));
  }
}

export function createTigerClient(config: TigerClientConfig) {
  return new TigerClient(config);
}
