"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Grid, Image as ImageIcon, Video, Folder, Layers, Zap, Database, Play } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";

export default function ExamplesPage() {
  const [filter, setFilter] = useState<string>("all");

  const examplesList = [
    {
      id: "basic-image",
      title: "Basic Image Component",
      category: "image",
      description: "Render Google Drive images with skeletons, fade-in transitions, and automatic fallback endpoints.",
      code: `import { DriveImage } from '@driveloader/react';

export function Avatar() {
  return (
    <DriveImage
      src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"
      alt="User Avatar"
      width={120}
      height={120}
      fade={true}
    />
  );
}`,
    },
    {
      id: "video-player",
      title: "Google Drive Video Player",
      category: "video",
      description: "Stream Google Drive video files with HTML5 controls, custom poster thumbnails, and metadata extraction.",
      code: `import { DriveVideo } from '@driveloader/react';

export function HeroVideo() {
  return (
    <DriveVideo
      src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?type=video"
      controls
      autoPlay={false}
      preload="metadata"
      width={640}
      height={360}
    />
  );
}`,
    },
    {
      id: "mixed-gallery",
      title: "Mixed Media Gallery",
      category: "gallery",
      description: "Responsive grid layout that automatically renders images and videos side-by-side without manual configuration.",
      code: `import { DriveGallery } from '@driveloader/react';

export function MediaShowcase() {
  return (
    <DriveGallery
      images={[
        'https://drive.google.com/file/d/IMAGE_ID/view',
        'https://drive.google.com/file/d/VIDEO_ID/view?type=video',
      ]}
      columns={{ sm: 1, md: 2, lg: 3 }}
      gap="1.5rem"
    />
  );
}`,
    },
    {
      id: "folder-loader",
      title: "Public Folder Loading",
      category: "folder",
      description: "Fetch all images and videos from a public Google Drive folder using Google Drive API v3 with pagination.",
      code: `import { useDriveFolder, DriveImage } from '@driveloader/react';

export function FolderView({ folderUrl, apiKey }: { folderUrl: string; apiKey: string }) {
  const { folder, assets, loading, error, loadMore, hasMore } = useDriveFolder({
    folderUrl,
    apiKey,
    mediaTypes: ['image', 'video'],
    pageSize: 20,
  });

  return (
    <div>
      <h3>{folder?.name}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {assets.map(asset => (
          <DriveImage key={asset.id} src={asset.resolvedUrl} alt={asset.name} />
        ))}
      </div>
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}`,
    },
    {
      id: "use-drive-video",
      title: "Programmatic Video Hook",
      category: "hooks",
      description: "Access video resolution state, duration, width, height, mimeType, and thumbnail URLs directly in React components.",
      code: `import { useDriveVideo } from '@driveloader/react';

export function VideoInfo({ driveUrl }: { driveUrl: string }) {
  const { videoUrl, loading, error, metadata, thumbnailUrl } = useDriveVideo(driveUrl);

  if (loading) return <div>Resolving video...</div>;
  if (error) return <div>Failed to load: {error.message}</div>;

  return (
    <div>
      <video src={videoUrl!} controls poster={thumbnailUrl || undefined} />
      <p>Duration: {metadata?.duration}s | Dimensions: {metadata?.width}x{metadata?.height}</p>
    </div>
  );
}`,
    },
    {
      id: "cache-metrics",
      title: "Cache Metrics Dashboard",
      category: "cache",
      description: "Inspect cache hits, misses, hit rate percentages, in-flight active requests, and memory usage estimates.",
      code: `import { getCacheStats, clearCache } from '@driveloader/react';

function LogStats() {
  const stats = getCacheStats();
  console.log(\`Cache Hit Rate: \${stats.hitRate}%\`);
  console.log(\`Cached Items: \${stats.cachedEntries}\`);
  console.log(\`Memory Estimate: \${stats.memoryUsageEstimate}\`);
}`,
    },
  ];

  const filtered = filter === "all" ? examplesList : examplesList.filter(e => e.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Grid className="w-8 h-8 text-blue-400" />
          <span>Examples & Recipes Gallery</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Explore copy-pasteable code examples for images, videos, public folder galleries, custom hooks, and cache management.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 bg-gray-900/80 rounded-2xl border border-gray-800 w-full sm:w-fit overflow-x-auto scrollbar-none">
        {[
          { id: "all", label: "All Examples" },
          { id: "image", label: "Images" },
          { id: "video", label: "Videos" },
          { id: "gallery", label: "Galleries" },
          { id: "folder", label: "Public Folders" },
          { id: "hooks", label: "Hooks" },
          { id: "cache", label: "Caching" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filter === t.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((item) => (
          <div key={item.id} className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-1">{item.description}</p>
            </div>
            <CodeBlock code={item.code} language="tsx" filename={`${item.id}.tsx`} />
          </div>
        ))}
      </div>
    </div>
  );
}
