import { resolveDriveImage } from './resolver';
import type { BatchResolveOptions, BatchResolveResult, BatchResolveItem } from '../types/index';
import { DEFAULT_CONFIG } from '../constants/urls';

/**
 * Concurrently resolves an array of Google Drive URLs or File IDs.
 * Preserves input array ordering, utilizes shared cache, deduplicates concurrent items,
 * and controls worker concurrency limit.
 *
 * @param urls - Array of Google Drive URLs or File IDs.
 * @param options - Options controlling batch concurrency, cache, and timeout.
 * @returns Promise resolving to a `BatchResolveResult` summary.
 *
 * @example
 * ```ts
 * const { results, successful, failed } = await resolveDriveImages([
 *   'https://drive.google.com/file/d/ID_1/view',
 *   'https://drive.google.com/file/d/ID_2/view',
 * ], { concurrency: 3 });
 * ```
 */
export async function resolveDriveImages(
  urls: string[],
  options?: BatchResolveOptions,
): Promise<BatchResolveResult> {
  if (!Array.isArray(urls) || urls.length === 0) {
    return {
      results: [],
      total: 0,
      successful: 0,
      failed: 0,
    };
  }

  const concurrency = options?.concurrency || DEFAULT_CONFIG.concurrency;
  const results: BatchResolveItem[] = new Array(urls.length);

  let currentIndex = 0;
  let successfulCount = 0;
  let failedCount = 0;

  async function worker(): Promise<void> {
    while (currentIndex < urls.length) {
      const index = currentIndex++;
      const inputUrl = urls[index]!;

      try {
        const result = await resolveDriveImage(inputUrl, options);
        results[index] = {
          inputUrl,
          result,
          error: null,
        };
        successfulCount++;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        results[index] = {
          inputUrl,
          result: null,
          error,
        };
        failedCount++;
      }
    }
  }

  // Launch initial worker pool up to concurrency limit
  const poolSize = Math.min(concurrency, urls.length);
  const workers: Promise<void>[] = [];

  for (let i = 0; i < poolSize; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  return {
    results,
    total: urls.length,
    successful: successfulCount,
    failed: failedCount,
  };
}
