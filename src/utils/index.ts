import { defaultCache } from '../cache/MemoryCache.js';
import { getActiveRequestCount } from '../core/resolver.js';
import type { CacheStats } from '../types/index.js';

export { extractFileId, isGoogleDriveUrl, detectUrlFormat } from '../core/parser.js';
export { generateCandidateUrls } from '../core/candidateGenerator.js';
export { resolveDriveImage, configureDriveLoader } from '../core/resolver.js';
export { resolveDriveImages } from '../core/batchResolver.js';
export { analyzeDriveUrl } from '../core/diagnostics.js';
export { prefetch } from '../core/prefetch.js';

/**
 * Clears all cached Google Drive image resolutions and resets performance metrics.
 *
 * @example
 * ```ts
 * clearCache();
 * ```
 */
export function clearCache(): void {
  defaultCache.clear();
}

/**
 * Returns real-time performance and usage metrics for the memory cache.
 *
 * @returns `CacheStats` object containing hits, misses, hit rate, active requests, and memory usage.
 *
 * @example
 * ```ts
 * const stats = getCacheStats();
 * console.log(`Cache Hit Rate: ${stats.hitRate}%`);
 * ```
 */
export function getCacheStats(): CacheStats {
  return defaultCache.getStats(getActiveRequestCount());
}
