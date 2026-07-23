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
  /** Image referrerPolicy attribute */
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
  /** Array of Google Drive links or image item objects */
  images: Array<string | DriveGalleryItem>;
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
  onImageClick?: (item: DriveGalleryItem, index: number) => void;
}
