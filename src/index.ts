/**
 * @driveloader/react
 * The definitive React library for loading, caching, resolving, and diagnosing Google Drive hosted images and public folders.
 */

// Components
export { DriveImage } from './components/DriveImage.js';
export type { DriveImageRef } from './components/DriveImage.js';
export { DriveGallery } from './components/DriveGallery.js';

// Provider & Context
export { DriveLoaderProvider, useDriveLoaderConfig } from './context/DriveLoaderContext.js';
export type { DriveLoaderProviderProps } from './context/DriveLoaderContext.js';

// Hooks
export { useDriveImage } from './hooks/useDriveImage.js';
export type { UseDriveImageResult } from './hooks/useDriveImage.js';
export { useDriveFolder } from './hooks/useDriveFolder.js';

// Core Utilities
export {
  extractFileId,
  isGoogleDriveUrl,
  detectUrlFormat,
  extractFolderId,
  isGoogleDriveFolder,
  generateCandidateUrls,
  resolveDriveImage,
  resolveDriveImages,
  loadFolderAssets,
  analyzeDriveUrl,
  prefetch,
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
} from './errors/DriveLoaderError.js';

// Types
export type {
  DriveUrlFormat,
  ResolveOptions,
  ResolveResult,
  BatchResolveOptions,
  BatchResolveResult,
  BatchResolveItem,
  UrlDiagnostics,
  CacheStats,
  GlobalConfig,
  DriveImageProps,
  DriveGalleryProps,
  DriveGalleryItem,
  DriveFolderMetadata,
  DriveAsset,
  LoadFolderOptions,
  FolderLoadResult,
  UseDriveFolderResult,
} from './types/index.js';
