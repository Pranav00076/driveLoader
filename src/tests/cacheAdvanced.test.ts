import { describe, it, expect } from 'vitest';
import { StorageEngine } from '../cache/StorageEngine';
import { MemoryCache } from '../cache/MemoryCache';

describe('Advanced Cache & StorageEngine', () => {
  it('should store and retrieve values from StorageEngine', async () => {
    const mem = new MemoryCache();
    const engine = new StorageEngine(mem);

    await engine.set('testFile123', {
      imageUrl: 'https://lh3.googleusercontent.com/d/testFile123',
      attemptedEndpoints: ['ep1'],
      successfulEndpoint: 'ep1',
      endpointIndex: 0,
    });

    const entry = await engine.get('testFile123');
    expect(entry).not.toBeNull();
    expect(entry?.imageUrl).toBe('https://lh3.googleusercontent.com/d/testFile123');
  });

  it('should inspect cache entries', async () => {
    const mem = new MemoryCache();
    const engine = new StorageEngine(mem);
    const inspection = await engine.inspectCache();
    expect(inspection.stats).toBeDefined();
    expect(Array.isArray(inspection.entries)).toBe(true);
  });
});
