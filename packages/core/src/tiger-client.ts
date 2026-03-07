import { createHttpClient, TigerHttpClient } from '@tiger-openapi/http';
import { createStreamClient } from '@tiger-openapi/stream';

import { createAccountClient } from './account/index.js';
import { createQuoteClient } from './quote/index.js';
import { resolveRuntime } from './runtime.js';
import { createTradingClient } from './trading/index.js';
import type { TigerApiRequest, TigerSdkConfig, TigerSubscription } from './types.js';
import { TigerClientUtil } from './tiger-client-util.js';

export class TigerClient extends TigerClientUtil {
  private readonly http: TigerHttpClient;
  readonly stream;
  readonly quote;
  readonly trading;
  readonly account;

  constructor(config: TigerSdkConfig) {
    super(config);

    if (!config.tigerId || !config.account || !config.privateKey) {
      if (!config.tigerId) {
        throw new Error('HTTP configuration is required.');
      }
    }

    this.config = this.buildConfig();
    const runtime = resolveRuntime(this.config.runtime);
    const { url, path } = this.buildURL('http');
    const { url: wsUrl, port: wsPort } = this.buildURL('ws');

    this.http = createHttpClient({
      url: `https://${url}${path}`,
      retry: this.config.http?.retry,
    });

    this.stream = config.stream
      ? createStreamClient(
          {
            url: `wss://${wsUrl}:${wsPort}`,
            heartbeatIntervalMs: this.config.stream?.heartbeatIntervalMs,
            reconnect: this.config.stream?.reconnect,
            runtime: {
              createWebSocket: runtime.createWebSocket,
              codecRegistry: this.config.pb?.registry,
            },
          },
          this.config.stream?.decoder
        )
      : undefined;

    this.quote = createQuoteClient(this);
    this.trading = createTradingClient(this);
    this.account = createAccountClient(this);
  }

  request<TResponse = unknown, TBody = unknown>(
    request: TigerApiRequest<TBody>
  ): Promise<TResponse> {
    return this.http.request<TResponse, TBody>(request);
  }

  async connect(): Promise<void> {
    await this.stream?.connect();
  }

  subscribe(subscription: TigerSubscription): (() => void) | undefined {
    return this.stream?.subscribe(subscription);
  }

  close(): void {
    this.stream?.close();
  }
}

export function createTiger(config: TigerSdkConfig): TigerClient {
  return new TigerClient(config);
}
