# DriveLoader Project Roadmap

This document outlines planned milestones, architectural enhancements, and ecosystem features for `@driveloader/react`.

---

## 🏁 Completed Milestones (v1.2.0)

- [x] **Universal `<DriveMedia />` Component**: Single universal component auto-detecting images, videos, audio, and documents.
- [x] **DriveAudio & DrivePlaylist**: HTML5 audio streaming player with waveform visualization canvas.
- [x] **DriveDocument Viewer**: PDF, TXT, and Markdown embedded document viewer.
- [x] **Advanced Multi-Tier Cache**: Memory Cache + SessionStorage + IndexedDB with TTL and `inspectCache()`.
- [x] **CLI Suite (`npx driveloader`)**: Link validation, resolution, candidate inspection, cache clearing, and code generation.
- [x] **Next.js & React 19 Integration**: `<Image>` loader helper (`createDriveNextLoader()`), Server Actions, Edge Runtime, and Suspense.
- [x] **Developer Inspection HUD (`<DriveDebugOverlay />`)**: On-screen developer panel showing live cache hits and resolution latency.
- [x] **Actionable Errors**: Structured `DriveLoaderError` hierarchy detailing What Happened, Why It Happened, and How To Fix It.
- [x] **Performance Benchmarks**: Stress tested up to 10,000 media assets with ops/sec metrics.

---

## 🔮 Future Milestones (v1.3.0 & Beyond)

### 1. WebWorker Resolution Offloading
- Move candidate probes and DOM image preloads into background WebWorkers to keep main thread JS execution at 60fps under heavy load.

### 2. Enhanced Offline Sync
- ServiceWorker media caching for offline PWA web applications.

### 3. Framework Wrappers
- Vue 3 (`@driveloader/vue`), Svelte (`@driveloader/svelte`), and Angular wrappers built on core typescript engine.
