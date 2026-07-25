import type React from 'react';

/**
 * Recognized Google Drive URL formats.
 */
export type DriveUrlFormat =
  | 'file_d'
  | 'open_id'
  | 'uc_id'
  | 'docs_uc'
  | 'lh3'
  | 'usercontent'
  | 'raw_id'
  | 'unknown';

/**
 * Configuration options for image resolution.
 */
export interface ResolveOptions {
  /** Enable memory caching for resolved image endpoints. Default: true */
  cache?: boolean;
  /** Cache Time-To-Live in milliseconds. Default: 3600000 (1 hour) */
  cacheTTL?: number;
  /** Timeout in milliseconds per candidate endpoint probe. Default: 8000 (8 seconds) */
  timeout?: number;
  /** Number of retry attempts per endpoint. Default: 2 */
  retries?: number;
  /** Desired target image width for thumbnail endpoints. Default: 1000 */
  width?: number;
  /** Enable developer console logging for diagnostic step tracking. Default: false */
  debug?: boolean;
  /** Custom candidate endpoint probe handler (useful for testing or custom proxies) */
  probeFn?: (url: string) => Promise<boolean>;
}

/**
 * Successful image resolution result.
 */
export interface ResolveResult {
  /** Final working direct image URL */
  imageUrl: string;
  /** Extracted Google Drive File ID */
  fileId: string;
  /** Array of candidate endpoints attempted */
  attemptedEndpoints: string[];
  /** The candidate URL template/endpoint that succeeded */
  successfulEndpoint: string;
  /** Whether the resolution result was served from cache */
  fromCache: boolean;
  /** Whether an endpoint learning priority was applied */
  learned: boolean;
}

/**
 * Options for batch image resolution.
 */
export interface BatchResolveOptions extends ResolveOptions {
  /** Maximum number of concurrent resolution worker tasks. Default: 4 */
  concurrency?: number;
}

/**
 * Item result within a batch resolution response.
 */
export interface BatchResolveItem {
  /** Original input URL or string */
  inputUrl: string;
  /** Successful resolution result, if resolved */
  result: ResolveResult | null;
  /** Error instance if resolution failed */
  error: Error | null;
}

/**
 * Full result returned by resolveDriveImages.
 */
export interface BatchResolveResult {
  /** Array of item results preserving input order */
  results: BatchResolveItem[];
  /** Total items processed */
  total: number;
  /** Number of successfully resolved items */
  successful: number;
  /** Number of failed items */
  failed: number;
}

/**
 * Diagnostics output object returned by analyzeDriveUrl.
 */
export interface UrlDiagnostics {
  /** Whether the input string is a valid Google Drive URL or File ID */
  valid: boolean;
  /** Extracted Google Drive File ID, or null if invalid */
  fileId: string | null;
  /** Recognized Google Drive link pattern variant */
  detectedFormat: DriveUrlFormat;
  /** Ordered list of generated candidate direct image URLs */
  candidateUrls: string[];
  /** Whether this file ID's resolution is currently cached */
  cached: boolean;
  /** Remaining Cache TTL in milliseconds, or null if not cached */
  cacheTTL: number | null;
  /** List of actionable recommendations for link optimization */
  recommendations: string[];
  /** List of warnings or permission flags */
  warnings: string[];
}

/**
 * Performance and usage metrics returned by getCacheStats.
 */
export interface CacheStats {
  /** Total cache hits */
  cacheHits: number;
  /** Total cache misses */
  cacheMisses: number;
  /** Cache hit percentage rate (0 - 100) */
  hitRate: number;
  /** Number of active cached entries */
  cachedEntries: number;
  /** Number of currently coalesced/in-flight background resolution requests */
  activeRequests: number;
  /** Number of learned endpoint preferences remembered */
  learnedEndpoints: number;
  /** Estimated memory consumption summary */
  memoryUsageEstimate: string;
}

/**
 * Metadata representing a Google Drive folder.
 */
export interface DriveFolderMetadata {
  /** Unique Google Drive Folder ID */
  id: string;
  /** Name of the folder */
  name: string;
  /** Web viewing link for the folder in Google Drive */
  webViewLink?: string;
  /** ISO timestamp when the folder was created */
  createdTime?: string;
  /** ISO timestamp when the folder was last modified */
  modifiedTime?: string;
}

/**
 * A resolved media asset (image or video) loaded from a Google Drive folder.
 */
export interface DriveAsset {
  /** Unique Google Drive File ID */
  id: string;
  /** Original file name */
  name: string;
  /** Original MIME type (e.g. 'image/jpeg', 'video/mp4') */
  mimeType: string;
  /** Media type classification ('image' or 'video') */
  type: 'image' | 'video';
  /** Lowercase file extension (e.g. 'jpg', 'png', 'mp4') */
  extension: string;
  /** File size in bytes */
  size?: number;
  /** ISO timestamp when the asset was created */
  createdTime?: string;
  /** ISO timestamp when the asset was last modified */
  modifiedTime?: string;
  /** Standard Google Drive viewing URL */
  driveUrl: string;
  /** Resolved working direct CDN URL */
  resolvedUrl: string;
  /** Thumbnail URL for preview */
  thumbnailUrl?: string;
  /** Google Drive resource kind string */
  kind?: string;
  /** Google Drive web view link */
  webViewLink?: string;
  /** Icon link for file type */
  iconLink?: string;
  /** Raw Drive API thumbnail link */
  thumbnailLink?: string;
  /** Array of parent folder IDs */
  parents?: string[];
  /** Array of owner display information */
  owners?: Array<{ displayName?: string; emailAddress?: string }>;
}

/**
 * Options for loading assets from a Google Drive folder.
 */
export interface LoadFolderOptions extends ResolveOptions {
  /** Google Drive Folder share link or URL */
  folderUrl?: string;
  /** Google Drive Folder ID */
  folderId?: string;
  /** Public Google Drive API Key (required for folder list requests) */
  apiKey: string;
  /** Media types to include ('image', 'video'). Default: ['image', 'video'] */
  mediaTypes?: ('image' | 'video')[];
  /** Array of lowercase file extensions to filter (e.g. ['jpg', 'png', 'mp4']) */
  extensions?: string[];
  /** Google Drive API sort ordering (e.g. 'name', 'createdTime', 'modifiedTime', 'quotaBytesUsed', 'folder') */
  orderBy?: string;
  /** Maximum assets to fetch per page (1 to 1000). Default: 100 */
  pageSize?: number;
  /** Token for fetching next page of assets */
  pageToken?: string;
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Concurrency limit for parallel asset resolution. Default: 4 */
  concurrency?: number;
}

/**
 * Result object returned by loadFolderAssets.
 */
export interface FolderLoadResult {
  /** Folder metadata details, or null if unavailable */
  folder: DriveFolderMetadata | null;
  /** Array of resolved media assets */
  assets: DriveAsset[];
  /** Token for retrieving next page, or undefined if no more pages */
  nextPageToken?: string;
  /** True if additional pages of assets exist */
  hasMore: boolean;
  /** Total count of assets loaded in this result */
  totalLoaded: number;
}

/**
 * Result state object returned by the useDriveFolder hook.
 */
export interface UseDriveFolderResult {
  /** Folder metadata details, or null while loading/unresolved */
  folder: DriveFolderMetadata | null;
  /** Accumulated array of resolved media assets */
  assets: DriveAsset[];
  /** True while folder assets are being loaded or resolved */
  loading: boolean;
  /** Error object if folder loading failed, or null */
  error: Error | null;
  /** Function to reload folder assets from page 1 */
  reload: () => void;
  /** Function to fetch and append the next page of assets */
  loadMore: () => void;
  /** True if more pages of assets are available to load */
  hasMore: boolean;
  /** Next page pagination token string */
  nextPageToken?: string;
  /** Total count of assets accumulated across loaded pages */
  totalLoaded: number;
}

/**
 * Global configuration options set via DriveLoaderProvider or configureDriveLoader.
 */
export interface GlobalConfig {
  /** Global cache TTL in milliseconds. Default: 3600000 (1 hr) */
  cacheTTL?: number;
  /** Maximum number of cached items before LRU eviction. Default: 500 */
  maxCacheSize?: number;
  /** Global retry attempts per candidate endpoint. Default: 2 */
  retries?: number;
  /** Global probe request timeout in milliseconds. Default: 8000 */
  timeout?: number;
  /** Enable developer console debug logging globally. Default: false */
  debug?: boolean;
  /** Global lazy loading default for components. Default: true */
  lazy?: boolean;
  /** Custom default placeholder React element */
  placeholder?: React.ReactNode;
  /** Custom default fallback React element */
  fallback?: React.ReactNode;
}

/**
 * Props for the DriveImage React component.
 */
export interface DriveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'placeholder' | 'onError' | 'onLoad'> {
  /** Google Drive link or file ID */
  src: string;
  /** Image alt text */
  alt?: string;
  /** Image width */
  width?: number | string;
  /** Image height */
  height?: number | string;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline CSS styles */
  style?: React.CSSProperties;
  /** React element to render while image is resolving/loading */
  placeholder?: React.ReactNode;
  /** React element to render if resolution fails */
  fallback?: React.ReactNode;
  /** HTML image loading behavior */
  loading?: 'lazy' | 'eager';
  /** Number of retries or boolean retry toggle */
  retry?: boolean | number;
  /** Enable memory caching for this image. Default: true */
  cache?: boolean;
  /** Enable IntersectionObserver lazy loading. Default: true */
  lazy?: boolean;
  /** Enable smooth CSS fade-in animation on load. Default: true */
  fade?: boolean;
  /** Image crossOrigin attribute */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /** Image referrerPolicy attribute. Default: 'no-referrer' */
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  /** Event callback when image successfully loads into DOM */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Event callback when DOM image load fails */
  onError?: (error: Error) => void;
  /** Event callback when DriveLoader URL resolution completes successfully */
  onResolveSuccess?: (result: ResolveResult) => void;
  /** Event callback when DriveLoader URL resolution fails */
  onResolveError?: (error: Error) => void;
}

/**
 * Individual item definition for DriveGallery.
 */
export interface DriveGalleryItem {
  /** Google Drive URL or File ID */
  src: string;
  /** Image alt text */
  alt?: string;
  /** Image caption */
  caption?: string;
}

/**
 * Props for the DriveGallery React component.
 */
export interface DriveGalleryProps {
  /** Array of Google Drive links or image item objects (optional if folderUrl / folderId is provided) */
  images?: Array<string | DriveGalleryItem>;
  /** Google Drive Folder share link or URL */
  folderUrl?: string;
  /** Google Drive Folder ID */
  folderId?: string;
  /** Public Google Drive API Key (required when loading via folderUrl / folderId) */
  apiKey?: string;
  /** Filter media types when loading from a folder */
  mediaTypes?: ('image' | 'video')[];
  /** Filter file extensions when loading from a folder */
  extensions?: string[];
  /** Sort ordering when loading from a folder */
  orderBy?: string;
  /** Column count or responsive column configuration `{ sm?: number, md?: number, lg?: number }` */
  columns?: number | { sm?: number; md?: number; lg?: number };
  /** Grid gap size in pixels or CSS unit string. Default: '1rem' */
  gap?: number | string;
  /** Additional CSS class name */
  className?: string;
  /** Inline CSS styles */
  style?: React.CSSProperties;
  /** Enable lazy loading for gallery items. Default: true */
  lazy?: boolean;
  /** Custom placeholder for gallery images */
  placeholder?: React.ReactNode;
  /** Custom fallback for gallery images */
  fallback?: React.ReactNode;
  /** Callback fired when a gallery item is clicked */
  onImageClick?: (item: DriveGalleryItem | DriveAsset, index: number) => void;
}

/**
 * Metadata associated with a resolved Google Drive video asset.
 */
export interface DriveVideoMetadata {
  /** Video duration in seconds */
  duration: number;
  /** Video width in pixels */
  width: number;
  /** Video height in pixels */
  height: number;
  /** Video MIME type (e.g. 'video/mp4', 'video/webm') */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Thumbnail image URL */
  thumbnailUrl: string;
}

/**
 * Successful video resolution result.
 */
export interface ResolveVideoResult {
  /** Final working direct video CDN URL */
  videoUrl: string;
  /** Extracted Google Drive File ID */
  fileId: string;
  /** Array of candidate endpoints attempted */
  attemptedEndpoints: string[];
  /** The candidate URL template/endpoint that succeeded */
  successfulEndpoint: string;
  /** Whether the resolution result was served from cache */
  fromCache: boolean;
  /** Whether an endpoint learning priority was applied */
  learned: boolean;
  /** Extracted video metadata details */
  metadata: DriveVideoMetadata;
  /** Thumbnail preview URL */
  thumbnailUrl: string;
}

/**
 * Props for the DriveVideo React component.
 */
export interface DriveVideoProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'placeholder' | 'onError' | 'onLoadedMetadata'> {
  /** Google Drive link or file ID */
  src: string;
  /** Video width */
  width?: number | string;
  /** Video height */
  height?: number | string;
  /** Additional CSS class names */
  className?: string;
  /** Additional inline CSS styles */
  style?: React.CSSProperties;
  /** React element to render while video is resolving/loading */
  placeholder?: React.ReactNode;
  /** React element to render if resolution fails */
  fallback?: React.ReactNode;
  /** Video controls toggle. Default: true */
  controls?: boolean;
  /** Auto play video */
  autoPlay?: boolean;
  /** Mute audio playback */
  muted?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Play inline on mobile devices */
  playsInline?: boolean;
  /** Video poster thumbnail image URL */
  poster?: string;
  /** Video preload attribute ('metadata' | 'auto' | 'none'). Default: 'metadata' */
  preload?: 'metadata' | 'auto' | 'none';
  /** Cross-origin CORS configuration */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /** Referrer policy attribute. Default: 'no-referrer' */
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  /** Enable memory caching for this video. Default: true */
  cache?: boolean;
  /** Enable IntersectionObserver lazy loading. Default: true */
  lazy?: boolean;
  /** Enable smooth CSS fade-in animation on load. Default: true */
  fade?: boolean;
  /** Playback event callback */
  onPlay?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  /** Pause event callback */
  onPause?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  /** Ended event callback */
  onEnded?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  /** Loaded metadata event callback */
  onLoadedMetadata?: (event: React.SyntheticEvent<HTMLVideoElement, Event>, metadata?: DriveVideoMetadata) => void;
  /** Can play event callback */
  onCanPlay?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  /** Error event callback */
  onError?: (error: Error) => void;
  /** Event callback when DriveLoader video resolution completes successfully */
  onResolveSuccess?: (result: ResolveVideoResult) => void;
  /** Event callback when DriveLoader video resolution fails */
  onResolveError?: (error: Error) => void;
}

/**
 * Result state object returned by the useDriveVideo hook.
 */
export interface UseDriveVideoResult {
  /** The working direct video CDN URL, or null if loading or failed */
  videoUrl: string | null;
  /** Whether resolution or metadata extraction is currently in progress */
  loading: boolean;
  /** Error object if video resolution failed, null otherwise */
  error: Error | null;
  /** True if video resolution completed successfully */
  isSuccess: boolean;
  /** True if video resolution failed */
  isError: boolean;
  /** Candidate URLs generated for this Google Drive file ID */
  candidateUrls: string[];
  /** Function to trigger manual reload/re-resolution */
  reload: (options?: { bypassCache?: boolean }) => void;
  /** Video metadata object, or null while loading/unresolved */
  metadata: DriveVideoMetadata | null;
  /** Thumbnail image preview URL, or null */
  thumbnailUrl: string | null;
}

