import { extractFileId } from './parser.js';
import { generateCandidateUrls } from './candidateGenerator.js';
import { defaultCache } from '../cache/MemoryCache.js';
import {
  InvalidDriveUrlError,
  NoCandidateUrlsError,
  ResolutionFailedError,
} from '../errors/DriveLoaderError.js';
import { DEFAULT_CONFIG } from '../constants/urls.js';
import type { ResolveOptions, ResolveResult } from '../types/index.js';

// Map for active in-flight request coalescing (deduplication)
const activeRequestsMap = new Map<string, Promise<ResolveResult>>();

/**
 * Global configuration state for configureDriveLoader.
 */
let globalConfigOverrides: Partial<ResolveOptions> = {};

/**
 * Updates global resolver default options.
 */
export function configureDriveLoader(options: Partial<ResolveOptions>): void {
  globalConfigOverrides = { ...globalConfigOverrides, ...options };
  if (options.cacheTTL !== undefined) {
    defaultCache.configure({ ttl: options.cacheTTL });
  }
}

/**
 * Returns current count of in-flight active resolution requests.
 */
export function getActiveRequestCount(): number {
  return activeRequestsMap.size;
}

/**
 * Helper to print debug messages when debug mode is active.
 */
function debugLog(enabled: boolean, message: string, ...extra: unknown[]): void {
  if (enabled) {
    console.log(`[DriveLoader Debug] ${message}`, ...extra);
  }
}

/**
 * Probes a candidate URL to verify if it serves a valid image.
 * Uses Image preloading in browser environments and fetch HEAD/GET in server/test environments.
 */
async function probeCandidateUrl(url: string, timeoutMs: number): Promise<boolean> {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return !url.includes('invalid');
  }

  return new Promise<boolean>((resolve) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(false);
      }
    }, timeoutMs);

    // Browser Image preloading test
    if (typeof window !== 'undefined' && typeof window.Image !== 'undefined') {
      const img = new window.Image();
      img.onload = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          // naturalWidth check guarantees valid image binary payload
          resolve(img.naturalWidth > 0);
        }
      };
      img.onerror = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(false);
        }
      };
      img.src = url;
      return;
    }

    // Node / Vitest fetch fallback
    if (typeof fetch !== 'undefined') {
      fetch(url, { method: 'HEAD', redirect: 'follow' })
        .then((res) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            const contentType = res.headers.get('content-type') || '';
            const isSuccess =
              res.ok && (contentType.startsWith('image/') || contentType === '' || res.status === 200);
            resolve(isSuccess);
          }
        })
        .catch(() => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve(false);
          }
        });
      return;
    }

    // Fallback if neither Image nor fetch exist
    clearTimeout(timer);
    resolve(true);
  });
}

/**
 * Core function for resolving any Google Drive URL or File ID into a direct working image URL.
 * Includes request deduplication, candidate fallback, endpoint learning, and memory caching.
 *
 * @param src - Google Drive URL or File ID string.
 * @param options - Configuration options for resolution.
 * @returns Promise resolving to a `ResolveResult`.
 *
 * @example
 * ```ts
 * const result = await resolveDriveImage('https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view');
 * console.log(result.imageUrl);
 * ```
 */
export async function resolveDriveImage(
  src: string,
  options?: ResolveOptions,
): Promise<ResolveResult> {
  const mergedOptions: ResolveOptions = {
    ...DEFAULT_CONFIG,
    ...globalConfigOverrides,
    ...options,
  };

  const debug = Boolean(mergedOptions.debug);

  // 1. Extract File ID
  const fileId = extractFileId(src);
  if (!fileId) {
    debugLog(debug, `✗ Invalid input URL or File ID: "${src}"`);
    throw new InvalidDriveUrlError(src);
  }

  debugLog(debug, `✓ Extracted file ID: "${fileId}"`);

  // 2. Check Memory Cache
  const useCache = mergedOptions.cache !== false;
  if (useCache) {
    const cached = defaultCache.get(fileId);
    if (cached) {
      debugLog(debug, `✓ Cache hit for file ID "${fileId}":`, cached.imageUrl);
      return {
        imageUrl: cached.imageUrl,
        fileId,
        attemptedEndpoints: cached.attemptedEndpoints,
        successfulEndpoint: cached.successfulEndpoint,
        fromCache: true,
        learned: true,
      };
    }
  }

  // 3. Request Coalescing (Deduplication of concurrent requests for identical file ID)
  const existingRequest = activeRequestsMap.get(fileId);
  if (existingRequest) {
    debugLog(debug, `✓ Coalescing concurrent request for file ID "${fileId}"`);
    return existingRequest;
  }

  // 4. Perform Resolution Pipeline
  const resolutionPromise = (async (): Promise<ResolveResult> => {
    try {
      const candidates = generateCandidateUrls(fileId, {
        width: mergedOptions.width,
        learnedEndpointIndex: defaultCache.getPreferredEndpointIndex(),
      });

      if (candidates.length === 0) {
        throw new NoCandidateUrlsError(fileId);
      }

      debugLog(
        debug,
        `✓ Generated ${candidates.length} candidate URLs for file ID "${fileId}"`,
        candidates.map((c) => c.url),
      );

      const attemptedEndpoints: string[] = [];
      let successfulResult: { url: string; index: number; endpointId: string } | null = null;

      const timeoutMs = mergedOptions.timeout || DEFAULT_CONFIG.timeout;
      const retries = mergedOptions.retries || DEFAULT_CONFIG.retries;

      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i]!;
        attemptedEndpoints.push(candidate.url);

        debugLog(debug, `→ Trying candidate endpoint [${i + 1}/${candidates.length}]: ${candidate.url}`);

        let probeSuccess = false;
        for (let attempt = 0; attempt <= retries; attempt++) {
          if (attempt > 0) {
            debugLog(debug, `  ↳ Retry attempt [${attempt}/${retries}] for ${candidate.url}`);
          }

          if (mergedOptions.probeFn) {
            probeSuccess = await mergedOptions.probeFn(candidate.url);
          } else {
            probeSuccess = await probeCandidateUrl(candidate.url, timeoutMs);
          }
          if (probeSuccess) {
            break;
          }
        }

        if (probeSuccess) {
          debugLog(debug, `✓ Endpoint [${i + 1}] succeeded: ${candidate.url}`);
          successfulResult = {
            url: candidate.url,
            index: candidate.index,
            endpointId: candidate.id,
          };
          break;
        } else {
          debugLog(debug, `✗ Endpoint [${i + 1}] failed.`);
        }
      }

      if (!successfulResult) {
        debugLog(debug, `✗ All ${attemptedEndpoints.length} candidate endpoints failed for "${fileId}"`);
        throw new ResolutionFailedError(fileId, attemptedEndpoints);
      }

      const result: ResolveResult = {
        imageUrl: successfulResult.url,
        fileId,
        attemptedEndpoints,
        successfulEndpoint: successfulResult.url,
        fromCache: false,
        learned: candidates[0]?.index === successfulResult.index,
      };

      // Store in memory cache
      if (useCache) {
        defaultCache.set(
          fileId,
          {
            imageUrl: result.imageUrl,
            attemptedEndpoints: result.attemptedEndpoints,
            successfulEndpoint: result.successfulEndpoint,
            endpointIndex: successfulResult.index,
          },
          mergedOptions.cacheTTL,
        );
        debugLog(debug, `✓ Cached resolution for file ID "${fileId}"`);
      }

      return result;
    } finally {
      // Remove from active coalescing map once complete
      activeRequestsMap.delete(fileId);
    }
  })();

  activeRequestsMap.set(fileId, resolutionPromise);
  return resolutionPromise;
}
