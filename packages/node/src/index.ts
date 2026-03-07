import { TigerClient as CoreTigerClient, VERSION } from '@tiger-openapi/core';
import type {
  TigerRuntimeOverrides,
  TigerSdkConfig,
  TigerWebSocketFactory,
} from '@tiger-openapi/core';

export interface NodeTigerRuntimeOverrides extends Omit<TigerRuntimeOverrides, 'createWebSocket'> {
  createWebSocket?: TigerWebSocketFactory;
}

export interface NodeTigerConfig extends Omit<TigerSdkConfig, 'runtime'> {
  runtime?: NodeTigerRuntimeOverrides;
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

function createNodeConfig(config: NodeTigerConfig): TigerSdkConfig {
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

  constructor(config: NodeTigerConfig) {
    super(createNodeConfig(config));
  }
}

export function createNodeTiger(config: NodeTigerConfig) {
  return new TigerClient(config);
}
