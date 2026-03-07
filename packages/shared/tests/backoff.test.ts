import { describe, expect, it, vi } from 'vitest';

import { createBackoff } from '../src/index.js';

describe('@tiger-openapi/shared', () => {
  it('caps backoff delay at the configured max', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const backoff = createBackoff({ baseDelayMs: 100, maxDelayMs: 500, factor: 2, jitter: 0 });

    expect(backoff.next(0)).toBe(100);
    expect(backoff.next(4)).toBe(500);

    randomSpy.mockRestore();
  });
});
