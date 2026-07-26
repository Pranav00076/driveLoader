import { useState, useEffect, useCallback, useRef } from 'react';
import { resolveDriveImage } from '../core/resolver';
import { generateCandidateUrls } from '../core/candidateGenerator';
import { extractFileId } from '../core/parser';
import { useDriveLoaderConfig } from '../context/DriveLoaderContext';
import type { ResolveOptions, ResolveResult } from '../types/index';

export interface UseDriveImageResult {
  /** The working direct image URL, or null if loading or failed */
  imageUrl: string | null;
  /** Whether resolution or image preloading is currently in progress */
  loading: boolean;
  /** Error object if resolution failed, null otherwise */
  error: Error | null;
  /** True if image resolution completed successfully */
  isSuccess: boolean;
  /** True if image resolution failed */
  isError: boolean;
  /** Candidate URLs generated for this Google Drive file ID */
  candidateUrls: string[];
  /** Function to trigger manual reload/re-resolution */
  reload: (options?: { bypassCache?: boolean }) => void;
}

/**
 * Custom React Hook for stateful Google Drive image resolution.
 *
 * @param src - Google Drive URL or File ID.
 * @param options - Local resolution options overriding global context config.
 * @returns State object containing imageUrl, loading, error, and reload callback.
 *
 * @example
 * ```tsx
 * const { imageUrl, loading, error, reload } = useDriveImage('https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view');
 * ```
 */
export function useDriveImage(src: string, options?: ResolveOptions): UseDriveImageResult {
  const globalConfig = useDriveLoaderConfig();

  const optionsRef = useRef<ResolveOptions | undefined>(options);
  optionsRef.current = options;

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [candidateUrls, setCandidateUrls] = useState<string[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const fileId = extractFileId(src);

  const widthOpt = options?.width;

  useEffect(() => {
    if (fileId) {
      const candidates = generateCandidateUrls(fileId, { width: widthOpt });
      setCandidateUrls(candidates.map((c) => c.url));
    } else {
      setCandidateUrls([]);
    }
  }, [fileId, widthOpt]);

  useEffect(() => {
    let ignore = false;

    async function executeResolution() {
      if (!src) {
        if (!ignore) {
          setImageUrl(null);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);

      const localOpts = optionsRef.current;
      const resolveOpts: ResolveOptions = {
        cacheTTL: localOpts?.cacheTTL ?? globalConfig.cacheTTL,
        retries: localOpts?.retries ?? globalConfig.retries,
        timeout: localOpts?.timeout ?? globalConfig.timeout,
        debug: localOpts?.debug ?? globalConfig.debug,
        cache: localOpts?.cache ?? true,
        width: localOpts?.width,
        probeFn: localOpts?.probeFn,
      };

      try {
        const result: ResolveResult = await resolveDriveImage(src, resolveOpts);
        if (!ignore) {
          setImageUrl(result.imageUrl);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          const resolveErr = err instanceof Error ? err : new Error(String(err));
          setImageUrl(null);
          setError(resolveErr);
          setLoading(false);
        }
      }
    }

    executeResolution();

    return () => {
      ignore = true;
    };
  }, [
    src,
    reloadTrigger,
    globalConfig.cacheTTL,
    globalConfig.retries,
    globalConfig.timeout,
    globalConfig.debug,
  ]);

  const reload = useCallback((_reloadOpts?: { bypassCache?: boolean }) => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  return {
    imageUrl,
    loading,
    error,
    isSuccess: !loading && imageUrl !== null,
    isError: !loading && error !== null,
    candidateUrls,
    reload,
  };
}
