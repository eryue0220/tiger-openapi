export interface BackoffOptions {
  baseDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
  jitter?: number;
}

export function createBackoff(options: BackoffOptions = {}) {
  const baseDelayMs = options.baseDelayMs ?? 250;
  const maxDelayMs = options.maxDelayMs ?? 5_000;
  const factor = options.factor ?? 2;
  const jitter = options.jitter ?? 0.1;

  return {
    next(attempt: number): number {
      const raw = Math.min(maxDelayMs, baseDelayMs * factor ** Math.max(0, attempt));
      const jitterRange = raw * jitter;
      return Math.round(raw - jitterRange + Math.random() * jitterRange * 2);
    },
  };
}
