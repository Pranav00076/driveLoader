# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-07-23

### Added
- **Public Google Drive Folder Support**: Added official Google Drive API v3 folder loading (`loadFolderAssets`, `useDriveFolder`, `extractFolderId`, `isGoogleDriveFolder`).
- **Folder Metadata & DriveAsset Metadata**: Exposes `DriveFolderMetadata` (`id`, `name`, `webViewLink`, `createdTime`, `modifiedTime`) and enriched `DriveAsset` metadata (`thumbnailUrl`, `kind`, `iconLink`, `parents`, `owners`).
- **Sorting & Extension Filtering**: Supports Drive API sorting (`orderBy`) and post-filtering by file extension (`extensions: ['jpg', 'png', 'mp4']`).
- **DriveGallery Folder Mode**: `<DriveGallery folderUrl="..." apiKey="..." />` automatically fetches and renders folder assets in a responsive grid.

## [1.0.1] - 2026-07-23

### Fixed
- **Referrer Policy & CORB Fix**: Added `referrerPolicy: 'no-referrer'` to candidate image preloader probes and `<DriveImage />` component elements to prevent Chrome Cross-Origin Read Blocking (CORB) and referrer restrictions on Google Drive CDN images (`lh3.googleusercontent.com`).

## [1.0.0] - 2026-07-23

### Initial Production Release

- **URL Parser**: Support for all Google Drive link formats (`file/d/`, `open?id=`, `uc?id=`, `docs.google.com`, `lh3.googleusercontent.com`, `drive.usercontent.google.com`, and raw File IDs).
- **Intelligent Resolver**: Multi-candidate endpoint fallback pipeline with non-rendering `Image` probing and configurable retry attempts.
- **Endpoint Learning**: Remembers successful CDN endpoints per file ID and prioritizes them in subsequent resolution attempts.
- **Request Coalescing**: Deduplicates concurrent resolution requests for identical file IDs to prevent duplicate network traffic.
- **Memory Cache**: High-performance in-memory cache featuring TTL expiration, LRU eviction, and hit/miss statistics (`getCacheStats()`).
- **Batch Processing**: Concurrently resolves URL arrays with `resolveDriveImages()` and worker queue controls.
- **Diagnostics API**: `analyzeDriveUrl(url)` for inspecting link validity, format variants, TTL, and actionable recommendations.
- **React Suite**: `<DriveImage />`, `<DriveGallery />`, `<DriveLoaderProvider />`, and `useDriveImage()` hook.
- **Typed Errors**: `InvalidDriveUrlError`, `PrivateFileError`, `ResolutionFailedError`, `NoCandidateUrlsError`, `CacheError`.
