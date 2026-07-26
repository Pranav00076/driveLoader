import { describe, it, expect, beforeEach } from 'vitest';
import { resolveDriveImages } from '../core/batchResolver';
import { defaultCache } from '../cache/MemoryCache';

describe('Batch Resolver (resolveDriveImages)', () => {
  beforeEach(() => {
    defaultCache.clear();
  });

  it('should handle empty input arrays gracefully', async () => {
    const res = await resolveDriveImages([]);
    expect(res.total).toBe(0);
    expect(res.results).toEqual([]);
  });

  it('should resolve multiple URLs while preserving input ordering', async () => {
    const urls = [
      'https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P/view',
      'https://drive.google.com/open?id=2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7Q',
      'invalid-url-string',
    ];

    const batchRes = await resolveDriveImages(urls, {
      concurrency: 2,
      timeout: 100,
      probeFn: async (url) => !url.includes('invalid'),
    });

    expect(batchRes.total).toBe(3);
    expect(batchRes.results.length).toBe(3);
    expect(batchRes.results[0]?.inputUrl).toBe(urls[0]);
    expect(batchRes.results[1]?.inputUrl).toBe(urls[1]);
    expect(batchRes.results[2]?.inputUrl).toBe(urls[2]);

    expect(batchRes.results[0]?.result).not.toBeNull();
    expect(batchRes.results[2]?.error).not.toBeNull();
    expect(batchRes.successful).toBe(2);
    expect(batchRes.failed).toBe(1);
  });
});
