"use client";

import React from "react";
import Link from "next/link";
import { FileText, Clock, User, ArrowRight, Sparkles } from "lucide-react";

export interface BlogPostItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
}

export const blogPosts: BlogPostItem[] = [
  {
    slug: "google-drive-media-cdn-react",
    title: "Building a Zero-Config Google Drive Media CDN in React",
    description: "Learn how DriveLoader bypasses CORS restrictions, translates viewing links into direct CDN binaries, and caches streaming endpoints in memory.",
    date: "July 26, 2026",
    readTime: "5 min read",
    author: "DriveLoader Core Team",
    category: "Architecture",
  },
  {
    slug: "solving-google-drive-cors-corb-restrictions",
    title: "Solving Google Drive CORS and CORB Restrictions for HTML5 Video & Images",
    description: "Deep dive into Cross-Origin Read Blocking (CORB), Referrer Policies, and how lh3/uc candidate endpoint probing guarantees reliable media streaming.",
    date: "July 24, 2026",
    readTime: "7 min read",
    author: "DriveLoader Core Team",
    category: "Security & Networking",
  },
  {
    slug: "request-coalescing-and-endpoint-learning",
    title: "How Request Coalescing and Endpoint Learning Accelerated 10,000+ Image Loads",
    description: "Discover how deduplicating in-flight resolution promises and prioritizing historical winning candidate endpoints reduced redundant network traffic by 80%.",
    date: "July 20, 2026",
    readTime: "6 min read",
    author: "DriveLoader Core Team",
    category: "Performance",
  },
];

export default function BlogHubPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-400" />
          <span>DriveLoader Developer Blog</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Technical insights, architectural deep dives, security patterns, and performance optimizations for Google Drive media in React.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between group hover:border-blue-500/40 transition-all cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 font-sans">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                {post.description}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-blue-400" />
                {post.author}
              </span>
              <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Article →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
