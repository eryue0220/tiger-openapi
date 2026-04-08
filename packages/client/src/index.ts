import { TigerClient as CoreTigerClient, VERSION } from '../../core/src/index.js';
import type {
  TigerRuntimeOverrides as CoreTigerRuntimeOverrides,
  TigerSdkConfig,
  TigerWebSocketFactory,
} from '../../core/src/index.js';
import { createTigerTcpSocket } from './tcp-socket.js';

export type * from '../../core/src/index.js';

export type { TigerClient as TigerClientApi } from '../../core/src/index.js';

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

  return createTigerTcpSocket;
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
