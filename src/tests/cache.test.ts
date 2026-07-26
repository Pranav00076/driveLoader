import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCache } from '../cache/MemoryCache';

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache(1000, 3); // 1 sec TTL, max 3 items
  });

  it('should store and retrieve items', () => {
    cache.set('id1', {
      imageUrl: 'https://example.com/1.png',
      attemptedEndpoints: ['https://example.com/1.png'],
      successfulEndpoint: 'https://example.com/1.png',
      endpointIndex: 0,
    });

    const hit = cache.get('id1');
    expect(hit).not.toBeNull();
    expect(hit?.imageUrl).toBe('https://example.com/1.png');
  });

  it('should track cache hits and misses', () => {
    cache.set('id1', {
      imageUrl: 'https://example.com/1.png',
      attemptedEndpoints: ['https://example.com/1.png'],
      successfulEndpoint: 'https://example.com/1.png',
      endpointIndex: 0,
    });

    cache.get('id1'); // Hit
    cache.get('id2'); // Miss

    const stats = cache.getStats();
    expect(stats.cacheHits).toBe(1);
    expect(stats.cacheMisses).toBe(1);
    expect(stats.hitRate).toBe(50);
  });

  it('should respect LRU capacity limits', () => {
    cache.set('id1', {
      imageUrl: 'url1',
      attemptedEndpoints: [],
      successfulEndpoint: 'url1',
      endpointIndex: 0,
    });
    cache.set('id2', {
      imageUrl: 'url2',
      attemptedEndpoints: [],
      successfulEndpoint: 'url2',
      endpointIndex: 0,
    });
    cache.set('id3', {
      imageUrl: 'url3',
      attemptedEndpoints: [],
      successfulEndpoint: 'url3',
      endpointIndex: 0,
    });
    cache.set('id4', {
      imageUrl: 'url4',
      attemptedEndpoints: [],
      successfulEndpoint: 'url4',
      endpointIndex: 0,
    }); // Evicts id1

    expect(cache.has('id1')).toBe(false);
    expect(cache.has('id4')).toBe(true);
  });

  it('should record endpoint learning metrics', () => {
    cache.set('id1', {
      imageUrl: 'url1',
      attemptedEndpoints: [],
      successfulEndpoint: 'url1',
      endpointIndex: 2,
    });
    cache.set('id2', {
      imageUrl: 'url2',
      attemptedEndpoints: [],
      successfulEndpoint: 'url2',
      endpointIndex: 2,
    });

    expect(cache.getPreferredEndpointIndex()).toBe(2);
  });
});
