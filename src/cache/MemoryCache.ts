import type { CacheStats, DriveVideoMetadata } from '../types/index.js';

export interface CacheEntry {
  imageUrl: string;
  fileId: string;
  attemptedEndpoints: string[];
  successfulEndpoint: string;
  endpointIndex: number;
  createdAt: number;
  expiresAt: number;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  thumbnailUrl?: string;
  metadata?: DriveVideoMetadata;
}


/**
 * In-Memory LRU & TTL cache with Endpoint Learning and stats collection.
 */
export class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  private learnedEndpointCounts = new Map<number, number>();
  private defaultTTL: number;
  private maxSize: number;

  private hits = 0;
  private misses = 0;

  constructor(defaultTTL = 3600000, maxSize = 500) {
    this.defaultTTL = defaultTTL;
    this.maxSize = maxSize;
  }

  /**
   * Reconfigures cache parameters.
   */
  public configure(options: { ttl?: number; maxSize?: number }): void {
    if (options.ttl !== undefined && options.ttl > 0) {
      this.defaultTTL = options.ttl;
    }
    if (options.maxSize !== undefined && options.maxSize > 0) {
      this.maxSize = options.maxSize;
      this.enforceCapacity();
    }
  }

  /**
   * Retrieves an unexpired item from cache.
   */
  public get(fileId: string): CacheEntry | null {
    const entry = this.cache.get(fileId);
    if (!entry) {
      this.misses++;
      return null;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(fileId);
      this.misses++;
      return null;
    }

    // Refresh LRU order (delete and re-insert)
    this.cache.delete(fileId);
    this.cache.set(fileId, entry);

    this.hits++;
    return entry;
  }

  /**
   * Stores a resolved image result in cache.
   */
  public set(
    fileId: string,
    entryData: Omit<CacheEntry, 'fileId' | 'createdAt' | 'expiresAt'>,
    ttl = this.defaultTTL,
  ): CacheEntry {
    const now = Date.now();
    const entry: CacheEntry = {
      ...entryData,
      fileId,
      createdAt: now,
      expiresAt: now + ttl,
    };

    // If key exists, remove it first to maintain LRU insertion order
    if (this.cache.has(fileId)) {
      this.cache.delete(fileId);
    }

    this.cache.set(fileId, entry);

    // Record learned endpoint for global endpoint prioritization
    this.recordLearnedEndpoint(entryData.endpointIndex);

    this.enforceCapacity();
    return entry;
  }

  /**
   * Checks if an unexpired key exists in cache.
   */
  public has(fileId: string): boolean {
    const entry = this.cache.get(fileId);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(fileId);
      return false;
    }
    return true;
  }

  /**
   * Deletes a key from cache.
   */
  public delete(fileId: string): boolean {
    return this.cache.delete(fileId);
  }

  /**
   * Clears all cached items and resets metrics.
   */
  public clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.learnedEndpointCounts.clear();
  }

  /**
   * Returns remaining TTL for a cached key in milliseconds, or null if not cached.
   */
  public getRemainingTTL(fileId: string): number | null {
    const entry = this.cache.get(fileId);
    if (!entry) return null;
    const remaining = entry.expiresAt - Date.now();
    return remaining > 0 ? remaining : null;
  }

  /**
   * Increments successful endpoint index frequency count for Endpoint Learning optimization.
   */
  public recordLearnedEndpoint(index: number): void {
    const current = this.learnedEndpointCounts.get(index) || 0;
    this.learnedEndpointCounts.set(index, current + 1);
  }

  /**
   * Returns the most frequently successful endpoint index learned from previous resolutions.
   */
  public getPreferredEndpointIndex(): number | null {
    let topIndex: number | null = null;
    let maxCount = 0;

    for (const [index, count] of this.learnedEndpointCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        topIndex = index;
      }
    }

    return topIndex;
  }

  /**
   * Computes and returns real-time cache performance statistics.
   */
  public getStats(activeRequests = 0): CacheStats {
    this.purgeExpired();

    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? Math.round((this.hits / totalRequests) * 1000) / 10 : 0;
    const estimatedBytes = this.cache.size * 250; // approx 250 bytes per entry metadata

    let memoryUsageEstimate = `${estimatedBytes} B`;
    if (estimatedBytes > 1024 * 1024) {
      memoryUsageEstimate = `${(estimatedBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (estimatedBytes > 1024) {
      memoryUsageEstimate = `${(estimatedBytes / 1024).toFixed(2)} KB`;
    }

    return {
      cacheHits: this.hits,
      cacheMisses: this.misses,
      hitRate,
      cachedEntries: this.cache.size,
      activeRequests,
      learnedEndpoints: this.learnedEndpointCounts.size,
      memoryUsageEstimate,
    };
  }

  /**
   * Evicts oldest LRU items if capacity limit is exceeded.
   */
  private enforceCapacity(): void {
    while (this.cache.size > this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      } else {
        break;
      }
    }
  }

  /**
   * Removes expired items from memory.
   */
  public purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Singleton instance of the default MemoryCache.
 */
export const defaultCache = new MemoryCache();
