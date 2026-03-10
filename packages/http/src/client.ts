import { TigerHttpError, createBackoff, sleep, withTimeoutSignal } from 'tiger-openapi-shared';

import type {
  RetryDecisionContext,
  RetryPolicy,
  TigerHttpClientOptions,
  TigerRequest,
} from './types.js';

function shouldRetryDefault(context: RetryDecisionContext): boolean {
  if (context.response) {
    return context.response.status >= 500 || context.response.status === 429;
  }

  return context.error !== undefined;
}

function resolveRetryPolicy(policy?: RetryPolicy): Required<RetryPolicy> {
  const backoff = createBackoff();

  return {
    retries: policy?.retries ?? 2,
    shouldRetry: policy?.shouldRetry ?? shouldRetryDefault,
    getDelayMs: policy?.getDelayMs ?? ((attempt) => backoff.next(attempt)),
  };
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.startsWith('text/')) {
    return response.text();
  }

  return response.json();
}

export class TigerHttpClient {
  readonly url: string;
  readonly defaultHeaders: Headers;
  readonly retry: Required<RetryPolicy>;

  constructor(options: TigerHttpClientOptions) {
    this.url = options.url;
    this.defaultHeaders = new Headers(options.defaultHeaders);
    this.retry = resolveRetryPolicy(options.retry);
    if (typeof globalThis.fetch !== 'function') {
      throw new Error('No fetch implementation available in the current runtime.');
    }
  }

  async request<TResponse = unknown, TBody = unknown>(
    request: TigerRequest<TBody>
  ): Promise<TResponse> {
    for (let attempt = 0; ; attempt += 1) {
      const headers = new Headers(this.defaultHeaders);
      new Headers(request.headers).forEach((value, key) => headers.set(key, value));

      const hasJsonBody = request.body !== undefined && !(request.body instanceof FormData);
      if (hasJsonBody && !headers.has('content-type')) {
        headers.set('content-type', 'application/json');
      }

      try {
        const response = await globalThis.fetch(this.url, {
          method: 'POST',
          headers,
          signal: withTimeoutSignal({ signal: request.signal, timeoutMs: request.timeoutMs }),
          body: hasJsonBody
            ? JSON.stringify(request.body)
            : (request.body as BodyInit | null | undefined),
        });
        const payload = await parseResponse(response);

        if (!response.ok) {
          if (attempt < this.retry.retries && this.retry.shouldRetry({ attempt, response })) {
            await sleep(this.retry.getDelayMs(attempt));
            continue;
          }

          throw new TigerHttpError(response.status, payload, { url: this.url });
        }

        return payload as TResponse;
      } catch (error) {
        if (attempt < this.retry.retries && this.retry.shouldRetry({ attempt, error })) {
          await sleep(this.retry.getDelayMs(attempt));
          continue;
        }

        throw error;
      }
    }
  }
}

export function createHttpClient(options: TigerHttpClientOptions): TigerHttpClient {
  return new TigerHttpClient(options);
}
