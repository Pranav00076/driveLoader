# @driveloader/react

<div align="center">

[![npm version](https://img.shields.io/npm/v/@driveloader/react.svg?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/@driveloader/react)
[![license](https://img.shields.io/npm/l/@driveloader/react.svg?style=flat-square&color=10b981)](https://github.com/Pranav00076/driveLoader/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@driveloader/react?style=flat-square&color=8b5cf6)](https://bundlephobia.com/package/@driveloader/react)
[![build status](https://img.shields.io/github/actions/workflow/status/Pranav00076/driveLoader/ci.yml?branch=main&style=flat-square)](https://github.com/Pranav00076/driveLoader/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**The definitive React library for loading, caching, resolving, and diagnosing Google Drive hosted images and public folders.**

</div>

---

## 🌟 Why `@driveloader/react`?

Google Drive link sharing is notoriously tricky. Standard `drive.google.com/file/d/...` or `open?id=...` URLs fail inside `<img src="..." />` tags because they are HTML viewing pages rather than direct image file binaries.

**`@driveloader/react` completely solves this problem for both single images and entire public Google Drive folders.**

Simply pass **any** Google Drive link or file ID to `<DriveImage src="..." />` or load entire public folders via `useDriveFolder()` / `<DriveGallery folderUrl="..." apiKey="..." />`.

---

## 🚀 Key Features

- 🧠 **Endpoint Learning**: Automatically remembers working CDN endpoints per file ID and prioritizes them in future resolutions.
- 📁 **Public Folder Loading**: Load all media assets (images & videos) from a public Google Drive folder using official Google Drive API v3.
- 🔄 **Pagination & Sorting**: Support for `loadMore()`, page tokens, sorting (`name`, `createdTime`, `modifiedTime`), and extension filtering (`['jpg', 'png', 'mp4']`).
- ⚡ **Request Coalescing**: Prevents duplicate network requests when rendering multiple instances of the same asset across your app.
- 📦 **Batch Resolution**: Concurrently resolves arrays of URLs with `resolveDriveImages()` and worker queue controls.
- 🔍 **Diagnostics API**: `analyzeDriveUrl(url)` inspects link validity, format variants, TTL, and actionable recommendations.
- 📊 **Cache Metrics**: Real-time stats (`getCacheStats()`) on hit rates, active requests, and memory usage.
- 🎨 **Component Suite**: `<DriveImage />` with skeletons, fade-in transitions, and IntersectionObserver lazy loading, plus `<DriveGallery />` for responsive grid layouts and folder galleries.
- 🛡️ **Typed Errors**: Actionable custom error hierarchy (`InvalidDriveUrlError`, `PrivateFileError`, `ResolutionFailedError`, `InvalidFolderError`, `ApiKeyMissingError`, `FolderLoadError`).
- ⚡ **Zero Runtime Dependencies**: Ultra-lightweight and tree-shakeable.

---

## ⚡ Quick Start

### Single Image Component

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

---

## 📁 Loading Public Folders (`useDriveFolder`)

```tsx
import { useDriveFolder, DriveImage } from '@driveloader/react';

function FolderGallery({ folderUrl, apiKey }: { folderUrl: string; apiKey: string }) {
  const { folder, assets, loading, error, loadMore, hasMore } = useDriveFolder({
    folderUrl,
    apiKey,
    mediaTypes: ['image'],
    extensions: ['jpg', 'png', 'webp'],
    orderBy: 'createdTime desc',
    pageSize: 20,
  });

  if (loading && assets.length === 0) return <div>Loading Google Drive folder...</div>;
  if (error) return <div>Failed to load folder: {error.message}</div>;

  return (
    <div>
      <h3>{folder?.name}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {assets.map((asset) => (
          <DriveImage key={asset.id} src={asset.resolvedUrl} alt={asset.name} />
        ))}
      </div>
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

---

## 🖼️ Automatic Gallery Folder Mode (`DriveGallery`)

```tsx
import { DriveGallery } from '@driveloader/react';

export function EventPhotoGallery() {
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

```ts
import { resolveDriveImages } from '@driveloader/react';

const { results, successful, failed } = await resolveDriveImages([
  'https://drive.google.com/file/d/ID_1/view',
  'https://drive.google.com/open?id=ID_2',
], { concurrency: 4 });
```

---

## 🔍 Link Diagnostics API (`analyzeDriveUrl`)

```ts
import { analyzeDriveUrl } from '@driveloader/react';

const info = analyzeDriveUrl('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view');

console.log(info.valid);           // true
console.log(info.fileId);          // '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs'
console.log(info.detectedFormat);  // 'file_d'
console.log(info.recommendations); // ['Verify in Google Drive that access is set to Anyone with the link...']
```

---

## 🔑 Google Drive API Key Setup for Folders

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)** &rarr; **APIs & Services** &rarr; **Credentials**.
2. Click **Create Credentials** &rarr; **API Key**.
3. Go to **API Library** &rarr; Enable **Google Drive API**.
4. Restrict your API key HTTP Referrers to your web application domain.

---

## 🤝 Contributing

Contributions are welcome! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) guide before submitting pull requests.

## 📄 License

[MIT](LICENSE) © DriveLoader Contributors