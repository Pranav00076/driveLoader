"use client";

import React from "react";
import Link from "next/link";
import { Clock, User, ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";

export function BlogPostView({ slug }: { slug: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog Hub
      </Link>

      <div className="space-y-4 border-b border-gray-800 pb-8">
        <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
          <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 font-sans">
            Architecture & Deep-Dive
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            5 min read
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-blue-400" />
            DriveLoader Core Team
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Building a Zero-Config Google Drive Media CDN in React
        </h1>
      </div>

      <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <p className="text-gray-300">
            Google Drive is one of the most ubiquitous file storage services in the world. Developers frequently use it to store images, video clips, and media assets for web applications. However, embedding raw Google Drive URLs directly into standard HTML tags often results in broken images or CORS errors.
          </p>

          <h2 className="text-xl font-bold text-white pt-4 border-t border-gray-800">Why Standard Google Drive Links Fail</h2>
          <p className="text-gray-300">
            When you click "Share" or "Copy Link" in Google Drive, the generated link returns an HTML web page rather than pure binary media bytes. Chrome blocks responses with MIME type <code className="text-blue-300 font-mono">text/html</code> inside media tags.
          </p>

          <h2 className="text-xl font-bold text-white pt-4 border-t border-gray-800">Resolution Pipeline Engine</h2>
          <CodeBlock
            code={`import { DriveImage, DriveVideo } from '@driveloader/react';

export function MediaShowcase() {
  return (
    <>
      <DriveImage src="https://drive.google.com/file/d/IMAGE_ID/view" alt="Gallery Photo" />
      <DriveVideo src="https://drive.google.com/file/d/VIDEO_ID/view" controls />
    </>
  );
}`}
            language="tsx"
            filename="App.tsx"
          />
        </div>
      </div>
    </div>
  );
}
