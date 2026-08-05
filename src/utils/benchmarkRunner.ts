import { extractFileId, detectMediaType } from '../core/parser';
import { generateCandidateUrls } from '../core/candidateGenerator';
import { MemoryCache } from '../cache/MemoryCache';

export interface BenchmarkMetric {
  assetCount: number;
  parseTimeMs: number;
  cacheTimeMs: number;
  candidateTimeMs: number;
  opsPerSec: number;
  memoryEstimateMb: number;
}

/**
 * Runs a performance benchmark across N media assets measuring parsing, caching, and candidate URL generation throughput.
 *
 * @param count - Number of assets to benchmark (e.g. 100, 500, 1000, 5000, 10000).
 * @returns BenchmarkMetric performance results object.
 */
export function runBenchmark(count = 1000): BenchmarkMetric {
  const fileIds = Array.from(
    { length: count },
    (_, i) => `1A2b3C4d5E6f7G8h9I0j1K2L3M4N5O_${i.toString().padStart(5, '0')}`,
  );

  // 1. Measure parsing & media type classification
  const parseStart = performance.now();
  for (let i = 0; i < count; i++) {
    const id = fileIds[i];
    if (id) {
      const url = `https://drive.google.com/file/d/${id}/view?type=video`;
      extractFileId(url);
      detectMediaType(url);
    }
  }
  const parseTimeMs = Math.round(performance.now() - parseStart);

  // 2. Measure candidate endpoint generation
  const candStart = performance.now();
  for (let i = 0; i < count; i++) {
    const id = fileIds[i];
    if (id) {
      generateCandidateUrls(id);
    }
  }
  const candidateTimeMs = Math.round(performance.now() - candStart);

  // 3. Measure LRU cache insertions & lookups
  const cache = new MemoryCache(3600000, count);
  const cacheStart = performance.now();
  for (let i = 0; i < count; i++) {
    const id = fileIds[i];
    if (id) {
      cache.set(id, {
        imageUrl: `https://lh3.googleusercontent.com/d/${id}`,
        attemptedEndpoints: ['ep1'],
        successfulEndpoint: 'ep1',
        endpointIndex: 0,
      });
      cache.get(id);
    }
  }
  const cacheTimeMs = Math.round(performance.now() - cacheStart);

  const totalTimeMs = parseTimeMs + candidateTimeMs + cacheTimeMs || 1;
  const opsPerSec = Math.round((count / totalTimeMs) * 1000);
  const memoryEstimateMb = parseFloat(((count * 250) / 1024 / 1024).toFixed(2));

  return {
    assetCount: count,
    parseTimeMs,
    cacheTimeMs,
    candidateTimeMs,
    opsPerSec,
    memoryEstimateMb,
  };
}
