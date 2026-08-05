"use client";

import React from "react";
import Link from "next/link";
import { DocsSidebar } from "@/components/DocsSidebar";
import { CodeBlock } from "@/components/CodeBlock";
import { ArrowRight, Zap, CheckCircle2, AlertTriangle, Activity, Link as LinkIcon } from "lucide-react";

export function DocsTopicView({ slug }: { slug: string }) {
  const docsData: Record<
    string,
    {
      title: string;
      subtitle: string;
      overview: string;
      code: string;
      bestPractices?: string[];
      commonMistakes?: string[];
      performance?: string;
      relatedApis?: string[];
    }
  > = {
    introduction: {
      title: "Introduction",
      subtitle: "The complete Google Drive Media CDN & SDK for React & Next.js applications.",
      overview: "DriveLoader seamlessly transforms Google Drive share links into high-performance CDN URLs for images, videos, audio tracks, PDFs, and public folders. Zero configuration needed.",
      code: `import { DriveMedia, DriveImage, DriveVideo, DriveAudio, DriveDocument } from '@driveloader/react';`,
      bestPractices: [
        "Use <DriveMedia /> for dynamic user-generated content.",
        "Always ensure your Google Drive files are set to 'Anyone with the link can view'."
      ],
      performance: "DriveLoader uses a multi-tier cache to ensure direct CDN links resolve in under 15ms after the first load.",
      relatedApis: ["quick-start", "drive-media", "caching"]
    },
    installation: {
      title: "Installation & Setup",
      subtitle: "Add @driveloader/react to your project using npm, pnpm, yarn, or bun.",
      overview: "DriveLoader is a lightweight, zero-dependency peer SDK. It works seamlessly with React 17/18/19 and Next.js.",
      code: `npm install @driveloader/react\n# or\npnpm add @driveloader/react\n# or\nyarn add @driveloader/react`,
      bestPractices: [
        "Import '@driveloader/react/styles.css' in your global layout/App.tsx for default skeleton animations."
      ],
      commonMistakes: [
        "Forgetting to import the CSS file when using DriveAudio or DriveGallery components."
      ],
      relatedApis: ["quick-start", "cli"]
    },
    "quick-start": {
      title: "Quick Start Guide",
      subtitle: "Start loading Google Drive images, videos, audio, and documents in under 2 minutes.",
      overview: "DriveLoader handles URL parsing, candidate probes, CORS retries, and multi-tier caching automatically.",
      code: `import { DriveMedia } from '@driveloader/react';\nimport '@driveloader/react/styles.css';\n\nexport function App() {\n  return (\n    <div className="space-y-4">\n      {/* Universal component automatically detects asset type */}\n      <DriveMedia src="https://drive.google.com/file/d/FILE_ID/view" />\n    </div>\n  );\n}`,
      bestPractices: [
        "Extract File IDs instead of passing full URLs to save bandwidth, though both work perfectly."
      ],
      relatedApis: ["drive-media", "drive-image"]
    },
    "drive-media": {
      title: "<DriveMedia /> Universal Component",
      subtitle: "The all-in-one universal component for Google Drive images, videos, audio, and documents.",
      overview: "DriveMedia auto-detects whether the asset is an image, video, audio track, or PDF document and renders the specialized component seamlessly.",
      code: `import { DriveMedia } from '@driveloader/react';\n\n<DriveMedia\n  src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"\n  alt="Universal Media Asset"\n  controls\n  autoPlay={false}\n/>`,
      bestPractices: [
        "Use type='auto' (default) for mixed-media collections.",
        "Pass standard HTML5 attributes like 'controls' and 'autoPlay' which will be forwarded to the correct underlying element."
      ],
      commonMistakes: [
        "Passing unsupported props for specific media types (e.g., passing 'showWaveform' when the asset is an image)."
      ],
      performance: "Media detection adds less than 1ms of overhead using regex-based local parsing before network requests.",
      relatedApis: ["drive-image", "drive-video", "drive-audio"]
    },
    "drive-image": {
      title: "<DriveImage /> Component",
      subtitle: "The core React component for rendering Google Drive images with skeletons, lazy loading, and failover endpoints.",
      overview: "DriveImage supports standard <img> props, adaptive width sizing, responsive srcSet generation, and fallback placeholder states.",
      code: `<DriveImage\n  src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"\n  alt="User Profile Avatar"\n  width={200}\n  height={200}\n  fade={true}\n  lazy={true}\n/>`,
      bestPractices: [
        "Always provide 'width' and 'height' to prevent Layout Shift.",
        "Enable 'lazy=true' (default) for images below the fold."
      ],
      performance: "Utilizes Next.js Image loader internally if configured, or falls back to optimized native <img loading='lazy'>.",
      relatedApis: ["hooks", "nextjs-react19"]
    },
    "drive-video": {
      title: "<DriveVideo /> Component",
      subtitle: "First-class Google Drive video player supporting standard HTML5 video attributes and metadata extraction.",
      overview: "DriveVideo extracts video duration, width, height, MIME type, and poster preview thumbnails automatically.",
      code: `<DriveVideo\n  src="https://drive.google.com/file/d/VIDEO_ID/view?type=video"\n  controls\n  autoPlay={false}\n  muted={false}\n  loop={false}\n  preload="metadata"\n  width={640}\n  height={360}\n/>`,
      commonMistakes: [
        "Not setting preload='metadata', causing the whole video to buffer on load."
      ],
      performance: "Poster generation uses lightweight Drive Thumbnail API, saving bandwidth before user clicks play.",
      relatedApis: ["drive-media", "hooks"]
    },
    "drive-audio": {
      title: "<DriveAudio /> & <DrivePlaylist />",
      subtitle: "Stream Google Drive hosted audio files with custom waveform visualization.",
      overview: "DriveAudio features HTML5 audio streaming, canvas waveform visualization, duration display, volume control, and multi-track playlist navigation.",
      code: `import { DriveAudio, DrivePlaylist } from '@driveloader/react';\n\n// Single Audio Track\n<DriveAudio src="https://drive.google.com/file/d/AUDIO_ID/view" title="Song Title" artist="Artist" />\n\n// Playlist\n<DrivePlaylist tracks={[{ src: 'ID_1' }, { src: 'ID_2' }]} />`,
      bestPractices: [
        "Always provide track titles and artist names manually, as Google Drive metadata extraction for audio is limited."
      ],
      relatedApis: ["drive-media"]
    },
    "drive-document": {
      title: "<DriveDocument /> Component",
      subtitle: "Preview Google Drive hosted PDFs, Google Docs, text files, and Markdown.",
      overview: "DriveDocument renders documents with zoom controls (+ / - / Reset), download link, and full height embedding using secure iframes.",
      code: `import { DriveDocument } from '@driveloader/react';\n\n<DriveDocument\n  src="https://drive.google.com/file/d/DOC_ID/view"\n  width="100%"\n  height="600px"\n  showToolbar={true}\n/>`,
      bestPractices: [
        "Wrap <DriveDocument /> in a fixed-height container or pass an explicit height to prevent iframe collapse."
      ],
      commonMistakes: [
        "Relying on auto-height, which iframes do not natively support securely."
      ],
      relatedApis: ["drive-media"]
    },
    "drive-gallery": {
      title: "<DriveGallery /> Component",
      subtitle: "Responsive grid component for mixed media items or public Google Drive folders.",
      overview: "DriveGallery inspects each asset's media type, rendering specialized components automatically in a responsive grid.",
      code: `<DriveGallery\n  images={['https://drive.google.com/file/d/IMG_ID/view', 'https://drive.google.com/file/d/VID_ID/view']}\n  columns={{ sm: 1, md: 2, lg: 4 }}\n  gap="1.5rem"\n/>`,
      performance: "Uses CSS Grid for zero-JS layout reflows, ensuring extreme performance on low-end devices.",
      relatedApis: ["drive-media", "folder-support"]
    },
    cli: {
      title: "CLI Tool (`npx driveloader`)",
      subtitle: "Command-line suite for URL validation, endpoint resolution, component code generation, and cache management.",
      overview: "Automate troubleshooting, clear persistent storage caches, run local benchmarks, and scaffold boilerplate components directly from your terminal.",
      code: `npx driveloader doctor\nnpx driveloader benchmark\nnpx driveloader inspect "https://drive.google.com/file/d/ID/view"\nnpx driveloader generate video`,
      bestPractices: [
        "Use 'npx driveloader doctor' before submitting bug reports to verify system compatibility.",
        "Run 'npx driveloader benchmark' in CI to ensure asset latency remains low."
      ],
      commonMistakes: [
        "Running global installations (npm i -g) instead of using npx, leading to outdated CLI versions."
      ],
      relatedApis: ["faq", "utilities"]
    },
    caching: {
      title: "Advanced Multi-Tier Cache Engine",
      subtitle: "Memory Cache + Persistent SessionStorage + IndexedDB with TTL.",
      overview: "DriveLoader utilizes an LRU Memory cache backed by IndexedDB persistent storage. This allows instant offline resolution for previously visited media assets.",
      code: `import { getCacheStats, clearCache, inspectCache } from '@driveloader/react';\n\nconst stats = getCacheStats();\nconsole.log('Hit rate:', stats.hitRate + '%');`,
      bestPractices: [
        "Do not clear cache manually unless explicitly providing a 'Reset Application' setting to users."
      ],
      performance: "Cache throughput exceeds 10,000 ops/sec, completely bypassing network roundtrips for resolved endpoints.",
      relatedApis: ["debug-hud"]
    },
    "nextjs-react19": {
      title: "Next.js & React 19 Integration",
      subtitle: "Custom image loader helper, Edge runtime, Server Actions, and React Suspense.",
      overview: "DriveLoader perfectly integrates into Next.js App Router. Use createDriveNextLoader() to let Next.js Image component handle Drive links.",
      code: `import Image from 'next/image';\nimport { createDriveNextLoader } from '@driveloader/react';\n\nconst driveLoader = createDriveNextLoader();\n\nexport function ProfileImage({ src }: { src: string }) {\n  return <Image loader={driveLoader} src={src} alt="Next" width={300} height={300} />;\n}`,
      bestPractices: [
        "Always pass explicit width and height when using Next.js Image."
      ],
      relatedApis: ["drive-image"]
    },
    "debug-hud": {
      title: "Developer Inspector HUD",
      subtitle: "On-screen debug panel for inspecting live cache hit rates and resolution latency.",
      overview: "Render DriveDebugOverlay anywhere in your app to get a real-time, in-app dashboard showing live candidate probes, cache hits, and performance telemetry.",
      code: `import { DriveDebugOverlay } from '@driveloader/react';\n\nexport function App() {\n  return (\n    <main>\n      <YourAppContent />\n      {process.env.NODE_ENV === 'development' && <DriveDebugOverlay />}\n    </main>\n  );\n}`,
      commonMistakes: [
        "Leaving DriveDebugOverlay active in production builds (always wrap in process.env.NODE_ENV check)."
      ],
      relatedApis: ["caching", "utilities"]
    },
    "folder-support": {
      title: "Public Google Drive Folder Support",
      subtitle: "Fetch and paginate public folder contents using the official Google Drive API v3.",
      overview: "Dynamically load entire public folders using the useDriveFolder hook. Handles pagination, error states, and automatic media type detection.",
      code: `import { useDriveFolder } from '@driveloader/react';\n\nconst { assets, loading, loadMore } = useDriveFolder({\n  folderUrl: 'https://drive.google.com/drive/folders/ID',\n  apiKey: 'YOUR_API_KEY',\n});`,
      bestPractices: [
        "Always restrict your Google Drive API Key to your production domain to prevent abuse."
      ],
      commonMistakes: [
        "Forgetting to pass an apiKey. Folder loading is the ONLY feature in DriveLoader that requires an API key."
      ],
      relatedApis: ["drive-gallery"]
    },
    hooks: {
      title: "Custom React Hooks",
      subtitle: "Programmatic state control with useDriveImage, useDriveVideo, and useDriveAudio.",
      overview: "Exposes full resolution lifecycle, errors, media controls, and extracted metadata directly to your custom React components.",
      code: `import { useDriveVideo } from '@driveloader/react';\n\nconst { videoUrl, loading, error, metadata } = useDriveVideo(url);`,
      bestPractices: [
        "Use hooks when you need to build entirely custom UI elements (like a bespoke video player controls bar)."
      ],
      relatedApis: ["drive-video", "drive-audio"]
    },
    utilities: {
      title: "Core Utilities & Diagnostics",
      subtitle: "Low-level functions like resolveDriveImage, analyzeDriveUrl, and smart prefetch.",
      overview: "DriveLoader exports its internal diagnostic tools. Use analyzeDriveUrl() to classify links and get format warnings.",
      code: `import { analyzeDriveUrl, prefetchAudio } from '@driveloader/react';\n\nconst diag = analyzeDriveUrl(url);\nawait prefetchAudio(url);`,
      bestPractices: [
        "Prefetch heavy assets (like videos or high-res images) on hover to eliminate loading spinners on click."
      ],
      relatedApis: ["debug-hud", "cli"]
    },
    "migration-guide": {
      title: "Migration Guide to v1.2.0+",
      subtitle: "Upgrade smoothly with zero breaking changes.",
      overview: "v1.2.0 is a strictly additive update introducing Universal DriveMedia, audio, documents, deep diagnostics, and actionable errors.",
      code: `// v1.2.0+ is 100% backward compatible!\nimport { DriveMedia } from '@driveloader/react';`,
      bestPractices: [
        "Gradually swap <DriveImage> for <DriveMedia> if your app deals with mixed user-uploaded Drive URLs."
      ]
    },
    faq: {
      title: "FAQ & Troubleshooting",
      subtitle: "Answers to common questions about actionable errors, permissions, and CORS.",
      overview: "DriveLoader features Actionable Errors. Every error log specifies What Happened, Why It Happened, and How To Fix It.",
      code: `// Actionable Error Example\n// [DriveLoader: Private File] What happened: Asset is private.\n// • Why it happened: Google Drive requires public permission.\n// • How to fix it: Change to "Anyone with the link can view".`,
      commonMistakes: [
        "Testing with files owned by a Workspace Domain that restricts external public sharing."
      ],
      relatedApis: ["cli", "utilities"]
    },
  };

  const doc = docsData[slug] || docsData["installation"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
      <DocsSidebar />

      <div className="flex-1 space-y-10 max-w-4xl">
        {/* Header */}
        <div className="space-y-4 border-b border-gray-800 pb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">{doc.title}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{doc.title}</h1>
          <p className="text-gray-400 text-base leading-relaxed">{doc.subtitle}</p>
        </div>

        {/* Overview */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Overview
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/50 p-5 rounded-2xl border border-gray-800/60">
            {doc.overview}
          </p>
        </div>

        {/* Code Example */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Code Example
          </h2>
          <CodeBlock code={doc.code} language="tsx" filename={`${slug}.tsx`} />
        </div>

        {/* Best Practices */}
        {doc.bestPractices && doc.bestPractices.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Best Practices
            </h2>
            <ul className="space-y-2">
              {doc.bestPractices.map((practice, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 bg-emerald-950/10 p-4 rounded-xl border border-emerald-900/30">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Mistakes */}
        {doc.commonMistakes && doc.commonMistakes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Common Mistakes
            </h2>
            <ul className="space-y-2">
              {doc.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 bg-amber-950/10 p-4 rounded-xl border border-amber-900/30">
                  <span className="text-amber-500 font-bold">×</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Performance Notes */}
        {doc.performance && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Performance Notes
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed bg-purple-950/10 p-5 rounded-2xl border border-purple-900/30">
              {doc.performance}
            </p>
          </div>
        )}

        {/* Related APIs */}
        {doc.relatedApis && doc.relatedApis.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-400" />
              Related APIs
            </h2>
            <div className="flex flex-wrap gap-3">
              {doc.relatedApis.map((api, idx) => (
                <Link
                  key={idx}
                  href={`/docs/${api}`}
                  className="px-4 py-2 bg-gray-900 rounded-lg text-sm text-blue-400 font-medium hover:bg-gray-800 border border-gray-800 transition-colors flex items-center gap-1.5"
                >
                  {api}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

