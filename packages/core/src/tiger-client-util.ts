import dayjs from 'dayjs';
import { signParams } from 'tiger-openapi-shared';
import type { TigerSdkConfig } from './types.js';

export class TigerClientUtil {
  protected readonly DEFAULT_CONFIG = {
    env: 'prod' as const,
    http: {
      retry: {
        maxAttempts: 3,
        initialDelayMs: 1000,
        maxDelayMs: 10000,
      },
    },
    stream: {
      heartbeatIntervalMs: 30000,
      reconnect: {
        retries: 3,
        getDelayMs: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
      },
    },
  };

  constructor(protected config: TigerSdkConfig) {}

  protected buildConfig() {
    return {
      ...this.DEFAULT_CONFIG,
      ...this.config,
      env: this.config.env ?? this.DEFAULT_CONFIG.env,
      http: {
        retry: {
          ...this.DEFAULT_CONFIG.http.retry,
          ...this.config.http?.retry,
        },
      },
      stream: {
        heartbeatIntervalMs: this.DEFAULT_CONFIG.stream.heartbeatIntervalMs,
        reconnect: {
          ...this.DEFAULT_CONFIG.stream.reconnect,
          ...this.config.stream?.reconnect,
        },
      },
    };
  }

  buildDefaultParams(method: string, bizContent: unknown = {}, deviceId?: string) {
    const params = {
      tigerId: this.config.tigerId,
      account: this.config.account,
      privateKey: this.config.privateKey,
      // This is version of the Tiger OpenAPI.
      version: '3.0',
      charset: 'UTF-8',
      sign_type: 'RSA-SHA1',
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      bizContent: JSON.stringify(bizContent),
      method,
      deviceId,
    };

    return {
      ...params,
      sign: signParams(params),
    };
  }

  protected buildURL(type: 'http' | 'ws') {
    const PROD_URL = 'openapi.tigerfintech.com/gateway';
    const US_URL = 'openapi.tradeup.com';
    const SANDBOX_URL = 'openapi-sandbox.tigerfintech.com';
    const isHTTP = type === 'http';
    const env = this.config.env ?? 'prod';

    switch (env) {
      case 'prod':
        return { url: PROD_URL, path: isHTTP ? '/gateway' : '', port: !isHTTP ? 9883 : undefined };
      case 'us':
        return { url: US_URL, path: isHTTP ? '/gateway' : '', port: !isHTTP ? 9983 : undefined };
      case 'sandbox':
        return {
          url: SANDBOX_URL,
          path: isHTTP ? '/gateway' : '',
          port: !isHTTP ? 9885 : undefined,
        };
      default:
        throw new Error(`Invalid environment: ${env}`);
    }
  }
}
