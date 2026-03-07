import { describe, expect, it } from 'vitest';

import { PbCodecRegistry, decodeTickPayload } from '../src/index.js';

describe('@tiger-openapi/pb', () => {
  it('decodes envelopes via a registered codec', () => {
    const registry = new PbCodecRegistry().register('quote', {
      decode(payload) {
        return new TextDecoder().decode(payload);
      },
    });

    expect(registry.decode({ type: 'quote', payload: new TextEncoder().encode('ok') })).toBe('ok');
  });

  it('uses the provided compression adapter for tick payloads', () => {
    const payload = new Uint8Array([1, 2]);
    const result = decodeTickPayload(payload, {
      decompress() {
        return new Uint8Array([3, 4]);
      },
    });

    expect(Array.from(result)).toEqual([3, 4]);
  });
});
