"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Grid, Image as ImageIcon, Video, Folder, Layers, Zap, Database, Play } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";

export default function ExamplesPage() {
  const [filter, setFilter] = useState<string>("all");

  const examplesList = [
    {
      id: "universal-media",
      title: "Universal <DriveMedia /> Auto-Detector",
      category: "media",
      description: "One single component automatically detects whether the Google Drive link is an image, video, audio track, or PDF document.",
      code: `import { DriveMedia } from '@driveloader/react';

export function UniversalAsset({ driveUrl }: { driveUrl: string }) {
  return (
    <DriveMedia
      src={driveUrl}
      alt="Dynamic Media Asset"
      controls
    />
  );
}`,
    },
    {
      id: "audio-playlist",
      title: "Google Drive Audio & Playlist Player",
      category: "audio",
      description: "Stream Google Drive hosted audio files with custom waveform visualization canvas and multi-track playlists.",
      code: `import { DriveAudio, DrivePlaylist } from '@driveloader/react';

export function PodcastPlayer() {
  return (
    <DrivePlaylist
      tracks={[
        { src: 'https://drive.google.com/file/d/AUDIO_1/view', title: 'Episode 1: Intro', artist: 'DriveLoader' },
        { src: 'https://drive.google.com/file/d/AUDIO_2/view', title: 'Episode 2: Deep Dive', artist: 'DriveLoader' }
      ]}
    />
  );
}`,
    },
    {
      id: "document-viewer",
      title: "PDF & Document Viewer (<DriveDocument />)",
      category: "document",
      description: "Preview PDFs, Google Docs, text files, and Markdown directly inside React apps with zoom and download controls.",
      code: `import { DriveDocument } from '@driveloader/react';

export function DocumentReader({ docUrl }: { docUrl: string }) {
  return (
    <DriveDocument
      src={docUrl}
      height="600px"
      width="100%"
    />
  );
}`,
    },
    {
      id: "portfolio-photography",
      title: "Portfolio & Photography Website",
      category: "portfolio",
      description: "High-performance masonry photo gallery with skeleton placeholders, lazy loading, and failover endpoints.",
      code: `import { DriveGallery } from '@driveloader/react';

export function PhotographyPortfolio({ photoUrls }: { photoUrls: string[] }) {
  return (
    <DriveGallery
      images={photoUrls}
      columns={{ sm: 1, md: 2, lg: 3 }}
      gap="1.5rem"
    />
  );
}`,
    },
    {
      id: "nextjs-app-router",
      title: "Next.js App Router Loader (createDriveNextLoader)",
      category: "nextjs",
      description: "Pass a custom loader to Next.js <Image /> component for optimized server-side rendering and CDN delivery.",
      code: `import Image from 'next/image';
import { createDriveNextLoader } from '@driveloader/react';

const driveLoader = createDriveNextLoader();

export function ProfileAvatar({ src }: { src: string }) {
  return (
    <Image
      loader={driveLoader}
      src={src}
      alt="User Profile"
      width={300}
      height={300}
      priority
    />
  );
}`,
    },
    {
      id: "vite-react-router",
      title: "Vite & React Router Single Page App",
      category: "vite",
      description: "Seamless single page application integration with instant client-side resolution and LRU memory caching.",
      code: `import { DriveImage, DriveVideo } from '@driveloader/react';

export function ViteApp() {
  return (
    <main className="p-8">
      <DriveImage src="https://drive.google.com/file/d/IMG_ID/view" alt="Vite Demo" />
      <DriveVideo src="https://drive.google.com/file/d/VID_ID/view" controls />
    </main>
  );
}`,
    },
    {
      id: "course-platform",
      title: "Course Platform & Video Player",
      category: "video",
      description: "Video course streaming platform featuring automatic poster thumbnails and video metadata extraction.",
      code: `import { DriveVideo, useDriveVideo } from '@driveloader/react';

export function LessonPlayer({ lessonUrl }: { lessonUrl: string }) {
  const { metadata, loading } = useDriveVideo(lessonUrl);

  return (
    <div>
      <DriveVideo src={lessonUrl} controls autoPlay={false} />
      {!loading && <p>Lesson Length: {metadata?.duration} seconds</p>}
    </div>
  );
}`,
    },
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
      id: "folder-loader",
      title: "Public Folder Explorer",
      category: "folder",
      description: "Fetch all images and videos from a public Google Drive folder using Google Drive API v3 with pagination.",
      code: `import { useDriveFolder, DriveImage } from '@driveloader/react';

export function FolderView({ folderUrl, apiKey }: { folderUrl: string; apiKey: string }) {
  const { folder, assets, loading, loadMore, hasMore } = useDriveFolder({
    folderUrl,
    apiKey,
    mediaTypes: ['image', 'video', 'audio', 'document'],
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
      id: "devtools-hud",
      title: "Developer Debugger HUD (<DriveDebugOverlay />)",
      subtitle: "On-screen debug panel for inspecting live cache hit rates, candidate probes, and resolution latency.",
      category: "devtools",
      description: "Expose real-time telemetry, cache hits, resolution latency, and candidate endpoints during development.",
      code: `import { DriveDebugOverlay } from '@driveloader/react';

export function App() {
  return (
    <main>
      <YourAppContent />
      {process.env.NODE_ENV === 'development' && <DriveDebugOverlay />}
    </main>
  );
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
