import { describe, expect, it } from 'vitest';

import { TigerClient } from '../src/index.js';

class MockWebSocket {
  binaryType: BinaryType = 'arraybuffer';
  readyState = 1;
  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent<string | ArrayBuffer | Blob>) => void) | null = null;
  readonly sent: Array<string | ArrayBufferLike | Blob | ArrayBufferView> = [];

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    this.sent.push(data);
  }

  close(): void {
    this.readyState = 3;
    this.onclose?.({} as CloseEvent);
  }
}

describe('tiger-openapi-core', () => {
  it('mounts quote methods on the client instance', async () => {
    const client = new TigerClient({
      tigerId: '20150144',
      account: 'U123456789',
      privateKey: 'private-key',
    });

    expect(client.quote).toBeDefined();
    expect(client.order).toBeDefined();
    expect(client.account).toBeDefined();
  });

  it('supports stream connect and publish when stream is enabled', async () => {
    const socket = new MockWebSocket();
    let capturedUrl = '';
    const client = new TigerClient({
      tigerId: '20150144',
      account: 'U123456789',
      privateKey: 'private-key',
      stream: {
        protocol: 'legacy-json',
      },
      runtime: {
        createWebSocket: (url) => {
          capturedUrl = url;
          queueMicrotask(() => socket.onopen?.({} as Event));
          return socket;
        },
      },
    });

    await client.connect();
    client.subscribeTopic('quote.AAPL');
    client.publish({
      topic: 'quote.AAPL',
      payload: JSON.stringify({ action: 'subscribe', topic: 'quote.AAPL' }),
    });
    client.close();

    expect(socket.sent.length).toBeGreaterThan(0);
    expect(capturedUrl).toBe('wss://openapi.tigerfintech.com:9883');
  });
});
