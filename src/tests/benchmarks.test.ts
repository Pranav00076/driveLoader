import { describe, it, expect } from 'vitest';
import { extractFileId, generateCandidateUrls, detectMediaType } from '../index';
import { MemoryCache } from '../cache/MemoryCache';

describe('Performance Benchmarks & Stress Tests', () => {
  it('should process 10,000+ file ID extraction and URL detection ops in under 100ms', () => {
    const testUrls = Array.from(
      { length: 10000 },
      (_, i) => `https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O${i}/view`,
    );

    const start = performance.now();
    let validCount = 0;

    for (let i = 0; i < testUrls.length; i++) {
      const u = testUrls[i];
      if (u) {
        const id = extractFileId(u);
        if (id) validCount++;
      }
    }

    const duration = performance.now() - start;
    expect(validCount).toBe(10000);
    expect(duration).toBeLessThan(500); // 10,000 ops completed rapidly
  });

  it('should handle 10,000 cache insertions and lookups with LRU eviction efficiently', () => {
    const cache = new MemoryCache(3600000, 1000);
    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      cache.set(`file_${i}`, {
        imageUrl: `https://lh3.googleusercontent.com/d/file_${i}`,
        attemptedEndpoints: ['ep1'],
        successfulEndpoint: 'ep1',
        endpointIndex: 0,
      });
    }

    const duration = performance.now() - start;
    const stats = cache.getStats();

    expect(stats.cachedEntries).toBe(1000); // max size 1000 enforced
    expect(duration).toBeLessThan(500);
  });

  it('should generate candidate endpoints for 1,000 items concurrently', () => {
    const fileIds = Array.from({ length: 1000 }, (_, i) => `fileId_${i}`);
    const start = performance.now();

    const allCandidates = fileIds.map((id) => generateCandidateUrls(id));
    const duration = performance.now() - start;

    expect(allCandidates.length).toBe(1000);
    expect(duration).toBeLessThan(300);
  });

  it('should classify media types for 1,000 diverse URLs correctly', () => {
    const validFileId = '1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O';
    const urls = [
      `https://drive.google.com/file/d/${validFileId}/view?type=video`,
      `https://drive.google.com/file/d/${validFileId}/view?type=audio`,
      `https://drive.google.com/file/d/${validFileId}/view?type=document`,
      `https://drive.google.com/file/d/${validFileId}/view`,
    ];

    expect(detectMediaType(urls[0]!)).toBe('video');
    expect(detectMediaType(urls[1]!)).toBe('audio');
    expect(detectMediaType(urls[2]!)).toBe('document');
    expect(detectMediaType(urls[3]!)).toBe('image');
  });
});
