import { describe, expect, it } from 'vitest';

import { createStreamClient } from '../src/index.js';
import type { WebSocketLike } from '../src/types.js';

class FakeWebSocket implements WebSocketLike {
  binaryType: BinaryType = 'blob';
  readyState = WebSocket.OPEN;
  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent<string | ArrayBuffer | Blob>) => void) | null = null;

  send(): void {}
  close(): void {
    this.readyState = WebSocket.CLOSED;
  }
}

describe('@tiger-openapi/stream', () => {
  it('multiplexes subscriptions by topic', async () => {
    const socket = new FakeWebSocket();
    const client = createStreamClient(
      {
        url: 'wss://push.example.com',
        runtime: {
          createWebSocket: () => socket,
        },
      },
      async (event) => JSON.parse(event.data as string)
    );

    const messages: unknown[] = [];
    client.subscribe({
      topic: 'quote',
      listener(message) {
        messages.push(message.payload);
      },
    });

    const connected = client.connect();
    socket.onopen?.(new Event('open'));
    await connected;

    socket.onmessage?.(
      new MessageEvent('message', {
        data: JSON.stringify({ topic: 'quote', payload: { symbol: 'AAPL' } }),
      })
    );
    await Promise.resolve();

    expect(messages).toEqual([{ symbol: 'AAPL' }]);
  });
});
