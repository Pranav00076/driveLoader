/**
 * @driveloader/react
 * The definitive React library for loading, caching, resolving, and diagnosing Google Drive hosted images and public folders.
 */

// Components
export { DriveImage } from './components/DriveImage';
export type { DriveImageRef } from './components/DriveImage';
export { DriveVideo } from './components/DriveVideo';
export type { DriveVideoRef } from './components/DriveVideo';
export { DriveGallery } from './components/DriveGallery';

// Provider & Context
export { DriveLoaderProvider, useDriveLoaderConfig } from './context/DriveLoaderContext';
export type { DriveLoaderProviderProps } from './context/DriveLoaderContext';

// Hooks
export { useDriveImage } from './hooks/useDriveImage';
export type { UseDriveImageResult } from './hooks/useDriveImage';
export { useDriveVideo } from './hooks/useDriveVideo';
export type { UseDriveVideoResult } from './hooks/useDriveVideo';
export { useDriveFolder } from './hooks/useDriveFolder';

// Core Utilities
export {
  extractFileId,
  isGoogleDriveUrl,
  detectUrlFormat,
  isDriveVideo,
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
  configureDriveLoader,
} from './utils/index';

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
} from './errors/DriveLoaderError';

// Types
export type {
  DriveUrlFormat,
  ResolveOptions,
  ResolveResult,
  ResolveVideoResult,
  BatchResolveOptions,
  BatchResolveResult,
  BatchResolveItem,
  UrlDiagnostics,
  CacheStats,
  GlobalConfig,
  DriveImageProps,
  DriveVideoProps,
  DriveVideoMetadata,
  DriveGalleryProps,
  DriveGalleryItem,
  DriveFolderMetadata,
  DriveAsset,
  LoadFolderOptions,
  FolderLoadResult,
  UseDriveFolderResult,
} from './types/index';
