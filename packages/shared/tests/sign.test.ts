import { afterEach, describe, expect, it, vi } from 'vitest';

import { signParams } from '../src/index.js';

describe('signParams', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('normalizes escaped newlines in PEM private keys', async () => {
    const importKey = vi.fn(async () => ({}) as CryptoKey);
    const sign = vi.fn(async () => new Uint8Array([1, 2, 3]).buffer);

    vi.stubGlobal('crypto', {
      subtle: {
        importKey,
        sign,
      },
    } as unknown as Crypto);

    await signParams({
      tigerId: '1',
      account: '2',
      privateKey: '-----BEGIN PRIVATE KEY-----\\nAQID\\n-----END PRIVATE KEY-----',
    });

    expect(importKey).toHaveBeenCalledTimes(1);
    const keyData = importKey.mock.calls[0]?.[1] as ArrayBuffer;
    expect(new Uint8Array(keyData)).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('falls back to PKCS#1 conversion when direct PKCS#8 import fails', async () => {
    const importKey = vi
      .fn()
      .mockRejectedValueOnce(new DOMException('Invalid keyData', 'DataError'))
      .mockResolvedValueOnce({} as CryptoKey);
    const sign = vi.fn(async () => new Uint8Array([1, 2, 3]).buffer);

    vi.stubGlobal('crypto', {
      subtle: {
        importKey,
        sign,
      },
    } as unknown as Crypto);

    await signParams({
      tigerId: '1',
      account: '2',
      privateKey: 'AQID',
    });

    expect(importKey).toHaveBeenCalledTimes(2);
    const firstTry = importKey.mock.calls[0]?.[1] as ArrayBuffer;
    const secondTry = importKey.mock.calls[1]?.[1] as ArrayBuffer;
    expect(new Uint8Array(secondTry).byteLength).toBeGreaterThan(
      new Uint8Array(firstTry).byteLength
    );
  });

  it('throws with cause set to the PKCS#1 conversion failure when both fail', async () => {
    const pkcs8Error = new DOMException('PKCS#8 failed', 'DataError');
    const pkcs1Error = new DOMException('PKCS#1 conversion failed', 'DataError');
    const importKey = vi.fn().mockRejectedValueOnce(pkcs8Error).mockRejectedValueOnce(pkcs1Error);

    vi.stubGlobal('crypto', {
      subtle: {
        importKey,
        sign: vi.fn(),
      },
    } as unknown as Crypto);

    const err = await signParams({
      tigerId: '1',
      account: '2',
      privateKey: 'AQID',
    }).catch((e) => e);

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toContain('Failed to import privateKey');
    expect(err.cause).toBe(pkcs1Error);
  });
});
