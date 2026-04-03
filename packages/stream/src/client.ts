import { createBackoff, noopLogger, sleep, TigerStreamError } from 'tiger-openapi-shared';

import type {
  EncodedStreamMessage,
  StreamClientOptions,
  StreamDecoder,
  StreamMessage,
  StreamSubscriptionEncoder,
  StreamSubscription,
  WebSocketLike,
} from './types.js';

const WS_READY_STATE_OPEN = 1;

function createDefaultDecoder(): StreamDecoder {
  return async (event) => {
    if (typeof event.data === 'string') {
      return JSON.parse(event.data) as StreamMessage;
    }

    throw new TigerStreamError('Binary stream decoding requires a protobuf decoder');
  };
}

function createDefaultSubscriptionEncoder(): StreamSubscriptionEncoder {
  return {
    encodeSubscribe: (topic) => ({
      topic,
      payload: JSON.stringify({ action: 'subscribe', topic }),
    }),
    encodeUnsubscribe: (topic) => ({
      topic,
      payload: JSON.stringify({ action: 'unsubscribe', topic }),
    }),
  };
}

export class TigerStreamClient {
  private socket: WebSocketLike | undefined;
  private readonly subscriptions = new Map<string, Set<StreamSubscription['listener']>>();
  private readonly options: StreamClientOptions;
  private readonly decoder: StreamDecoder;
  private heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  private reconnectAttempt = 0;
  private connectAckResolver:
    | { resolve(): void; reject(error: unknown): void; settled: boolean }
    | undefined;

  constructor(options: StreamClientOptions, decoder: StreamDecoder = createDefaultDecoder()) {
    this.options = options;
    this.decoder = decoder;
  }

  async connect(): Promise<void> {
    if (this.socket?.readyState === WS_READY_STATE_OPEN) {
      return;
    }

    const socket = this.options.runtime.createWebSocket(this.options.url);
    socket.binaryType = 'arraybuffer';
    this.socket = socket;

    await new Promise<void>((resolve, reject) => {
      socket.onopen = () => {
        void (async () => {
          try {
            await this.options.handshake?.onOpen?.({
              send: (message) => this.send(message),
            });

            this.reconnectAttempt = 0;
            this.startHeartbeat();
            this.resubscribeTopics();

            if (this.options.isConnectAck) {
              this.connectAckResolver = {
                resolve,
                reject,
                settled: false,
              };
              const timeoutMs = this.options.connectAckTimeoutMs ?? 10_000;
              globalThis.setTimeout(() => {
                if (this.connectAckResolver && !this.connectAckResolver.settled) {
                  this.connectAckResolver.settled = true;
                  reject(new TigerStreamError('Stream connect ack timeout'));
                }
              }, timeoutMs);
              return;
            }

            resolve();
          } catch (error) {
            reject(error);
          }
        })();
      };

      socket.onerror = (event) => {
        const cause = (event as Event & { error?: unknown }).error;
        reject(
          new TigerStreamError('WebSocket connection failed', {
            url: this.options.url,
            cause: cause instanceof Error ? cause.message : cause,
          })
        );
      };

      socket.onclose = () => {
        this.connectAckResolver = undefined;
        this.stopHeartbeat();
        void this.reconnect();
      };

      socket.onmessage = (event) => {
        void this.dispatch(event);
      };
    });
  }

  subscribe(subscription: StreamSubscription): () => void {
    const topic = subscription.topic;
    const hadTopic = this.subscriptions.has(topic);
    const listeners = this.subscriptions.get(topic) ?? new Set();
    listeners.add(subscription.listener);
    this.subscriptions.set(topic, listeners);

    if (!hadTopic) {
      if (topic !== '*') {
        this.trySendSubscription(topic, 'subscribe');
      }
    }

    return () => {
      const currentListeners = this.subscriptions.get(topic);
      currentListeners?.delete(subscription.listener);
      if (currentListeners && currentListeners.size === 0) {
        this.subscriptions.delete(topic);
        if (topic !== '*') {
          this.trySendSubscription(topic, 'unsubscribe');
        }
      }
    };
  }

  subscribeTopic(topic: string): void {
    this.trySendSubscription(topic, 'subscribe');
  }

  unsubscribeTopic(topic: string): void {
    this.trySendSubscription(topic, 'unsubscribe');
  }

  send(message: EncodedStreamMessage): void {
    if (!this.socket || this.socket.readyState !== WS_READY_STATE_OPEN) {
      throw new TigerStreamError('WebSocket is not connected');
    }

    this.socket.send(message.payload);
  }

  close(): void {
    this.connectAckResolver = undefined;
    this.stopHeartbeat();
    this.socket?.close();
  }

  private async dispatch(event: MessageEvent<string | ArrayBuffer | Blob>) {
    const message = await this.decoder(event, this.options.runtime);
    if (
      this.options.isConnectAck?.(message) &&
      this.connectAckResolver &&
      !this.connectAckResolver.settled
    ) {
      this.connectAckResolver.settled = true;
      this.connectAckResolver.resolve();
    }

    this.subscriptions.get(message.topic)?.forEach((listener) => listener(message));
    for (const [topic, listeners] of this.subscriptions.entries()) {
      if (topic.includes(':')) {
        const [prefix] = topic.split(':', 1);
        if (prefix === message.topic) {
          listeners.forEach((listener) => listener(message));
        }
      }
    }
    this.subscriptions.get('*')?.forEach((listener) => listener(message));
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    const heartbeatIntervalMs = this.options.heartbeatIntervalMs ?? 15_000;
    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.readyState === WS_READY_STATE_OPEN) {
        if (this.options.heartbeat?.enabled === false) {
          return;
        }

        const payload =
          this.options.heartbeat?.buildPayload?.() ?? JSON.stringify({ type: 'ping' });
        this.socket.send(payload);
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

  private resubscribeTopics() {
    if (!this.shouldAutoManageSubscription()) {
      return;
    }

    for (const topic of this.subscriptions.keys()) {
      this.trySendSubscription(topic, 'subscribe');
    }
  }

  private shouldAutoManageSubscription() {
    return this.options.subscription?.autoManage ?? true;
  }

  private getSubscriptionEncoder(): StreamSubscriptionEncoder {
    return this.options.subscription?.encoder ?? createDefaultSubscriptionEncoder();
  }

  private trySendSubscription(topic: string, action: 'subscribe' | 'unsubscribe') {
    if (!this.shouldAutoManageSubscription() || this.socket?.readyState !== WS_READY_STATE_OPEN) {
      return;
    }

    const encoder = this.getSubscriptionEncoder();
    const message =
      action === 'subscribe' ? encoder.encodeSubscribe(topic) : encoder.encodeUnsubscribe(topic);
    this.send(message);
  }
}

export function createStreamClient(
  options: StreamClientOptions,
  decoder?: StreamDecoder
): TigerStreamClient {
  return new TigerStreamClient(options, decoder);
}
