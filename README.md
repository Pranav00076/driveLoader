# @driveloader/react

<div align="center">

[![npm version](https://img.shields.io/npm/v/@driveloader/react.svg?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/@driveloader/react)
[![license](https://img.shields.io/npm/l/@driveloader/react.svg?style=flat-square&color=10b981)](https://github.com/Pranav00076/driveLoader/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@driveloader/react?style=flat-square&color=8b5cf6)](https://bundlephobia.com/package/@driveloader/react)
[![build status](https://img.shields.io/github/actions/workflow/status/Pranav00076/driveLoader/ci.yml?branch=main&style=flat-square)](https://github.com/Pranav00076/driveLoader/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**The definitive React library for loading, caching, resolving, and diagnosing Google Drive hosted images.**

</div>

---

## 🌟 Why `@driveloader/react`?

Google Drive link sharing is notoriously tricky. Standard `drive.google.com/file/d/...` or `open?id=...` URLs fail inside `<img src="..." />` tags because they are HTML viewing pages rather than direct image file binaries.

Developers historically resort to manual URL conversion helpers, regex tricks, fragile third-party proxy tools, or broken fallback UI.

**`@driveloader/react` completely solves this problem.**

Simply pass **any** Google Drive link or file ID to `<DriveImage src="..." />`. The library automatically extracts the file ID, generates prioritized candidate CDN URLs, probes working endpoints, learns successful endpoints over time, deduplicates concurrent network requests, and caches working results in memory.

---

## 📐 Architecture Diagram

```
                       +-------------------------------+
                       | <DriveImage src="DRIVE_URL"/> |
                       +---------------+---------------+
                                       |
                                       v
                        +--------------+--------------+
                        |   parser.extractFileId()    |
                        +--------------+--------------+
                                       |
                   +-------------------+-------------------+
                   | Cache Hit?                            |
           [ Yes ] v                                       v [ No ]
    +--------------+--------------+         +--------------+--------------+
    | Return Cached Image URL     |         | Request Coalescing Map      |
    +-----------------------------+         | (Deduplicate duplicate ID)  |
                                            +--------------+--------------+
                                                           |
                                                           v
                                            +--------------+--------------+
                                            | generateCandidateUrls()     |
                                            | (Endpoint Learning First)   |
                                            +--------------+--------------+
                                                           |
                                                           v
                                            +--------------+--------------+
                                            | Probe CDN Candidates        |
                                            | [lh3 -> uc -> thumbnail...] |
                                            +--------------+--------------+
                                                           |
                                                           v
                                            +--------------+--------------+
                                            | Save to MemoryCache &       |
                                            | Record Learned Endpoint     |
                                            +-----------------------------+
```

---

## 🚀 Key Features

- 🧠 **Endpoint Learning**: Automatically remembers working CDN endpoints per file ID and prioritizes them in future resolutions.
- ⚡ **Request Coalescing**: Prevents duplicate network requests when rendering multiple instances of the same image across your app.
- 📦 **Batch Resolution**: Concurrently resolves arrays of URLs with `resolveDriveImages()` and worker queue controls.
- 🔍 **Diagnostics API**: `analyzeDriveUrl(url)` inspects link validity, format variants, TTL, and actionable recommendations.
- 📊 **Cache Metrics**: Real-time stats (`getCacheStats()`) on hit rates, active requests, and memory usage.
- 🎨 **Component Suite**: `<DriveImage />` with skeletons, fade-in transitions, and IntersectionObserver lazy loading, plus `<DriveGallery />` for responsive grid layouts.
- 🛡️ **Typed Errors**: Actionable custom error hierarchy (`InvalidDriveUrlError`, `PrivateFileError`, `ResolutionFailedError`).
- ⚡ **Zero Runtime Dependencies**: Ultra-lightweight and tree-shakeable.

---

## ⚡ Quick Start

### Installation

```bash
npm install @driveloader/react
# or
pnpm add @driveloader/react
# or
yarn add @driveloader/react
```

### Basic Component Usage

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

## 🎣 Custom Hook (`useDriveImage`)

```tsx
import { useDriveImage } from '@driveloader/react';

function CustomImageCard({ src }: { src: string }) {
  const { imageUrl, loading, error, isSuccess, reload } = useDriveImage(src);

  if (loading) return <div>Loading Google Drive image...</div>;
  if (error) return <div>Failed to load: {error.message} <button onClick={() => reload()}>Retry</button></div>;

  return <img src={imageUrl!} alt="Resolved Drive Asset" />;
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

## 📊 Cache Statistics (`getCacheStats`)

```ts
import { getCacheStats, clearCache } from '@driveloader/react';

const stats = getCacheStats();
console.log(`Cache Hit Rate: ${stats.hitRate}%`);
console.log(`Cached Entries: ${stats.cachedEntries}`);
```

---

## 🌐 Global Provider (`DriveLoaderProvider`)

```tsx
import { DriveLoaderProvider } from '@driveloader/react';

export function App() {
  return (
    <DriveLoaderProvider
      cacheTTL={3600000}
      retries={2}
      debug={process.env.NODE_ENV === 'development'}
      lazy={true}
    >
      <MainRoutes />
    </DriveLoaderProvider>
  );
}
```

---

## 📊 Feature Comparison

| Feature | Raw `<img>` | Manual Helper | `@driveloader/react` |
| :--- | :---: | :---: | :---: |
| Link Format Auto-Detection | ❌ | Partial | ✅ **Every Format** |
| Fallback CDN Candidates | ❌ | ❌ | ✅ **5 Prioritized CDNs** |
| Endpoint Learning | ❌ | ❌ | ✅ **Automatic** |
| Request Deduplication | ❌ | ❌ | ✅ **Request Coalescing** |
| In-Memory Cache with TTL | ❌ | ❌ | ✅ **Built-in LRU/TTL** |
| Diagnostics & Recommendations | ❌ | ❌ | ✅ **`analyzeDriveUrl`** |

---

## 🤝 Contributing

Contributions are welcome! Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) guide before submitting pull requests.

## 📄 License

[MIT](LICENSE) © DriveLoader Contributors