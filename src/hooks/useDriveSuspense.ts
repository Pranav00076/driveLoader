import { resolveDriveImage } from '../core/resolver';
import type { ResolveOptions, ResolveResult } from '../types/index';

const suspenseCache = new Map<
  string,
  {
    status: 'pending' | 'success' | 'error';
    value?: ResolveResult;
    error?: Error;
    promise?: Promise<void>;
  }
>();

/**
 * Suspense-compatible hook for fetching Google Drive images.
 * Throws a Promise when pending to trigger React `<Suspense>` boundaries.
 *
 * @param src - Google Drive image URL or file ID.
 * @param options - Resolution options.
 * @returns ResolveResult once loaded.
 */
export function useDriveImageSuspense(src: string, options?: ResolveOptions): ResolveResult {
  const cacheKey = `${src}-${JSON.stringify(options || {})}`;

  let entry = suspenseCache.get(cacheKey);

  if (!entry) {
    let status: 'pending' | 'success' | 'error' = 'pending';
    let value: ResolveResult | undefined;
    let error: Error | undefined;

    const promise = resolveDriveImage(src, options)
      .then((res) => {
        status = 'success';
        value = res;
        entry!.status = 'success';
        entry!.value = res;
      })
      .catch((err) => {
        status = 'error';
        error = err instanceof Error ? err : new Error(String(err));
        entry!.status = 'error';
        entry!.error = error;
      });

    entry = { status, value, error, promise };
    suspenseCache.set(cacheKey, entry);
  }

  if (entry.status === 'pending') {
    throw entry.promise;
  }

  if (entry.status === 'error') {
    throw entry.error;
  }

  return entry.value!;
}
