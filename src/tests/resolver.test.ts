import { describe, it, expect, beforeEach } from 'vitest';
import { resolveDriveImage, configureDriveLoader } from '../core/resolver';
import { defaultCache } from '../cache/MemoryCache';
import { InvalidDriveUrlError } from '../errors/DriveLoaderError';

describe('Drive Image Resolver', () => {
  const VALID_ID = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O6P';
  const VALID_URL = `https://drive.google.com/file/d/${VALID_ID}/view`;

  beforeEach(() => {
    defaultCache.clear();
    configureDriveLoader({ debug: false });
  });

  it('should throw InvalidDriveUrlError for invalid input strings', async () => {
    await expect(resolveDriveImage('invalid-link')).rejects.toThrow(InvalidDriveUrlError);
  });

  it('should resolve valid Drive links and return candidate result', async () => {
    const result = await resolveDriveImage(VALID_URL, { timeout: 100, probeFn: async () => true });
    expect(result.fileId).toBe(VALID_ID);
    expect(result.imageUrl).toBeDefined();
    expect(result.attemptedEndpoints.length).toBeGreaterThan(0);
  });

  it('should serve subsequent requests from memory cache', async () => {
    const res1 = await resolveDriveImage(VALID_URL, { timeout: 100, probeFn: async () => true });
    expect(res1.fromCache).toBe(false);

    const res2 = await resolveDriveImage(VALID_URL, { timeout: 100, probeFn: async () => true });
    expect(res2.fromCache).toBe(true);
    expect(res2.imageUrl).toBe(res1.imageUrl);
  });

  it('should coalescing concurrent requests for identical file ID', async () => {
    const p1 = resolveDriveImage(VALID_URL, { timeout: 100, probeFn: async () => true });
    const p2 = resolveDriveImage(VALID_URL, { timeout: 100, probeFn: async () => true });

    const [res1, res2] = await Promise.all([p1, p2]);
    expect(res1.imageUrl).toBe(res2.imageUrl);
  });
});
