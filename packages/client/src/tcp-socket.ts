import tls from 'node:tls';

import { encodeVarintFrame, VarintFrameReader } from '../../stream/src/protocol.js';
import type { WebSocketLike } from '../../stream/src/types.js';

const WS_READY_STATE_CONNECTING = 0;
const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
const WS_READY_STATE_CLOSED = 3;

export class TigerTcpSocket implements WebSocketLike {
  binaryType: BinaryType = 'arraybuffer';
  readyState = WS_READY_STATE_CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent<string | ArrayBuffer | Blob>) => void) | null = null;

  private readonly socket: tls.TLSSocket;
  private readonly frameReader = new VarintFrameReader();

  constructor(url: string) {
    const endpoint = new URL(url);
    const host = endpoint.hostname;
    const port = endpoint.port ? Number(endpoint.port) : 443;

    this.socket = tls.connect({
      host,
      port,
      servername: host,
      rejectUnauthorized: false,
    });

    this.socket.on('secureConnect', () => {
      this.readyState = WS_READY_STATE_OPEN;
      this.onopen?.({} as Event);
    });

    this.socket.on('data', (chunk: Buffer) => {
      this.frameReader.push(chunk, (frame) => {
        this.onmessage?.({ data: frame } as MessageEvent<ArrayBuffer>);
      });
    });

    this.socket.on('error', (error) => {
      this.onerror?.({ error } as Event & { error: unknown });
    });

    this.socket.on('close', () => {
      this.readyState = WS_READY_STATE_CLOSED;
      this.onclose?.({} as CloseEvent);
    });
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this.readyState !== WS_READY_STATE_OPEN) {
      return;
    }

    if (typeof data === 'string') {
      this.socket.write(Buffer.from(encodeVarintFrame(data)));
      return;
    }

    if (ArrayBuffer.isView(data)) {
      this.socket.write(Buffer.from(encodeVarintFrame(data)));
      return;
    }

    if (data instanceof ArrayBuffer) {
      this.socket.write(Buffer.from(encodeVarintFrame(data)));
      return;
    }
  }

  close(): void {
    if (this.readyState === WS_READY_STATE_CLOSED) {
      return;
    }

    this.readyState = WS_READY_STATE_CLOSING;
    this.socket.end();
    this.socket.destroy();
  }
}

export function createTigerTcpSocket(url: string): WebSocketLike {
  return new TigerTcpSocket(url);
}
