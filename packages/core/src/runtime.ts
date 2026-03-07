import { noopLogger } from '@tiger-openapi/shared';

import type { TigerWebSocketFactory } from '@tiger-openapi/stream';
import type { TigerLogger } from '@tiger-openapi/shared';

export interface TigerRuntime {
  createWebSocket: TigerWebSocketFactory;
  logger: TigerLogger;
}

export interface TigerRuntimeOverrides {
  createWebSocket?: TigerWebSocketFactory;
  logger?: TigerLogger;
}

export function resolveRuntime(overrides: TigerRuntimeOverrides = {}): TigerRuntime {
  const createWebSocket =
    overrides.createWebSocket ??
    ((url: string) => {
      if (typeof globalThis.WebSocket !== 'function') {
        throw new Error(
          'No WebSocket implementation available. Pass runtime.createWebSocket explicitly.'
        );
      }

      return new globalThis.WebSocket(url);
    });

  return {
    createWebSocket,
    logger: overrides.logger ?? noopLogger,
  };
}
