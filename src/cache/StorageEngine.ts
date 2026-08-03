import type {
  CacheEntryDetails,
  CacheInspectionResult,
  CacheStats,
  CacheStorageEngine,
} from '../types/index';
import { MemoryCache, type CacheEntry, defaultCache } from './MemoryCache';

const CACHE_VERSION = 'driveloader_v1_';
const INDEXEDDB_DB_NAME = 'DriveLoaderCacheDB';
const INDEXEDDB_STORE_NAME = 'media_cache';

/**
 * StorageEngine coordinates multi-tiered caching (Memory, SessionStorage, IndexedDB).
 */
export class StorageEngine {
  private memoryCache: MemoryCache;
  private primaryEngine: CacheStorageEngine;
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  constructor(
    memoryCache: MemoryCache = defaultCache,
    primaryEngine: CacheStorageEngine = 'memory',
  ) {
    this.memoryCache = memoryCache;
    this.primaryEngine = primaryEngine;
    this.initIndexedDB();
  }

  /**
   * Initializes IndexedDB database connection safely (isomorphic/SSR friendly).
   */
  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise<IDBDatabase | null>((resolve) => {
        try {
          const request = window.indexedDB.open(INDEXEDDB_DB_NAME, 1);
          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(INDEXEDDB_STORE_NAME)) {
              db.createObjectStore(INDEXEDDB_STORE_NAME, { keyPath: 'fileId' });
            }
          };
          request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
          };
          request.onerror = () => {
            resolve(null);
          };
        } catch {
          resolve(null);
        }
      });
    }

    return this.dbPromise;
  }

  /**
   * Gets item from cache across tiers.
   */
  public async get(fileId: string): Promise<CacheEntry | null> {
    // Tier 1: Memory
    const memEntry = this.memoryCache.get(fileId);
    if (memEntry) return memEntry;

    // Tier 2: Session Storage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const raw = window.sessionStorage.getItem(CACHE_VERSION + fileId);
        if (raw) {
          const entry: CacheEntry = JSON.parse(raw);
          if (Date.now() <= entry.expiresAt) {
            // Warm up memory cache
            this.memoryCache.set(fileId, entry);
            return entry;
          } else {
            window.sessionStorage.removeItem(CACHE_VERSION + fileId);
          }
        }
      } catch {
        // Ignore session storage errors
      }
    }

    // Tier 3: IndexedDB
    const db = await this.initIndexedDB();
    if (db) {
      try {
        const entry = await new Promise<CacheEntry | null>((resolve) => {
          const tx = db.transaction(INDEXEDDB_STORE_NAME, 'readonly');
          const store = tx.objectStore(INDEXEDDB_STORE_NAME);
          const req = store.get(fileId);
          req.onsuccess = () => {
            const result = req.result as CacheEntry | undefined;
            if (result && Date.now() <= result.expiresAt) {
              resolve(result);
            } else {
              resolve(null);
            }
          };
          req.onerror = () => resolve(null);
        });

        if (entry) {
          this.memoryCache.set(fileId, entry);
          return entry;
        }
      } catch {
        // Ignore IndexedDB read errors
      }
    }

    return null;
  }

  /**
   * Synchronous check from memory or sessionStorage.
   */
  public getSync(fileId: string): CacheEntry | null {
    return this.memoryCache.get(fileId);
  }

  /**
   * Stores item in cache across selected tiers.
   */
  public async set(
    fileId: string,
    entryData: Omit<CacheEntry, 'fileId' | 'createdAt' | 'expiresAt'>,
    ttl?: number,
    engine: CacheStorageEngine = this.primaryEngine,
  ): Promise<CacheEntry> {
    const entry = this.memoryCache.set(fileId, entryData, ttl);

    // Write to SessionStorage if selected or session storage is active
    if (engine === 'session' || engine === 'indexeddb') {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
          window.sessionStorage.setItem(CACHE_VERSION + fileId, JSON.stringify(entry));
        } catch {
          // Fallback gracefully on storage full
        }
      }
    }

    // Write to IndexedDB if requested
    if (engine === 'indexeddb') {
      const db = await this.initIndexedDB();
      if (db) {
        try {
          const tx = db.transaction(INDEXEDDB_STORE_NAME, 'readwrite');
          const store = tx.objectStore(INDEXEDDB_STORE_NAME);
          store.put(entry);
        } catch {
          // Fallback gracefully on DB error
        }
      }
    }

    return entry;
  }

  /**
   * Clears cache across all tiers.
   */
  public async clear(): Promise<void> {
    this.memoryCache.clear();

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          if (key && key.startsWith(CACHE_VERSION)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
      } catch {
        // Ignore session clear error
      }
    }

    const db = await this.initIndexedDB();
    if (db) {
      try {
        const tx = db.transaction(INDEXEDDB_STORE_NAME, 'readwrite');
        const store = tx.objectStore(INDEXEDDB_STORE_NAME);
        store.clear();
      } catch {
        // Ignore DB clear error
      }
    }
  }

  /**
   * Inspects cache state across memory, session, and IndexedDB for debugging.
   */
  public async inspectCache(): Promise<CacheInspectionResult> {
    const stats: CacheStats = this.memoryCache.getStats();
    const entries: CacheEntryDetails[] = [];

    // Collect memory entries
    const memStats = this.memoryCache.getStats();
    entries.push({
      key: 'Memory Summary',
      url: `${memStats.cachedEntries} items cached`,
      engine: 'memory',
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      hitCount: memStats.cacheHits,
    });

    // Check Session Storage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          if (key && key.startsWith(CACHE_VERSION)) {
            const raw = window.sessionStorage.getItem(key);
            if (raw) {
              const entry: CacheEntry = JSON.parse(raw);
              entries.push({
                key: entry.fileId,
                url: entry.imageUrl || entry.videoUrl || '',
                engine: 'session',
                createdAt: entry.createdAt,
                expiresAt: entry.expiresAt,
                sizeBytes: raw.length,
                hitCount: 1,
              });
            }
          }
        }
      } catch {
        // Ignore session inspection errors
      }
    }

    return {
      stats,
      entries,
    };
  }
}

/**
 * Singleton StorageEngine instance.
 */
export const defaultStorageEngine = new StorageEngine();
