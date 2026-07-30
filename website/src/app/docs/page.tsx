"use client";

import React from "react";
import Link from "next/link";
import { DocsSidebar } from "@/components/DocsSidebar";
import { CodeBlock } from "@/components/CodeBlock";
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldCheck, Layers, BookOpen } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
      <DocsSidebar />

      <div className="flex-1 space-y-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <Link href="/docs" className="hover:text-white">Docs</Link>
          <span>/</span>
          <span className="text-blue-400">Introduction</span>
        </div>

        <div className="space-y-4 border-b border-gray-800 pb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            DriveLoader Documentation
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Welcome to the official documentation for <code className="text-blue-300">@driveloader/react</code> — the complete Google Drive Media CDN for React applications.
          </p>
        </div>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              What is DriveLoader?
            </h2>
            <p>
              DriveLoader translates raw Google Drive viewing links into direct, high-performance binary CDN streams for images, videos, and public folders.
            </p>

            <ul className="space-y-2 text-xs text-gray-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Supports any Google Drive URL format or raw File ID</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>First-class Google Drive Video streaming & poster thumbnails</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automatic candidate endpoint failover & in-memory caching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Request coalescing to deduplicate concurrent network fetches</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">Quick Example</h2>
            <CodeBlock
              code={`import { DriveImage, DriveVideo } from '@driveloader/react';

export function MediaComponent() {
  return (
    <>
      <DriveImage src="https://drive.google.com/file/d/IMAGE_ID/view" alt="Drive Image" />
      <DriveVideo src="https://drive.google.com/file/d/VIDEO_ID/view?type=video" controls />
    </>
  );
}`}
              language="tsx"
              filename="App.tsx"
            />
          </div>

          <div className="pt-6 flex justify-between items-center border-t border-gray-800">
            <div />
            <Link
              href="/docs/installation"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <span>Next: Installation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
