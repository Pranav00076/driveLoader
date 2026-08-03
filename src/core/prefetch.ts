import { resolveDriveImage, resolveDriveVideo } from './resolver';
import type { ResolveOptions, ResolveResult, ResolveVideoResult } from '../types/index';

/**
 * Pre-resolves and preloads a Google Drive image into memory cache in the background.
 *
 * @param src - Google Drive URL or File ID string.
 * @param options - Resolution options.
 * @returns Promise resolving to the `ResolveResult`.
 *
 * @example
 * ```ts
 * prefetch('https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view');
 * ```
 */
export async function prefetch(src: string, options?: ResolveOptions): Promise<ResolveResult> {
  return resolveDriveImage(src, options);
}

/**
 * Pre-resolves and preloads a Google Drive video into memory cache in the background.
 *
 * @param src - Google Drive video URL or File ID string.
 * @param options - Resolution options.
 * @returns Promise resolving to `ResolveVideoResult`.
 *
 * @example
 * ```ts
 * prefetchVideo('https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view');
 * ```
 */
export async function prefetchVideo(
  src: string,
  options?: ResolveOptions,
): Promise<ResolveVideoResult> {
  return resolveDriveVideo(src, options);
}

/**
 * Pre-fetches an audio file into cache.
 */
export async function prefetchAudio(src: string, options?: ResolveOptions) {
  const { resolveDriveAudio } = await import('./audioResolver');
  return resolveDriveAudio(src, options);
}

/**
 * Pre-fetches a document into cache.
 */
export async function prefetchDocument(src: string, options?: ResolveOptions) {
  const { resolveDriveDocument } = await import('./documentResolver');
  return resolveDriveDocument(src, options);
}

/**
 * Pre-fetches a collection of media asset URLs in parallel with concurrency limits.
 */
export async function prefetchGallery(
  urls: string[],
  options?: ResolveOptions & { concurrency?: number },
): Promise<void> {
  const concurrency = options?.concurrency || 4;
  const queue = [...urls];

  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const url = queue.shift();
      if (url) {
        try {
          await prefetch(url, options);
        } catch {
          // Ignore prefetch failures silently
        }
      }
    }
  });

  await Promise.all(workers);
}

/**
 * Pre-fetches assets from a public Google Drive folder.
 */
export async function prefetchFolder(
  folderUrlOrId: string,
  apiKey: string,
  options?: ResolveOptions,
): Promise<void> {
  const { loadFolderAssets } = await import('./folderLoader');
  try {
    const result = await loadFolderAssets({
      folderUrl: folderUrlOrId,
      apiKey,
      ...options,
    });

    const urls = result.assets.map((a) => a.driveUrl);
    await prefetchGallery(urls, options);
  } catch {
    // Ignore folder prefetch errors
  }
}
