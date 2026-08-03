# @driveloader/react

<div align="center">

[![npm version](https://img.shields.io/npm/v/@driveloader/react.svg?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/@driveloader/react)
[![license](https://img.shields.io/npm/l/@driveloader/react.svg?style=flat-square&color=10b981)](https://github.com/Pranav00076/driveLoader/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@driveloader/react?style=flat-square&color=8b5cf6)](https://bundlephobia.com/package/@driveloader/react)
[![build status](https://img.shields.io/github/actions/workflow/status/Pranav00076/driveLoader/ci.yml?branch=main&style=flat-square)](https://github.com/Pranav00076/driveLoader/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**The complete Google Drive Media CDN for React applications. Effortlessly load, stream, cache, resolve, and diagnose Google Drive hosted images, videos, and public folders.**

</div>

---

## 🌟 Why `@driveloader/react`?

Google Drive link sharing is notoriously tricky. Standard `drive.google.com/file/d/...` or `open?id=...` URLs fail inside `<img src="..." />` and `<video src="..." />` tags because they point to HTML viewing web pages rather than direct direct CDN file binaries.

**`@driveloader/react` completely solves this problem for images, videos, and entire public Google Drive folders.**

Simply pass **any** Google Drive link or file ID to `<DriveImage />` or `<DriveVideo />`, or load entire public folders via `useDriveFolder()` / `<DriveGallery />`.

---

## 🚀 Key Features

- 🌟 **Universal `<DriveMedia />`**: Single component auto-detects images, videos, audio tracks, and documents.
- 🖼️ **Google Drive Images (`<DriveImage />`)**: Render Google Drive images with skeletons, smooth fade transitions, responsive `srcSet`, adaptive quality, and failover endpoints.
- 🎥 **Google Drive Videos (`<DriveVideo />`)**: Stream Google Drive videos using `<DriveVideo />` with poster thumbnails, HTML5 controls, and metadata extraction.
- 🎵 **Google Drive Audio (`<DriveAudio />` & `<DrivePlaylist />`)**: Stream MP3, WAV, AAC, OGG, FLAC, M4A with waveform visualization canvas, seek controls, and track playlists.
- 📄 **Google Drive Documents (`<DriveDocument />`)**: View PDFs, TXT, and Markdown documents with zoom and page controls.
- 🖼️ **Mixed Media Galleries**: Responsive `<DriveGallery />` automatically detects media types and renders images, videos, audio, and docs.
- 📁 **Public Folder Features**: Fetch, search, sort, filter, and page through public Google Drive folders with recursive nested scanning.
- 💾 **Advanced Multi-Tier Cache**: Memory Cache + Persistent SessionStorage + IndexedDB with TTL, versioning, offline mode, and `inspectCache()`.
- ⚡ **Smart Prefetch**: `prefetch()`, `prefetchFolder()`, `prefetchGallery()`, `prefetchVideo()`, `prefetchAudio()`, `prefetchDocument()` with hover/viewport triggers.
- 🛠️ **CLI Tool (`npx driveloader`)**: Validate links, resolve URLs, inspect folders, clear cache, and generate TypeScript types.
- ⚛️ **Next.js & React 19 Ready**: `<Image>` loader helper (`createDriveNextLoader()`), Server Actions, Edge Runtime, and Suspense (`useDriveImageSuspense`).
- 📊 **Developer Inspector HUD**: On-screen `<DriveDebugOverlay />` showing live cache hits, latency metrics, and candidate endpoints.


---

## ⚡ Quick Start

### 🖼️ Single Image Component (`DriveImage`)

```tsx
import { DriveImage } from '@driveloader/react';
import '@driveloader/react/styles.css';

export function ProfileAvatar() {
  return (
    <DriveImage
      src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"
      alt="User Profile"
      width={120}
      height={120}
      fade={true}
    />
  );
}
```

### 🎥 Single Video Component (`DriveVideo`)

```tsx
import { DriveVideo } from '@driveloader/react';
import '@driveloader/react/styles.css';

export function VideoPlayer({ driveUrl }: { driveUrl: string }) {
  return (
    <DriveVideo
      src={driveUrl}
      controls
      autoPlay={false}
      muted={false}
      preload="metadata"
      width={640}
      height={360}
    />
  );
}
```

### 🎬 Video Resolution Hook (`useDriveVideo`)

```tsx
import { useDriveVideo } from '@driveloader/react';

function VideoDetails({ driveUrl }: { driveUrl: string }) {
  const { videoUrl, loading, error, metadata, thumbnailUrl } = useDriveVideo(driveUrl);

  if (loading) return <div>Resolving Google Drive Video...</div>;
  if (error) return <div>Failed to load video: {error.message}</div>;

  return (
    <div>
      <video src={videoUrl!} controls poster={thumbnailUrl || undefined} width={640} />
      <p>Duration: {metadata?.duration}s | Dimensions: {metadata?.width}x{metadata?.height}</p>
    </div>
  );
}
```

---

## 📁 Loading Public Folders (`useDriveFolder`)

Load public Google Drive folder contents with pagination, sorting, and media type filtering.

```tsx
import { useDriveFolder, DriveGallery } from '@driveloader/react';

function FolderGallery({ folderUrl, apiKey }: { folderUrl: string; apiKey: string }) {
  const { folder, assets, loading, error, loadMore, hasMore } = useDriveFolder({
    folderUrl,
    apiKey,
    mediaTypes: ['image', 'video'],
    extensions: ['jpg', 'png', 'mp4', 'webm'],
    orderBy: 'createdTime desc',
    pageSize: 20,
  });

  if (loading && assets.length === 0) return <div>Loading Google Drive folder...</div>;
  if (error) return <div>Failed to load folder: {error.message}</div>;

  return (
    <div>
      <h3>{folder?.name}</h3>
      <DriveGallery images={assets.map(a => a.resolvedUrl)} columns={3} gap="1rem" />
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

---

## 🖼️ Automatic Mixed Media Gallery (`DriveGallery`)

`<DriveGallery />` automatically inspects every asset in folder or array mode, rendering `<DriveVideo />` for video files and `<DriveImage />` for image files.

```tsx
import { DriveGallery } from '@driveloader/react';

export function MediaGallery() {
  return (
    <DriveGallery
      folderUrl="https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9i0J"
      apiKey="YOUR_GOOGLE_DRIVE_API_KEY"
      columns={{ sm: 1, md: 2, lg: 4 }}
      gap="1.5rem"
      orderBy="name"
    />
  );
}
```

---

## 📦 Batch Resolution (`resolveDriveImages`)

Concurrently resolve multiple Google Drive image URLs into working direct CDN links with concurrency worker limits.

```ts
import { resolveDriveImages } from '@driveloader/react';

const { results, successful, failed } = await resolveDriveImages([
  'https://drive.google.com/file/d/ID_1/view',
  'https://drive.google.com/open?id=ID_2',
], { concurrency: 4 });
```

---

## 🛠️ Video & Image Utilities

```ts
import {
  isDriveVideo,
  resolveDriveVideo,
  getVideoThumbnail,
  extractVideoMetadata,
  prefetchVideo
} from '@driveloader/react';

// 1. Check if input URL represents a video asset
isDriveVideo('https://drive.google.com/file/d/VIDEO_ID/view?type=video'); // => true

// 2. Generate video preview thumbnail URL
const thumbUrl = getVideoThumbnail('https://drive.google.com/file/d/VIDEO_ID/view');

// 3. Extract video metadata
const metadata = await extractVideoMetadata('https://drive.google.com/file/d/VIDEO_ID/view');
console.log(metadata.duration, metadata.width, metadata.height, metadata.mimeType);

// 4. Background prefetch video resolution into memory cache
await prefetchVideo('https://drive.google.com/file/d/VIDEO_ID/view');
```

---

## 🔍 Link Diagnostics API (`analyzeDriveUrl`)

Inspect any Google Drive URL to analyze format variants, TTL, and troubleshooting recommendations.

```ts
import { analyzeDriveUrl } from '@driveloader/react';

const info = analyzeDriveUrl('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view');

console.log(info.valid);           // true
console.log(info.fileId);          // '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs'
console.log(info.detectedFormat);  // 'file_d'
console.log(info.recommendations); // ['Verify in Google Drive that access is set to Anyone with the link...']
```

---

## 📊 Cache Metrics & Management

Inspect cache hit rates, active in-flight requests, and estimated memory usage.

```ts
import { getCacheStats, clearCache } from '@driveloader/react';

const stats = getCacheStats();
console.log(`Hit Rate: ${stats.hitRate}% | Cached: ${stats.cachedEntries} | Active: ${stats.activeRequests}`);

// Reset memory cache
clearCache();
```

---

## 🔑 Google Drive API Key Setup for Folders

Folder loading utilizes the official Google Drive API v3.

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)** &rarr; **APIs & Services** &rarr; **Credentials**.
2. Click **Create Credentials** &rarr; **API Key**.
3. Go to **API Library** &rarr; Enable **Google Drive API**.
4. Restrict your API key HTTP Referrers to your web application domain.

---

## 🤝 Contributing

Contributions are welcome! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) guide before submitting pull requests.

## 📄 License

[MIT](LICENSE) © DriveLoader Contributors