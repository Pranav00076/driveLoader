/**
 * @driveloader/react
 * The definitive React library for loading, caching, resolving, and diagnosing Google Drive hosted images and public folders.
 */

// Components
export { DriveImage } from './components/DriveImage.js';
export type { DriveImageRef } from './components/DriveImage.js';
export { DriveVideo } from './components/DriveVideo.js';
export type { DriveVideoRef } from './components/DriveVideo.js';
export { DriveGallery } from './components/DriveGallery.js';

// Provider & Context
export { DriveLoaderProvider, useDriveLoaderConfig } from './context/DriveLoaderContext.js';
export type { DriveLoaderProviderProps } from './context/DriveLoaderContext.js';

// Hooks
export { useDriveImage } from './hooks/useDriveImage.js';
export type { UseDriveImageResult } from './hooks/useDriveImage.js';
export { useDriveVideo } from './hooks/useDriveVideo.js';
export type { UseDriveVideoResult } from './hooks/useDriveVideo.js';
export { useDriveFolder } from './hooks/useDriveFolder.js';

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
} from './utils/index.js';

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
} from './errors/DriveLoaderError.js';

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
} from './types/index.js';
