import { resolveDriveImage } from './resolver.js';
import type { ResolveOptions, ResolveResult } from '../types/index.js';

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
