/**
 * @driveloader/react
 * The definitive React library and Media SDK for loading, caching, resolving, and displaying Google Drive images, videos, audio tracks, and documents.
 */

// Components
export { DriveImage } from './components/DriveImage';
export type { DriveImageRef } from './components/DriveImage';
export { DriveVideo } from './components/DriveVideo';
export type { DriveVideoRef } from './components/DriveVideo';
export { DriveAudio } from './components/DriveAudio';
export type { DriveAudioRef } from './components/DriveAudio';
export { DrivePlaylist } from './components/DrivePlaylist';
export { DriveDocument } from './components/DriveDocument';
export { DriveMedia } from './components/DriveMedia';
export { DriveGallery } from './components/DriveGallery';
export { DriveErrorBoundary } from './components/DriveErrorBoundary';

// Provider & Context
export { DriveLoaderProvider, useDriveLoaderConfig } from './context/DriveLoaderContext';
export type { DriveLoaderProviderProps } from './context/DriveLoaderContext';

// Hooks
export { useDriveImage } from './hooks/useDriveImage';
export type { UseDriveImageResult } from './hooks/useDriveImage';
export { useDriveVideo } from './hooks/useDriveVideo';
export type { UseDriveVideoResult } from './hooks/useDriveVideo';
export { useDriveAudio } from './hooks/useDriveAudio';
export { useDrivePlaylist } from './hooks/useDrivePlaylist';
export { useDriveDocument } from './hooks/useDriveDocument';
export { useDriveFolder } from './hooks/useDriveFolder';
export { useDriveImageSuspense } from './hooks/useDriveSuspense';

// Core Utilities & Resolvers
export {
  extractFileId,
  isGoogleDriveUrl,
  detectUrlFormat,
  isDriveVideo,
  isDriveAudio,
  isDriveDocument,
  detectMediaType,
  extractFolderId,
  isGoogleDriveFolder,
  generateCandidateUrls,
  resolveDriveImage,
  resolveDriveVideo,
  resolveDriveImages,
  loadFolderAssets,
  analyzeDriveUrl,
  prefetch,
  prefetchVideo,
  extractVideoMetadata,
  getVideoThumbnail,
  clearCache,
  getCacheStats,
  inspectCache,
  configureDriveLoader,
} from './utils/index';

export { resolveDriveAudio } from './core/audioResolver';
export { resolveDriveDocument } from './core/documentResolver';
export { prefetchAudio, prefetchDocument, prefetchFolder, prefetchGallery } from './core/prefetch';

// Optimization Utilities
export {
  getAdaptiveQuality,
  buildResponsiveSrcSet,
  useAutoResize,
  useIntersectionObserver,
  usePrefetchOnHover,
} from './utils/optimization';

// Framework Integrations
export {
  createDriveNextLoader,
  resolveDriveImageServer,
  isDriveUrlServerAction,
} from './integrations/next';

// Debug & Monitoring Tools
export { DriveDebugOverlay } from './debug/DriveDebugOverlay';
export { enableDriveDebug, onPerformanceMetric, getPerformanceMetrics } from './debug/logger';

// Custom Error Hierarchy
export {
  DriveLoaderError,
  InvalidDriveUrlError,
  PrivateFileError,
  ResolutionFailedError,
  NoCandidateUrlsError,
  CacheError,
  InvalidFolderError,
  ApiKeyMissingError,
  FolderLoadError,
  InvalidVideoError,
  VideoResolutionError,
  UnsupportedVideoFormatError,
  AudioResolutionError,
  DocumentResolutionError,
  CacheStorageError,
  UnsupportedAudioFormatError,
  UnsupportedDocumentFormatError,
} from './errors/DriveLoaderError';

// Types
export type {
  MediaType,
  DriveUrlFormat,
  ResolveOptions,
  ResolveResult,
  ResolveVideoResult,
  ResolveAudioResult,
  ResolveDocumentResult,
  BatchResolveOptions,
  BatchResolveResult,
  BatchResolveItem,
  UrlDiagnostics,
  CacheStats,
  CacheStorageEngine,
  CacheInspectionResult,
  CacheEntryDetails,
  GlobalConfig,
  DriveImageProps,
  DriveVideoProps,
  DriveAudioProps,
  DrivePlaylistProps,
  DrivePlaylistItem,
  DriveDocumentProps,
  DriveMediaProps,
  DriveVideoMetadata,
  DriveAudioMetadata,
  DriveGalleryProps,
  DriveGalleryItem,
  DriveFolderMetadata,
  DriveAsset,
  LoadFolderOptions,
  FolderLoadResult,
  UseDriveFolderResult,
  UseDriveAudioResult,
  UseDriveDocumentResult,
  FolderQueryOptions,
  PerformanceMetric,
  DebugLog,
} from './types/index';
