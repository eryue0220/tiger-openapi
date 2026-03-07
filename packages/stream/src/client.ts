import { createBackoff, noopLogger, sleep, TigerStreamError } from 'tiger-openapi-shared';

import type {
  EncodedStreamMessage,
  StreamClientOptions,
  StreamDecoder,
  StreamMessage,
  StreamSubscription,
  WebSocketLike,
} from './types.js';

function createDefaultDecoder(): StreamDecoder {
  return async (event) => {
    if (typeof event.data === 'string') {
      return JSON.parse(event.data) as StreamMessage;
    }

    throw new TigerStreamError('Binary stream decoding requires a protobuf decoder');
  };
}

export class TigerStreamClient {
  private socket: WebSocketLike | undefined;
  private readonly subscriptions = new Map<string, Set<StreamSubscription['listener']>>();
  private readonly options: StreamClientOptions;
  private readonly decoder: StreamDecoder;
  private heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  private reconnectAttempt = 0;

  constructor(options: StreamClientOptions, decoder: StreamDecoder = createDefaultDecoder()) {
    this.options = options;
    this.decoder = decoder;
  }

  async connect(): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    const socket = this.options.runtime.createWebSocket(this.options.url);
    socket.binaryType = 'arraybuffer';
    this.socket = socket;

    await new Promise<void>((resolve, reject) => {
      socket.onopen = () => {
        this.reconnectAttempt = 0;
        this.startHeartbeat();
        resolve();
      };

      socket.onerror = () => {
        reject(new TigerStreamError('WebSocket connection failed', { url: this.options.url }));
      };

      socket.onclose = () => {
        this.stopHeartbeat();
        void this.reconnect();
      };

      socket.onmessage = (event) => {
        void this.dispatch(event);
      };
    });
  }

  subscribe(subscription: StreamSubscription): () => void {
    const listeners = this.subscriptions.get(subscription.topic) ?? new Set();
    listeners.add(subscription.listener);
    this.subscriptions.set(subscription.topic, listeners);

    return () => {
      const currentListeners = this.subscriptions.get(subscription.topic);
      currentListeners?.delete(subscription.listener);
      if (currentListeners && currentListeners.size === 0) {
        this.subscriptions.delete(subscription.topic);
      }
    };
  }

  send(message: EncodedStreamMessage): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new TigerStreamError('WebSocket is not connected');
    }

    this.socket.send(message.payload);
  }

  close(): void {
    this.stopHeartbeat();
    this.socket?.close();
  }

  private async dispatch(event: MessageEvent<string | ArrayBuffer | Blob>) {
    const message = await this.decoder(event, this.options.runtime);
    this.subscriptions.get(message.topic)?.forEach((listener) => listener(message));
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    const heartbeatIntervalMs = this.options.heartbeatIntervalMs ?? 15_000;
    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, heartbeatIntervalMs);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  private async reconnect() {
    const retries = this.options.reconnect?.retries ?? 3;
    if (this.reconnectAttempt >= retries) {
      noopLogger.warn('stream reconnect limit reached', { url: this.options.url });
      return;
    }

    const backoff = createBackoff();
    const delayMs =
      this.options.reconnect?.getDelayMs?.(this.reconnectAttempt) ??
      backoff.next(this.reconnectAttempt);
    this.reconnectAttempt += 1;
    await sleep(delayMs);
    await this.connect();
  }
}

export function createStreamClient(
  options: StreamClientOptions,
  decoder?: StreamDecoder
): TigerStreamClient {
  return new TigerStreamClient(options, decoder);
}
