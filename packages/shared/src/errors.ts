export interface TigerErrorOptions {
  code?: string;
  cause?: unknown;
  details?: Record<string, unknown>;
}

export class TigerError extends Error {
  readonly code?: string;
  readonly details?: Record<string, unknown>;

  constructor(message: string, options: TigerErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'TigerError';
    this.code = options.code;
    this.details = options.details;
  }
}

export class TigerHttpError extends TigerError {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, payload: unknown, details: Record<string, unknown> = {}) {
    super(`Tiger HTTP request failed with status ${status}`, {
      code: 'HTTP_ERROR',
      details,
    });
    this.name = 'TigerHttpError';
    this.status = status;
    this.payload = payload;
  }
}

export class TigerStreamError extends TigerError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message, {
      code: 'STREAM_ERROR',
      details,
    });
    this.name = 'TigerStreamError';
  }
}
