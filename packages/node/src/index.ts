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
  http: NonNullable<TigerSdkConfig['http']>;
  runtime?: NodeTigerRuntimeOverrides;
  userAgent?: string;
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

function buildNodeHeaders(config: NodeTigerConfig): Headers {
  const headers = new Headers(config.http.defaultHeaders);
  if (!headers.has('user-agent')) {
    headers.set('user-agent', config.userAgent ?? `tiger-openapi-node/${VERSION}`);
  }
  return headers;
}

function createNodeConfig(config: NodeTigerConfig): TigerSdkConfig {
  return {
    ...config,
    http: {
      ...config.http,
      defaultHeaders: buildNodeHeaders(config),
    },
    runtime: {
      ...config.runtime,
      createWebSocket: resolveNodeWebSocket(config.runtime?.createWebSocket),
    },
  };
}

export class TigerClient extends CoreTigerClient {
  constructor(config: NodeTigerConfig) {
    super(createNodeConfig(config));
  }
}

export function createNodeTiger(config: NodeTigerConfig) {
  return new TigerClient(config);
}
