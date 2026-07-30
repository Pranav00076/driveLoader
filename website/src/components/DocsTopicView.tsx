"use client";

import React from "react";
import Link from "next/link";
import { DocsSidebar } from "@/components/DocsSidebar";
import { CodeBlock } from "@/components/CodeBlock";
import { ArrowRight, Zap } from "lucide-react";

export function DocsTopicView({ slug }: { slug: string }) {
  const docsData: Record<string, { title: string; subtitle: string; code: string; content: string }> = {
    installation: {
      title: "Installation & Setup",
      subtitle: "Add @driveloader/react to your project using npm, pnpm, yarn, or bun.",
      code: `npm install @driveloader/react\n# or\npnpm add @driveloader/react\n# or\nyarn add @driveloader/react`,
      content: "After installing, remember to import the optional CSS stylesheet '@driveloader/react/styles.css' in your root layout or index entry point for default skeleton placeholder and gallery grid styles.",
    },
    "quick-start": {
      title: "Quick Start Guide",
      subtitle: "Start loading Google Drive images and streaming videos in under 2 minutes.",
      code: `import { DriveImage, DriveVideo } from '@driveloader/react';\nimport '@driveloader/react/styles.css';\n\nexport function Gallery() {\n  return (\n    <div className="space-y-4">\n      <DriveImage src="https://drive.google.com/file/d/IMAGE_ID/view" alt="Photo" />\n      <DriveVideo src="https://drive.google.com/file/d/VIDEO_ID/view" controls />\n    </div>\n  );\n}`,
      content: "DriveLoader handles resolution, CORS retries, preloader probes, and in-memory caching behind the scenes.",
    },
    "drive-image": {
      title: "<DriveImage /> Component",
      subtitle: "The core React component for rendering Google Drive images with skeletons and fallback UI.",
      code: `<DriveImage\n  src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"\n  alt="User Profile Avatar"\n  width={200}\n  height={200}\n  fade={true}\n  lazy={true}\n/>`,
      content: "DriveImage supports all standard HTML <img> attributes and React props. When lazy=true is enabled, resolution triggers only when the image enters the viewport.",
    },
    "drive-video": {
      title: "<DriveVideo /> Component",
      subtitle: "First-class Google Drive video streaming player supporting standard HTML5 video attributes.",
      code: `<DriveVideo\n  src="https://drive.google.com/file/d/VIDEO_ID/view?type=video"\n  controls\n  autoPlay={false}\n  muted={false}\n  loop={false}\n  preload="metadata"\n  width={640}\n  height={360}\n/>`,
      content: "DriveVideo extracts video duration, width, height, and poster preview thumbnails automatically.",
    },
    "drive-gallery": {
      title: "<DriveGallery /> Component",
      subtitle: "Responsive grid component for mixed image & video media items, or public Google Drive folders.",
      code: `<DriveGallery\n  images={[\n    'https://drive.google.com/file/d/IMG_ID/view',\n    'https://drive.google.com/file/d/VID_ID/view?type=video'\n  ]}\n  columns={{ sm: 1, md: 2, lg: 4 }}\n  gap="1.5rem"\n/>`,
      content: "DriveGallery inspects each asset's media type, rendering <DriveVideo /> for videos and <DriveImage /> for images.",
    },
    "folder-support": {
      title: "Public Google Drive Folder Support",
      subtitle: "Fetch and paginate public folder contents using the official Google Drive API v3.",
      code: `import { useDriveFolder } from '@driveloader/react';\n\nconst { assets, loading, loadMore, hasMore } = useDriveFolder({\n  folderUrl: 'https://drive.google.com/drive/folders/FOLDER_ID',\n  apiKey: 'YOUR_GOOGLE_DRIVE_API_KEY',\n  mediaTypes: ['image', 'video'],\n  pageSize: 20,\n});`,
      content: "Requires a public Google Drive API Key from Google Cloud Console.",
    },
    hooks: {
      title: "Custom React Hooks",
      subtitle: "Programmatic state control with useDriveImage, useDriveVideo, and useDriveFolder.",
      code: `import { useDriveVideo } from '@driveloader/react';\n\nconst { videoUrl, loading, error, metadata, thumbnailUrl } = useDriveVideo(driveUrl);`,
      content: "Exposes full resolution lifecycle, errors, and metadata.",
    },
    utilities: {
      title: "Core Utilities & Diagnostics",
      subtitle: "Low-level functions like resolveDriveImage, resolveDriveVideo, analyzeDriveUrl, and prefetch.",
      code: `import { analyzeDriveUrl, prefetchVideo } from '@driveloader/react';\n\nconst diag = analyzeDriveUrl(url);\nawait prefetchVideo(videoUrl);`,
      content: "Use analyzeDriveUrl() for link troubleshooting and prefetch() for preloading images or videos.",
    },
    caching: {
      title: "In-Memory Caching & Metrics",
      subtitle: "LRU capacity eviction and TTL expiration with real-time statistics.",
      code: `import { getCacheStats, clearCache } from '@driveloader/react';\n\nconst stats = getCacheStats();\nconsole.log(stats.hitRate, stats.cacheHits);\nclearCache();`,
      content: "Default TTL is 1 hour per resolved CDN URL.",
    },
    "retry-logic": {
      title: "Retry Engine & Candidate Probes",
      subtitle: "How endpoint learning and candidate probes guarantee high-availability media delivery.",
      code: `// Candidate priority sequence:\n// 1. Learned Endpoint (from previous success)\n// 2. lh3.googleusercontent.com/d/{ID}\n// 3. drive.google.com/uc?export=view&id={ID}`,
      content: "Endpoint learning remembers working CDN endpoints per file ID across app lifecycle.",
    },
    performance: {
      title: "Performance Optimization",
      subtitle: "Request coalescing, worker queue batching, and tree-shakeable zero-dependency architecture.",
      code: `import { resolveDriveImages } from '@driveloader/react';\n\nconst { results } = await resolveDriveImages(urls, { concurrency: 4 });`,
      content: "Deduplicates concurrent requests for identical file IDs to prevent network bloat.",
    },
    "migration-guide": {
      title: "Migration Guide to v1.2.0",
      subtitle: "Upgrade smoothly from v1.0 / v1.1 to v1.2.0 with zero breaking changes.",
      code: `// v1.2.0 is 100% backward compatible!\nimport { DriveImage, DriveVideo, DriveGallery } from '@driveloader/react';`,
      content: "v1.2.0 is a strictly additive upgrade introducing Google Drive Video support and mixed media galleries.",
    },
    faq: {
      title: "FAQ & Troubleshooting",
      subtitle: "Answers to common questions about permissions, API keys, and CORS.",
      code: `// Make sure Google Drive access is set to:\n// "Anyone with the link can view"`,
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
