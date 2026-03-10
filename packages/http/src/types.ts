export interface TigerRequest<TBody = unknown> {
  headers?: HeadersInit;
  body?: TBody;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface TigerResponse<TBody = unknown> {
  code: number;
  message: string;
  timestamp: string;
  sign?: string;
  data?: TBody;
}

export interface RetryDecisionContext {
  attempt: number;
  response?: Response;
  error?: unknown;
}

export interface RetryPolicy {
  retries?: number;
  shouldRetry?(context: RetryDecisionContext): boolean;
  getDelayMs?(attempt: number): number;
}

export interface TigerHttpClientOptions {
  url: string;
  defaultHeaders?: HeadersInit;
  retry?: RetryPolicy;
}
