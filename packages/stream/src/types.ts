import type { PbCodecRegistry, PbEnvelope } from 'tiger-openapi-pb';

export type TigerWebSocketFactory = (url: string) => WebSocketLike;

export interface WebSocketLike {
  binaryType: BinaryType;
  readyState: number;
  onopen: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
  onmessage: ((event: MessageEvent<string | ArrayBuffer | Blob>) => void) | null;
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  close(code?: number, reason?: string): void;
}

export interface StreamMessage<TPayload = unknown> {
  topic: string;
  payload: TPayload;
}

export interface StreamSubscription {
  topic: string;
  listener(message: StreamMessage): void;
}

export interface StreamRuntime {
  createWebSocket: TigerWebSocketFactory;
  codecRegistry?: PbCodecRegistry;
}

export interface StreamClientOptions {
  url: string;
  heartbeatIntervalMs?: number;
  reconnect?: {
    retries?: number;
    getDelayMs?(attempt: number): number;
  };
  runtime: StreamRuntime;
}

export interface EncodedStreamMessage {
  topic: string;
  payload: string | ArrayBufferLike | Blob | ArrayBufferView;
}

export type StreamDecoder = (
  raw: MessageEvent<string | ArrayBuffer | Blob>,
  runtime: StreamRuntime
) => Promise<StreamMessage>;

export type PbStreamEnvelope = PbEnvelope;
