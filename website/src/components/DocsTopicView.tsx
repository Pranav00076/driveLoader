"use client";

import React from "react";
import Link from "next/link";
import { DocsSidebar } from "@/components/DocsSidebar";
import { CodeBlock } from "@/components/CodeBlock";
import { ArrowRight, Zap } from "lucide-react";

export function DocsTopicView({ slug }: { slug: string }) {
  const docsData: Record<string, { title: string; subtitle: string; code: string; content: string }> = {
    introduction: {

      title: "Introduction",
      subtitle: "The complete Google Drive Media CDN & SDK for React & Next.js applications.",
      code: `import { DriveMedia, DriveImage, DriveVideo, DriveAudio, DriveDocument } from '@driveloader/react';`,
      content: "DriveLoader seamlessly transforms Google Drive share links into high-performance CDN URLs for images, videos, audio tracks, PDFs, and public folders. Zero configuration needed.",
    },
    installation: {
      title: "Installation & Setup",
      subtitle: "Add @driveloader/react to your project using npm, pnpm, yarn, or bun.",
      code: `npm install @driveloader/react\n# or\npnpm add @driveloader/react\n# or\nyarn add @driveloader/react`,
      content: "After installing, import the optional CSS stylesheet '@driveloader/react/styles.css' for default skeleton animations, player controls, and gallery grid layouts.",
    },
    "quick-start": {
      title: "Quick Start Guide",
      subtitle: "Start loading Google Drive images, videos, audio, and documents in under 2 minutes.",
      code: `import { DriveMedia } from '@driveloader/react';\nimport '@driveloader/react/styles.css';\n\nexport function App() {\n  return (\n    <div className="space-y-4">\n      {/* Universal component automatically detects asset type */}\n      <DriveMedia src="https://drive.google.com/file/d/FILE_ID/view" />\n    </div>\n  );\n}`,
      content: "DriveLoader handles URL parsing, candidate probes, CORS retries, and multi-tier caching automatically.",
    },
    "drive-media": {
      title: "<DriveMedia /> Universal Component",
      subtitle: "The all-in-one universal component for Google Drive images, videos, audio, and documents.",
      code: `import { DriveMedia } from '@driveloader/react';\n\n<DriveMedia\n  src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"\n  alt="Universal Media Asset"\n  controls\n  autoPlay={false}\n/>`,
      content: "DriveMedia auto-detects whether the asset is an image, video, audio track, or PDF document and renders the specialized component seamlessly.",
    },
    "drive-image": {
      title: "<DriveImage /> Component",
      subtitle: "The core React component for rendering Google Drive images with skeletons, lazy loading, and failover endpoints.",
      code: `<DriveImage\n  src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"\n  alt="User Profile Avatar"\n  width={200}\n  height={200}\n  fade={true}\n  lazy={true}\n/>`,
      content: "DriveImage supports standard <img> props, adaptive width sizing, responsive srcSet generation, and fallback placeholder states.",
    },
    "drive-video": {
      title: "<DriveVideo /> Component",
      subtitle: "First-class Google Drive video player supporting standard HTML5 video attributes and metadata extraction.",
      code: `<DriveVideo\n  src="https://drive.google.com/file/d/VIDEO_ID/view?type=video"\n  controls\n  autoPlay={false}\n  muted={false}\n  loop={false}\n  preload="metadata"\n  width={640}\n  height={360}\n/>`,
      content: "DriveVideo extracts video duration, width, height, MIME type, and poster preview thumbnails automatically.",
    },
    "drive-audio": {
      title: "<DriveAudio /> & <DrivePlaylist /> Components",
      subtitle: "Stream Google Drive hosted audio files (MP3, WAV, AAC, OGG, FLAC) with custom waveform visualization.",
      code: `import { DriveAudio, DrivePlaylist } from '@driveloader/react';\n\n// Single Audio Track\n<DriveAudio src="https://drive.google.com/file/d/AUDIO_ID/view?type=audio" title="Song Title" artist="Artist Name" />\n\n// Multi-Track Playlist\n<DrivePlaylist tracks={[\n  { src: 'AUDIO_URL_1', title: 'Track 1', artist: 'Artist A' },\n  { src: 'AUDIO_URL_2', title: 'Track 2', artist: 'Artist B' }\n]} />`,
      content: "DriveAudio features HTML5 audio streaming, canvas waveform visualization, duration display, volume control, and multi-track playlist navigation.",
    },
    "drive-document": {
      title: "<DriveDocument /> Component",
      subtitle: "Preview Google Drive hosted PDFs, Google Docs, text files, and Markdown directly in your app.",
      code: `import { DriveDocument } from '@driveloader/react';\n\n<DriveDocument\n  src="https://drive.google.com/file/d/DOC_ID/view?type=document"\n  width="100%"\n  height="600px"\n  showToolbar={true}\n/>`,
      content: "DriveDocument renders documents with zoom controls (+ / - / Reset), download link, and full height embedding.",
    },
    "drive-gallery": {
      title: "<DriveGallery /> Component",
      subtitle: "Responsive grid component for mixed media items (images, videos, audio, docs) or public Google Drive folders.",
      code: `<DriveGallery\n  images={[\n    'https://drive.google.com/file/d/IMG_ID/view',\n    'https://drive.google.com/file/d/VID_ID/view?type=video'\n  ]}\n  columns={{ sm: 1, md: 2, lg: 4 }}\n  gap="1.5rem"\n/>`,
      content: "DriveGallery inspects each asset's media type, rendering <DriveVideo /> for videos, <DriveImage /> for images, <DriveAudio /> for audio, and <DriveDocument /> for documents.",
    },
    cli: {
      title: "CLI Tool (`npx driveloader`)",
      subtitle: "Command-line suite for URL validation, endpoint resolution, component code generation, and cache management.",
      code: `npx driveloader validate "https://drive.google.com/file/d/ID/view"\nnpx driveloader resolve "https://drive.google.com/file/d/ID/view"\nnpx driveloader generate-component audio\nnpx driveloader clear-cache`,
      content: "Run npx driveloader --help to see all available subcommands and flags.",
    },
    caching: {
      title: "Advanced Multi-Tier Cache Engine",
      subtitle: "Memory Cache + Persistent SessionStorage + IndexedDB with TTL, offline support, and inspectCache().",
      code: `import { getCacheStats, clearCache, inspectCache } from '@driveloader/react';\n\nconst stats = getCacheStats();\nconst items = inspectCache();\nconsole.log('Cache hit rate:', stats.hitRate + '%');`,
      content: "Supports LRU eviction capacity, versioning (driveloader_v1_), and offline stale-while-revalidate fallback.",
    },
    "nextjs-react19": {
      title: "Next.js & React 19 Integration",
      subtitle: "Custom image loader helper (createDriveNextLoader), Edge runtime, Server Actions, and React Suspense.",
      code: `import Image from 'next/image';\nimport { createDriveNextLoader, useDriveImageSuspense } from '@driveloader/react';\n\n// Next.js Image loader\nconst driveLoader = createDriveNextLoader();\n\nexport function ProfileImage({ src }: { src: string }) {\n  return <Image loader={driveLoader} src={src} alt="Next.js Image" width={300} height={300} />;\n}`,
      content: "Compatible with Next.js 13/14/15/16 App Router, Server Actions, and React 19 Suspense boundaries.",
    },
    "debug-hud": {
      title: "Developer Inspector HUD (<DriveDebugOverlay />)",
      subtitle: "On-screen debug panel for inspecting live cache hit rates, candidate probes, and resolution latency.",
      code: `import { DriveDebugOverlay } from '@driveloader/react';\n\nexport function App() {\n  return (\n    <main>\n      <YourAppContent />\n      {process.env.NODE_ENV === 'development' && <DriveDebugOverlay />}\n    </main>\n  );\n}`,
      content: "Render DriveDebugOverlay anywhere in your tree to inspect active requests, cache metrics, and working CDN endpoints in real time.",
    },
    "folder-support": {
      title: "Public Google Drive Folder Support",
      subtitle: "Fetch and paginate public folder contents using the official Google Drive API v3.",
      code: `import { useDriveFolder } from '@driveloader/react';\n\nconst { assets, loading, loadMore, hasMore } = useDriveFolder({\n  folderUrl: 'https://drive.google.com/drive/folders/FOLDER_ID',\n  apiKey: 'YOUR_GOOGLE_DRIVE_API_KEY',\n  mediaTypes: ['image', 'video'],\n  pageSize: 20,\n});`,
      content: "Requires a public Google Drive API Key from Google Cloud Console.",
    },
    hooks: {
      title: "Custom React Hooks",
      subtitle: "Programmatic state control with useDriveImage, useDriveVideo, useDriveAudio, useDriveDocument, and useDriveFolder.",
      code: `import { useDriveVideo, useDriveAudio } from '@driveloader/react';\n\nconst { videoUrl, loading } = useDriveVideo(videoUrl);\nconst { audioUrl, isPlaying, play, pause } = useDriveAudio(audioUrl);`,
      content: "Exposes full resolution lifecycle, errors, media controls, and extracted metadata.",
    },
    utilities: {
      title: "Core Utilities & Diagnostics",
      subtitle: "Low-level functions like resolveDriveImage, resolveDriveVideo, analyzeDriveUrl, and smart prefetch.",
      code: `import { analyzeDriveUrl, prefetchVideo, prefetchAudio } from '@driveloader/react';\n\nconst diag = analyzeDriveUrl(url);\nawait prefetchAudio(audioUrl);`,
      content: "Use analyzeDriveUrl() for link troubleshooting and prefetch() for preloading media assets.",
    },
    "migration-guide": {
      title: "Migration Guide to v1.2.0+",
      subtitle: "Upgrade smoothly with zero breaking changes.",
      code: `// v1.2.0+ is 100% backward compatible!\nimport { DriveMedia, DriveImage, DriveVideo, DriveAudio, DriveDocument } from '@driveloader/react';`,
      content: "v1.2.0+ is a strictly additive upgrade introducing Universal DriveMedia, DriveAudio, DriveDocument, CLI, and Advanced Multi-Tier Caching.",
    },
    faq: {
      title: "FAQ & Troubleshooting",
      subtitle: "Answers to common questions about permissions, API keys, and CORS.",
      code: `// Make sure Google Drive file access is set to:\n// "Anyone with the link can view"`,
      content: "If a file fails to load, ensure its Google Drive sharing setting is set to Public ('Anyone with the link').",
    },
  };


  const doc = docsData[slug] || docsData["installation"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
      <DocsSidebar />

      <div className="flex-1 space-y-8 max-w-4xl">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <Link href="/docs" className="hover:text-white">Docs</Link>
          <span>/</span>
          <span className="text-blue-400 font-semibold">{doc.title}</span>
        </div>

        <div className="space-y-4 border-b border-gray-800 pb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{doc.title}</h1>
          <p className="text-gray-400 text-sm leading-relaxed">{doc.subtitle}</p>
        </div>

        <div className="space-y-6 text-sm text-gray-300">
          <CodeBlock code={doc.code} language="tsx" filename={`${slug}.tsx`} />

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Usage Notes
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">{doc.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
