import { useState, useEffect, useCallback, useRef } from 'react';
import { loadFolderAssets } from '../core/folderLoader.js';
import type {
  LoadFolderOptions,
  UseDriveFolderResult,
  DriveAsset,
  DriveFolderMetadata,
  FolderLoadResult,
} from '../types/index.js';

/**
 * Custom React Hook for stateful Google Drive folder loading with pagination support.
 *
 * @param options - Folder loading configuration options including folderUrl/folderId and apiKey.
 * @returns State object containing folder metadata, accumulated assets, loading, error, reload, loadMore, hasMore, and totalLoaded.
 *
 * @example
 * ```tsx
 * const { assets, loading, error, loadMore, hasMore } = useDriveFolder({
 *   folderUrl: 'https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J',
 *   apiKey: 'YOUR_API_KEY',
 * });
 * ```
 */
export function useDriveFolder(options: LoadFolderOptions): UseDriveFolderResult {
  const optionsRef = useRef<LoadFolderOptions>(options);
  optionsRef.current = options;

  const [folder, setFolder] = useState<DriveFolderMetadata | null>(null);
  const [assets, setAssets] = useState<DriveAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const folderInput = options.folderId || options.folderUrl;
  const apiKey = options.apiKey;
  const pageSize = options.pageSize;
  const orderBy = options.orderBy;

  // Key tracking to reset pagination when options change
  const currentKey = `${folderInput}-${apiKey}-${pageSize}-${orderBy}-${(options.mediaTypes || []).join(',')}-${(options.extensions || []).join(',')}`;

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    async function fetchPageOne() {
      if (!folderInput || !apiKey) {
        if (!ignore) {
          setFolder(null);
          setAssets([]);
          setLoading(false);
          setError(null);
          setNextPageToken(undefined);
          setHasMore(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      const opts: LoadFolderOptions = {
        ...optionsRef.current,
        pageToken: undefined,
        signal: controller.signal,
      };

      try {
        const result: FolderLoadResult = await loadFolderAssets(opts);
        if (!ignore) {
          setFolder(result.folder);
          setAssets(result.assets);
          setNextPageToken(result.nextPageToken);
          setHasMore(result.hasMore);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          if (err instanceof Error && err.name === 'AbortError') return;
          const folderErr = err instanceof Error ? err : new Error(String(err));
          setFolder(null);
          setAssets([]);
          setError(folderErr);
          setLoading(false);
          setNextPageToken(undefined);
          setHasMore(false);
        }
      }
    }

    fetchPageOne();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [currentKey, folderInput, apiKey, reloadTrigger]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !nextPageToken || !folderInput || !apiKey) {
      return;
    }

    setLoading(true);

    const opts: LoadFolderOptions = {
      ...optionsRef.current,
      pageToken: nextPageToken,
    };

    try {
      const result: FolderLoadResult = await loadFolderAssets(opts);
      setAssets((prev) => [...prev, ...result.assets]);
      if (result.folder && !folder) {
        setFolder(result.folder);
      }
      setNextPageToken(result.nextPageToken);
      setHasMore(result.hasMore);
      setError(null);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const folderErr = err instanceof Error ? err : new Error(String(err));
      setError(folderErr);
      setLoading(false);
    }
  }, [loading, hasMore, nextPageToken, folderInput, apiKey, folder]);

  const reload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  return {
    folder,
    assets,
    loading,
    error,
    reload,
    loadMore,
    hasMore,
    nextPageToken,
    totalLoaded: assets.length,
  };
}
