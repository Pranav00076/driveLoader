import { extractFolderId } from './folderParser';
import { resolveDriveImages } from './batchResolver';
import {
  InvalidFolderError,
  ApiKeyMissingError,
  FolderLoadError,
} from '../errors/DriveLoaderError';
import type {
  LoadFolderOptions,
  FolderLoadResult,
  DriveFolderMetadata,
  DriveAsset,
} from '../types/index';

interface GoogleDriveFileApiItem {
  id?: string;
  name?: string;
  mimeType?: string;
  size?: string | number;
  createdTime?: string;
  modifiedTime?: string;
  kind?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  parents?: string[];
  owners?: Array<{ displayName?: string; emailAddress?: string }>;
}

/**
 * Extracts lowercase file extension from a file name string.
 */
function getFileExtension(filename: string): string {
  if (!filename || !filename.includes('.')) return '';
  const parts = filename.split('.');
  return (parts[parts.length - 1] || '').toLowerCase();
}

/**
 * Loads all supported media assets (images and videos) from a public Google Drive folder using the official Google Drive API v3.
 * Automatically resolves each asset through the existing DriveLoader resolution engine to leverage caching,
 * endpoint learning, and request deduplication.
 *
 * @param options - Folder loading configuration options including folderUrl/folderId and apiKey.
 * @returns Promise resolving to a `FolderLoadResult` object.
 *
 * @example
 * ```ts
 * const result = await loadFolderAssets({
 *   folderUrl: 'https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J',
 *   apiKey: 'YOUR_GOOGLE_DRIVE_API_KEY',
 *   mediaTypes: ['image'],
 *   pageSize: 50,
 * });
 * console.log(result.folder?.name, result.assets);
 * ```
 */
export async function loadFolderAssets(options: LoadFolderOptions): Promise<FolderLoadResult> {
  const folderInput = options.folderId || options.folderUrl;
  if (!folderInput) {
    throw new InvalidFolderError('', 'No folderId or folderUrl specified.');
  }

  const folderId = extractFolderId(folderInput);
  if (!folderId) {
    throw new InvalidFolderError(folderInput);
  }

  if (!options.apiKey || typeof options.apiKey !== 'string' || !options.apiKey.trim()) {
    throw new ApiKeyMissingError();
  }

  const apiKey = options.apiKey.trim();
  const mediaTypes = options.mediaTypes || ['image', 'video'];
  const pageSize = options.pageSize || 100;
  const signal = options.signal;

  // 1. Fetch Folder Metadata via files.get
  let folderMetadata: DriveFolderMetadata | null = null;
  try {
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,webViewLink,createdTime,modifiedTime&key=${apiKey}`;
    const metaRes = await fetch(metaUrl, { signal });
    if (metaRes.ok) {
      const metaData = (await metaRes.json()) as DriveFolderMetadata;
      folderMetadata = {
        id: metaData.id || folderId,
        name: metaData.name || 'Google Drive Folder',
        webViewLink: metaData.webViewLink,
        createdTime: metaData.createdTime,
        modifiedTime: metaData.modifiedTime,
      };
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    // Non-critical if folder metadata fails but file list succeeds
  }

  // 2. Fetch Files List via files.list
  const query = `'${folderId}' in parents and trashed = false`;
  const fields =
    'nextPageToken,files(id,name,mimeType,size,createdTime,modifiedTime,kind,webViewLink,iconLink,thumbnailLink,parents,owners)';

  let listUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query,
  )}&fields=${encodeURIComponent(fields)}&pageSize=${pageSize}&key=${apiKey}`;

  if (options.orderBy) {
    listUrl += `&orderBy=${encodeURIComponent(options.orderBy)}`;
  }

  if (options.pageToken) {
    listUrl += `&pageToken=${encodeURIComponent(options.pageToken)}`;
  }

  let listData: { nextPageToken?: string; files?: GoogleDriveFileApiItem[] };
  try {
    const listRes = await fetch(listUrl, { signal });
    if (!listRes.ok) {
      const errorJson = await listRes.json().catch(() => ({}));
      const errorMsg = errorJson?.error?.message || `HTTP ${listRes.status} ${listRes.statusText}`;
      throw new FolderLoadError(folderId, errorMsg, listRes.status);
    }
    listData = await listRes.json();
  } catch (err) {
    if (err instanceof FolderLoadError || (err instanceof Error && err.name === 'AbortError')) {
      throw err;
    }
    throw new FolderLoadError(folderId, err instanceof Error ? err.message : String(err));
  }

  const rawFiles = listData.files || [];

  // 3. Filter Media Types & Extensions
  const normalizedExtensions = options.extensions
    ? options.extensions.map((ext) => ext.toLowerCase().replace(/^\./, ''))
    : null;

  const matchedFiles = rawFiles.filter(
    (file): file is GoogleDriveFileApiItem & { id: string; mimeType: string } => {
      if (!file || !file.id || !file.mimeType) return false;

      const isImage = file.mimeType.startsWith('image/');
      const isVideo = file.mimeType.startsWith('video/');

      if (isImage && !mediaTypes.includes('image')) return false;
      if (isVideo && !mediaTypes.includes('video')) return false;
      if (!isImage && !isVideo) return false;

      if (normalizedExtensions && normalizedExtensions.length > 0) {
        const ext = getFileExtension(file.name || '');
        if (!normalizedExtensions.includes(ext)) {
          return false;
        }
      }

      return true;
    },
  );

  if (matchedFiles.length === 0) {
    return {
      folder: folderMetadata,
      assets: [],
      nextPageToken: listData.nextPageToken,
      hasMore: Boolean(listData.nextPageToken),
      totalLoaded: 0,
    };
  }

  // 4. Concurrently Resolve Candidate Image URLs using existing resolveDriveImages pipeline
  const fileIds = matchedFiles.map((f) => f.id);
  const batchRes = await resolveDriveImages(fileIds, {
    concurrency: options.concurrency || 4,
    cache: options.cache,
    cacheTTL: options.cacheTTL,
    timeout: options.timeout,
    debug: options.debug,
    probeFn: options.probeFn,
  });

  // Map resolved results to DriveAsset array
  const assets: DriveAsset[] = matchedFiles.map((file, index) => {
    const isVideo = file.mimeType.startsWith('video/');
    const extension = getFileExtension(file.name || '');
    const batchItem = batchRes.results[index];
    const resolvedUrl =
      batchItem?.result?.imageUrl || `https://lh3.googleusercontent.com/d/${file.id}`;

    const fallbackThumbnail = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;
    const thumbnailUrl = file.thumbnailLink || fallbackThumbnail;

    return {
      id: file.id,
      name: file.name || 'Untitled Media',
      mimeType: file.mimeType,
      type: isVideo ? 'video' : 'image',
      extension,
      size: file.size ? Number(file.size) : undefined,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      driveUrl: `https://drive.google.com/file/d/${file.id}/view`,
      resolvedUrl,
      thumbnailUrl,
      kind: file.kind,
      webViewLink: file.webViewLink,
      iconLink: file.iconLink,
      thumbnailLink: file.thumbnailLink,
      parents: file.parents,
      owners: file.owners,
    };
  });

  return {
    folder: folderMetadata,
    assets,
    nextPageToken: listData.nextPageToken,
    hasMore: Boolean(listData.nextPageToken),
    totalLoaded: assets.length,
  };
}
