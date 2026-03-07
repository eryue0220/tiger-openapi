export interface TimeoutSignalOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export function withTimeoutSignal(options: TimeoutSignalOptions): AbortSignal | undefined {
  if (!options.signal && options.timeoutMs === undefined) {
    return undefined;
  }

  if (options.timeoutMs === undefined) {
    return options.signal;
  }

  const timeoutSignal = AbortSignal.timeout(options.timeoutMs);
  if (!options.signal) {
    return timeoutSignal;
  }

  const controller = new AbortController();
  const abort = () => controller.abort();

  if (timeoutSignal.aborted || options.signal.aborted) {
    controller.abort();
    return controller.signal;
  }

  timeoutSignal.addEventListener('abort', abort, { once: true });
  options.signal.addEventListener('abort', abort, { once: true });
  return controller.signal;
}
