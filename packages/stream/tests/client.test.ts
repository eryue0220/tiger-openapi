import { describe, expect, it } from 'vitest';

import { TigerStreamClient } from '../src/client.js';
import type { WebSocketLike } from '../src/types.js';

const WS_OPEN = 1;
const WS_CLOSED = 3;

class MockWebSocket implements WebSocketLike {
  binaryType: BinaryType = 'arraybuffer';
  readyState = 0;
  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent<string | ArrayBuffer | Blob>) => void) | null = null;
  readonly sent: Array<string | ArrayBufferLike | Blob | ArrayBufferView> = [];

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    this.sent.push(data);
  }

  close(): void {
    this.readyState = WS_CLOSED;
    this.onclose?.({} as CloseEvent);
  }

  open() {
    this.readyState = WS_OPEN;
    this.onopen?.({} as Event);
  }
}

function flushTimers(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('tiger-openapi-stream', () => {
  it('sends subscribe and unsubscribe messages for topic lifecycle', async () => {
    let socket: MockWebSocket | undefined;
    const client = new TigerStreamClient({
      url: 'wss://example.com/ws',
      runtime: {
        createWebSocket: () => {
          socket = new MockWebSocket();
          queueMicrotask(() => socket?.open());
          return socket;
        },
      },
    });

    await client.connect();
    const dispose = client.subscribe({
      topic: 'quote.AAPL',
      listener: () => undefined,
    });

    expect(socket?.sent).toContain(JSON.stringify({ action: 'subscribe', topic: 'quote.AAPL' }));

    dispose();

    expect(socket?.sent).toContain(JSON.stringify({ action: 'unsubscribe', topic: 'quote.AAPL' }));
  });

  it('re-subscribes topics after reconnect', async () => {
    const sockets: MockWebSocket[] = [];
    const client = new TigerStreamClient({
      url: 'wss://example.com/ws',
      reconnect: {
        retries: 1,
        getDelayMs: () => 0,
      },
      runtime: {
        createWebSocket: () => {
          const socket = new MockWebSocket();
          sockets.push(socket);
          queueMicrotask(() => socket.open());
          return socket;
        },
      },
    });

    await client.connect();
    client.subscribe({
      topic: 'trade.AAPL',
      listener: () => undefined,
    });

    expect(sockets[0]?.sent).toContain(JSON.stringify({ action: 'subscribe', topic: 'trade.AAPL' }));

    sockets[0]?.close();
    await flushTimers();

    expect(sockets.length).toBe(2);
    expect(sockets[1]?.sent).toContain(JSON.stringify({ action: 'subscribe', topic: 'trade.AAPL' }));
  });

  it('does not auto-manage subscription messages when disabled', async () => {
    let socket: MockWebSocket | undefined;
    const client = new TigerStreamClient({
      url: 'wss://example.com/ws',
      subscription: {
        autoManage: false,
      },
      runtime: {
        createWebSocket: () => {
          socket = new MockWebSocket();
          queueMicrotask(() => socket?.open());
          return socket;
        },
      },
    });

    await client.connect();
    const dispose = client.subscribe({
      topic: 'quote.TSLA',
      listener: () => undefined,
    });
    dispose();

    expect(socket?.sent).toHaveLength(0);
  });
});
