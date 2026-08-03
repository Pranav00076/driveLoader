import { defaultCache } from '../cache/MemoryCache';
import { defaultStorageEngine } from '../cache/StorageEngine';
import { getActiveRequestCount } from '../core/resolver';
import type { CacheInspectionResult, CacheStats } from '../types/index';

export {
  extractFileId,
  isGoogleDriveUrl,
  detectUrlFormat,
  isDriveVideo,
  isDriveAudio,
  isDriveDocument,
  detectMediaType,
} from '../core/parser';
export { extractFolderId, isGoogleDriveFolder } from '../core/folderParser';
export { generateCandidateUrls } from '../core/candidateGenerator';
export { resolveDriveImage, resolveDriveVideo, configureDriveLoader } from '../core/resolver';
export { resolveDriveImages } from '../core/batchResolver';
export { loadFolderAssets } from '../core/folderLoader';
export { analyzeDriveUrl } from '../core/diagnostics';
export { prefetch, prefetchVideo } from '../core/prefetch';
export { extractVideoMetadata, getVideoThumbnail } from '../core/videoMetadata';

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
  defaultStorageEngine.clear();
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

/**
 * Inspects all cached entries across Memory, SessionStorage, and IndexedDB.
 *
 * @returns Promise resolving to CacheInspectionResult with stats and detailed entry items.
 */
export async function inspectCache(): Promise<CacheInspectionResult> {
  return defaultStorageEngine.inspectCache();
}
