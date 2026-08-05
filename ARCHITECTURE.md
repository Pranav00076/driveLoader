# Architecture Guide - DriveLoader SDK

This document outlines the internal architecture, design principles, and component subsystems of `@driveloader/react`.

---

## 🏗️ System Overview

DriveLoader translates un-embeddable Google Drive share links into direct, high-performance CDN binaries for images, videos, audio tracks, and documents.

```
[User Input Link / File ID]
         │
         ▼
 1. Parser & Validation (extractFileId, detectMediaType)
         │
         ▼
 2. Multi-Tier Storage Cache (Memory -> SessionStorage -> IndexedDB)
   ├── HIT  ──> Return Cached CDN URL
   └── MISS ──> 3. Candidate Endpoint Probe Engine
                       ├── Priority 1: Learned Working Endpoint
                       ├── Priority 2: lh3.googleusercontent.com/d/{ID}
                       ├── Priority 3: drive.google.com/uc?export=view&id={ID}
                       └── Priority 4: drive.google.com/thumbnail?id={ID}
                                │
                                ▼
                       4. Coalescing & Request Queue
                                │
                                ▼
                       5. Component Render Layer (<DriveMedia />, <DriveImage />, <DriveVideo />, etc.)
```

---

## 🧩 Core Subsystems

### 1. Parser (`src/core/parser.ts`)
- Regular expression parsing supporting 7+ URL link formats (`file/d/`, `open?id=`, `uc?id=`, raw file ID).
- Zero-dependency media type classification (`detectMediaType`).

### 2. Multi-Tier Cache (`src/cache/`)
- **MemoryCache**: LRU capacity eviction and TTL expiration.
- **StorageEngine**: Persistent fallback backing Memory Cache with SessionStorage and IndexedDB.
- **Endpoint Learning**: Remembers successful CDN hostnames per File ID to skip failed candidates on subsequent loads.

### 3. Resolver & Candidate Generator (`src/core/`)
- Generates candidate CDN URLs and probes them concurrently using worker queue controls (`batchResolver.ts`).
- Request coalescing prevents duplicate network probes for identical File IDs across components.

### 4. Component Layer (`src/components/`)
- **`<DriveMedia />`**: Universal component delegating to specialized renderers.
- **`<DriveImage />`**: Image renderer with skeleton placeholders, fade transitions, and fallback UI.
- **`<DriveVideo />`**: Streaming HTML5 video player with poster thumbnail extraction.
- **`<DriveAudio />`**: Audio stream player with dynamic waveform canvas visualization.
- **`<DriveDocument />`**: PDF/TXT/MD preview document embedder.
- **`<DriveGallery />`**: Responsive mixed-media grid.

### 5. Developer Tools (`src/debug/`)
- On-screen `<DriveDebugOverlay />` providing real-time telemetry, cache metrics, and latency logs.
