"use client";

import React, { useState } from "react";
import { Layers, Search, Code, Check, Copy } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";

interface PropRow {
  name: string;
  type: string;
  required: boolean;
  default: string;
  desc: string;
}

interface ApiItem {
  name: string;
  signature: string;
  description: string;
  propsTable?: PropRow[];
}

interface ApiSection {
  title: string;
  items: ApiItem[];
}

export default function ApiReferencePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const apiSections: ApiSection[] = [

    {
      title: "React Components",
      items: [
        {
          name: "<DriveImage />",
          signature: "React.ForwardRefExoticComponent<DriveImageProps>",
          description: "Renders Google Drive images with automatic endpoint failover, skeleton placeholders, fade-in animations, and lazy loading.",
          propsTable: [
            { name: "src", type: "string", required: true, default: "—", desc: "Google Drive share link or File ID" },
            { name: "alt", type: "string", required: false, default: "''", desc: "Image alt description text" },
            { name: "width", type: "number | string", required: false, default: "auto", desc: "Image width" },
            { name: "height", type: "number | string", required: false, default: "auto", desc: "Image height" },
            { name: "fade", type: "boolean", required: false, default: "true", desc: "Enable CSS opacity fade-in transition" },
            { name: "lazy", type: "boolean", required: false, default: "true", desc: "Enable IntersectionObserver lazy loading" },
            { name: "placeholder", type: "ReactNode", required: false, default: "Skeleton", desc: "Custom React node during resolution" },
            { name: "fallback", type: "ReactNode", required: false, default: "Fallback UI", desc: "Custom React node if resolution fails" },
            { name: "onResolveSuccess", type: "(result: ResolveResult) => void", required: false, default: "—", desc: "Callback when DriveLoader resolves URL" },
          ],
        },
        {
          name: "<DriveVideo />",
          signature: "React.ForwardRefExoticComponent<DriveVideoProps>",
          description: "Streams Google Drive video files with HTML5 controls, poster thumbnails, metadata extraction, and lazy loading.",
          propsTable: [
            { name: "src", type: "string", required: true, default: "—", desc: "Google Drive video share link or File ID" },
            { name: "controls", type: "boolean", required: false, default: "true", desc: "Show native HTML5 playback controls" },
            { name: "autoPlay", type: "boolean", required: false, default: "false", desc: "Auto play video stream" },
            { name: "muted", type: "boolean", required: false, default: "false", desc: "Mute video audio" },
            { name: "loop", type: "boolean", required: false, default: "false", desc: "Loop playback" },
            { name: "poster", type: "string", required: false, default: "Thumbnail URL", desc: "Poster preview image URL" },
            { name: "preload", type: "'metadata' | 'auto' | 'none'", required: false, default: "'metadata'", desc: "Video preload strategy" },
            { name: "onLoadedMetadata", type: "(e, metadata?: DriveVideoMetadata) => void", required: false, default: "—", desc: "Callback when video metadata is loaded" },
          ],
        },
        {
          name: "<DriveGallery />",
          signature: "React.FC<DriveGalleryProps>",
          description: "Responsive grid layout for displaying collections of images and videos, or entire public Google Drive folders.",
          propsTable: [
            { name: "images", type: "Array<string | DriveGalleryItem>", required: false, default: "—", desc: "Array of media URLs or objects" },
            { name: "folderUrl", type: "string", required: false, default: "—", desc: "Public Google Drive folder share link" },
            { name: "apiKey", type: "string", required: false, default: "—", desc: "Public Google Drive API Key for folder loading" },
            { name: "columns", type: "number | { sm?: number, md?: number, lg?: number }", required: false, default: "3", desc: "Responsive column grid counts" },
            { name: "gap", type: "number | string", required: false, default: "'1rem'", desc: "Grid gap spacing" },
            { name: "mediaTypes", type: "('image' | 'video')[]", required: false, default: "['image','video']", desc: "Filter media types from folder" },
          ],
        },
      ],
    },
    {
      title: "React Hooks",
      items: [
        {
          name: "useDriveImage(src, options?)",
          signature: "(src: string, options?: ResolveOptions) => UseDriveImageResult",
          description: "Custom hook for stateful image resolution with candidate endpoints and reload callbacks.",
          propsTable: [
            { name: "imageUrl", type: "string | null", required: false, default: "null", desc: "Working direct CDN image URL" },
            { name: "loading", type: "boolean", required: false, default: "true", desc: "True while resolving" },
            { name: "error", type: "Error | null", required: false, default: "null", desc: "Error object if resolution fails" },
            { name: "reload", type: "(options?: { bypassCache?: boolean }) => void", required: false, default: "—", desc: "Function to reload resolution" },
          ],
        },
        {
          name: "useDriveVideo(src, options?)",
          signature: "(src: string, options?: ResolveOptions) => UseDriveVideoResult",
          description: "Custom hook for video resolution and metadata extraction (duration, width, height, mimeType).",
          propsTable: [
            { name: "videoUrl", type: "string | null", required: false, default: "null", desc: "Working direct CDN video stream URL" },
            { name: "metadata", type: "DriveVideoMetadata | null", required: false, default: "null", desc: "Video duration, width, height, size, mimeType" },
            { name: "thumbnailUrl", type: "string | null", required: false, default: "null", desc: "Preview thumbnail image URL" },
          ],
        },
        {
          name: "useDriveFolder(options)",
          signature: "(options: LoadFolderOptions) => UseDriveFolderResult",
          description: "Hook for fetching and paginating public Google Drive folder assets.",
          propsTable: [
            { name: "assets", type: "DriveAsset[]", required: false, default: "[]", desc: "Accumulated media assets" },
            { name: "loadMore", type: "() => void", required: false, default: "—", desc: "Function to fetch next page" },
            { name: "hasMore", type: "boolean", required: false, default: "false", desc: "True if additional pages exist" },
          ],
        },
      ],
    },
    {
      title: "Core Utilities & Functions",
      items: [
        {
          name: "resolveDriveImage(src, options?)",
          signature: "(src: string, options?: ResolveOptions) => Promise<ResolveResult>",
          description: "Resolves any Google Drive image URL or File ID into a direct working CDN link with endpoint learning and caching.",
        },
        {
          name: "resolveDriveVideo(src, options?)",
          signature: "(src: string, options?: ResolveOptions) => Promise<ResolveVideoResult>",
          description: "Resolves any Google Drive video URL or File ID into a direct CDN streaming link and extracts video metadata.",
        },
        {
          name: "resolveDriveImages(urls, options?)",
          signature: "(urls: string[], options?: BatchResolveOptions) => Promise<BatchResolveResult>",
          description: "Concurrently resolves multiple URLs with worker queue concurrency controls.",
        },
        {
          name: "isDriveVideo(urlOrId)",
          signature: "(urlOrId: string) => boolean",
          description: "Checks whether an input string or link represents a video asset.",
        },
        {
          name: "getVideoThumbnail(src, options?)",
          signature: "(src: string, options?: { width?: number }) => string",
          description: "Generates or retrieves direct preview thumbnail URLs for Google Drive videos.",
        },
        {
          name: "extractVideoMetadata(src, options?)",
          signature: "(src: string, options?: ResolveOptions) => Promise<DriveVideoMetadata>",
          description: "Extracts video duration, width, height, MIME type, and file size.",
        },
        {
          name: "analyzeDriveUrl(urlOrId)",
          signature: "(urlOrId: string) => UrlDiagnostics",
          description: "Analyzes link validity, format variants, TTL, and actionable recommendations.",
        },
      ],
    },
    {
      title: "Error Hierarchy",
      items: [
        { name: "DriveLoaderError", signature: "extends Error", description: "Base custom error class for all @driveloader/react errors." },
        { name: "InvalidDriveUrlError", signature: "extends DriveLoaderError", description: "Thrown when input string is not a valid Google Drive URL or File ID." },
        { name: "InvalidVideoError", signature: "extends DriveLoaderError", description: "Thrown when input video URL or ID is invalid." },
        { name: "VideoResolutionError", signature: "extends DriveLoaderError", description: "Thrown when video resolution fails across candidate endpoints." },
        { name: "UnsupportedVideoFormatError", signature: "extends DriveLoaderError", description: "Thrown when video format is unsupported by HTML5 video player." },
        { name: "PrivateFileError", signature: "extends DriveLoaderError", description: "Thrown when file access is private or restricted." },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-8 h-8 text-blue-400" />
          <span>API Reference</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Complete TypeScript API documentation for components, hooks, core resolution utilities, and error classes.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter API functions, props, or errors..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:border-blue-500 focus:outline-none font-mono"
        />
      </div>

      {/* API Sections */}
      <div className="space-y-12">
        {apiSections.map((sec, secIdx) => {
          const filteredItems = sec.items.filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={secIdx} className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {sec.title}
              </h2>

              <div className="space-y-6">
                {filteredItems.map((item, itemIdx) => (
                  <div key={itemIdx} className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-800/60 pb-3">
                      <h3 className="text-lg font-bold text-blue-400 font-mono">{item.name}</h3>
                      <span className="text-xs font-mono text-gray-400 bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800 w-fit max-w-full break-all">
                        {item.signature}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">{item.description}</p>

                    {item.propsTable && (
                      <div className="pt-2">
                        {/* Mobile prop card list */}
                        <div className="sm:hidden space-y-3">
                          {item.propsTable.map((p, pIdx) => (
                            <div key={pIdx} className="p-3 bg-gray-900/60 rounded-xl border border-gray-800/80 space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono font-bold text-blue-300 text-xs">{p.name}</span>
                                <span className="font-mono text-gray-400 text-[10px]">Default: {p.default}</span>
                              </div>
                              <div className="font-mono text-purple-300 text-[11px] break-all bg-black/40 px-2 py-0.5 rounded w-fit">{p.type}</div>
                              <p className="text-xs text-gray-400 font-sans">{p.desc}</p>
                            </div>
                          ))}
                        </div>

                        {/* Desktop prop table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse font-sans">
                            <thead>
                              <tr className="border-b border-gray-800 text-gray-400">
                                <th className="py-2 pr-4 font-semibold">Prop / Key</th>
                                <th className="py-2 pr-4 font-semibold">Type</th>
                                <th className="py-2 pr-4 font-semibold">Default</th>
                                <th className="py-2 font-semibold">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/40 text-gray-300">
                              {item.propsTable.map((p, pIdx) => (
                                <tr key={pIdx} className="hover:bg-gray-900/30">
                                  <td className="py-2.5 pr-4 font-mono font-bold text-blue-300">{p.name}</td>
                                  <td className="py-2.5 pr-4 font-mono text-purple-300 text-[11px]">{p.type}</td>
                                  <td className="py-2.5 pr-4 font-mono text-gray-400">{p.default}</td>
                                  <td className="py-2.5 text-gray-400">{p.desc}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
