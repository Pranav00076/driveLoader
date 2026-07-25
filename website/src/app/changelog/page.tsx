"use client";

import React from "react";
import { History, Tag, Sparkles, CheckCircle2 } from "lucide-react";

export default function ChangelogPage() {
  const releases = [
    {
      version: "1.2.0",
      date: "July 26, 2026",
      isLatest: true,
      tagline: "First-Class Google Drive Video Support & Mixed Media Galleries",
      changes: [
        "Added <DriveVideo /> component supporting standard HTML5 video attributes (controls, autoPlay, muted, loop, playsInline, poster, preload, crossOrigin, referrerPolicy).",
        "Added useDriveVideo() React Hook returning videoUrl, loading, error, reload, metadata, and thumbnailUrl.",
        "Added resolveDriveVideo() extending core resolution engine with endpoint learning and request coalescing.",
        "Added video metadata extraction (duration, width, height, mimeType, size) and getVideoThumbnail().",
        "Upgraded <DriveGallery /> to automatically detect media types and render images and videos side-by-side.",
        "Added typed video errors (InvalidVideoError, VideoResolutionError, UnsupportedVideoFormatError).",
      ],
    },
    {
      version: "1.1.0",
      date: "July 23, 2026",
      isLatest: false,
      tagline: "Public Google Drive Folder API & Extension Filtering",
      changes: [
        "Added public Google Drive folder support via loadFolderAssets() and useDriveFolder() hook.",
        "Exposed DriveFolderMetadata (id, name, webViewLink, createdTime, modifiedTime) and enriched DriveAsset metadata.",
        "Added sorting (orderBy) and extension filtering (extensions: ['jpg', 'png', 'mp4']).",
        "Added folder mode to <DriveGallery folderUrl='...' apiKey='...' /> with responsive grid layout.",
      ],
    },
    {
      version: "1.0.1",
      date: "July 23, 2026",
      isLatest: false,
      tagline: "Referrer Policy & Chrome CORB Restriction Fix",
      changes: [
        "Added referrerPolicy: 'no-referrer' to candidate image preloader probes and <DriveImage /> component.",
        "Fixed Chrome Cross-Origin Read Blocking (CORB) and referrer restrictions on Google Drive CDN images.",
      ],
    },
    {
      version: "1.0.0",
      date: "July 23, 2026",
      isLatest: false,
      tagline: "Initial Production Release",
      changes: [
        "URL Parser supporting file/d/, open?id=, uc?id=, docs.google.com, lh3, and raw File IDs.",
        "Multi-candidate endpoint fallback pipeline with non-rendering image probes.",
        "Endpoint learning & concurrent request coalescing.",
        "High-performance memory cache featuring TTL expiration and LRU capacity eviction.",
        "Batch resolution with resolveDriveImages() and worker concurrency queue controls.",
        "Diagnostics API analyzeDriveUrl(url) and React suite (<DriveImage />, <DriveGallery />, useDriveImage()).",
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <History className="w-8 h-8 text-blue-400" />
          <span>Release Changelog & Timeline</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Track all new features, enhancements, and performance optimizations introduced in every version of @driveloader/react.
        </p>
      </div>

      <div className="relative border-l border-gray-800 ml-4 space-y-10 pl-6 pt-2">
        {releases.map((rel, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Node Icon */}
            <div
              className={`absolute -left-[35px] top-1.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                rel.isLatest
                  ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20"
                  : "bg-gray-900 border-gray-700"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${rel.isLatest ? "bg-white" : "bg-gray-400"}`} />
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
                    v{rel.version}
                    {rel.isLatest && (
                      <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Latest Release
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-mono">{rel.date}</span>
              </div>

              <p className="text-sm font-semibold text-blue-300">{rel.tagline}</p>

              <ul className="space-y-2 text-xs text-gray-300">
                {rel.changes.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
