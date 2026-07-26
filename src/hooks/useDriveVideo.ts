import { useState, useEffect, useCallback, useRef } from 'react';
import { resolveDriveVideo } from '../core/resolver';
import { generateCandidateUrls } from '../core/candidateGenerator';
import { extractFileId } from '../core/parser';
import { getVideoThumbnail } from '../core/videoMetadata';
import { useDriveLoaderConfig } from '../context/DriveLoaderContext';
export type { UseDriveVideoResult };
import type {
  ResolveOptions,
  ResolveVideoResult,
  DriveVideoMetadata,
  UseDriveVideoResult,
} from '../types/index';

/**
 * Custom React Hook for stateful Google Drive video resolution and metadata extraction.
 *
 * @param src - Google Drive video URL or File ID.
 * @param options - Local resolution options overriding global context config.
 * @returns State object containing videoUrl, loading, error, reload callback, metadata, and thumbnailUrl.
 *
 * @example
 * ```tsx
 * const { videoUrl, loading, error, metadata, thumbnailUrl, reload } = useDriveVideo(
 *   'https://drive.google.com/file/d/1A2b3C4d5E6f7G8h9I0j/view'
 * );
 * ```
 */
export function useDriveVideo(src: string, options?: ResolveOptions): UseDriveVideoResult {
  const globalConfig = useDriveLoaderConfig();

  const optionsRef = useRef<ResolveOptions | undefined>(options);
  optionsRef.current = options;

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [metadata, setMetadata] = useState<DriveVideoMetadata | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [candidateUrls, setCandidateUrls] = useState<string[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const fileId = extractFileId(src);
  const widthOpt = options?.width;

  useEffect(() => {
    if (fileId) {
      const candidates = generateCandidateUrls(fileId, { width: widthOpt });
      setCandidateUrls(candidates.map((c) => c.url));
      setThumbnailUrl(getVideoThumbnail(src, { width: widthOpt }));
    } else {
      setCandidateUrls([]);
      setThumbnailUrl(null);
    }
  }, [fileId, src, widthOpt]);

  useEffect(() => {
    let ignore = false;

    async function executeResolution() {
      if (!src) {
        if (!ignore) {
          setVideoUrl(null);
          setLoading(false);
          setError(null);
          setMetadata(null);
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
        const result: ResolveVideoResult = await resolveDriveVideo(src, resolveOpts);
        if (!ignore) {
          setVideoUrl(result.videoUrl);
          setMetadata(result.metadata);
          setThumbnailUrl(result.thumbnailUrl);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          const resolveErr = err instanceof Error ? err : new Error(String(err));
          setVideoUrl(null);
          setMetadata(null);
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
    videoUrl,
    loading,
    error,
    isSuccess: !loading && videoUrl !== null,
    isError: !loading && error !== null,
    candidateUrls,
    reload,
    metadata,
    thumbnailUrl,
  };
}
