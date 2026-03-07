import { TigerClient as CoreTigerClient } from '@tiger-openapi/core';
import type {
  TigerRuntimeOverrides,
  TigerSdkConfig,
  TigerWebSocketFactory,
} from '@tiger-openapi/core';

export * from '@tiger-openapi/core';

export interface BrowserTigerRuntimeOverrides extends Omit<
  TigerRuntimeOverrides,
  'createWebSocket'
> {
  createWebSocket?: TigerWebSocketFactory;
}

export interface BrowserTigerConfig extends Omit<TigerSdkConfig, 'runtime'> {
  http: NonNullable<TigerSdkConfig['http']>;
  runtime?: BrowserTigerRuntimeOverrides;
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

function createBrowserConfig(config: BrowserTigerConfig): TigerSdkConfig {
  return {
    ...config,
    runtime: {
      ...config.runtime,
      createWebSocket: resolveBrowserWebSocket(config.runtime?.createWebSocket),
    },
  };
}

export class TigerClient extends CoreTigerClient {
  constructor(config: BrowserTigerConfig) {
    super(createBrowserConfig(config));
  }
}

export function createBrowserTiger(config: BrowserTigerConfig) {
  return new TigerClient(config);
}
