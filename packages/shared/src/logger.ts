export interface TigerLogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

export const noopLogger: TigerLogger = {
  debug() {},
  info() {},
  warn() {},
  error() {},
};
