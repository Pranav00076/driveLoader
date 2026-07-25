"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Package,
  Check,
  Copy,
  Terminal,
  Zap,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Database,
  Folder,
  Video,
  Grid,
  Layers,
  Star,
  GitFork,
  Download,
  Users,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

import { CodeBlock } from "@/components/CodeBlock";
import { WhyComparison } from "@/components/WhyComparison";
import { PipelineDiagram } from "@/components/PipelineDiagram";

export default function LandingPage() {
  const [installTab, setInstallTab] = useState<"npm" | "pnpm" | "bun" | "yarn">("npm");
  const [copiedInstall, setCopiedInstall] = useState(false);

  const installCommands = {
    npm: "npm install @driveloader/react",
    pnpm: "pnpm add @driveloader/react",
    bun: "bun add @driveloader/react",
    yarn: "yarn add @driveloader/react",
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(installCommands[installTab]);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const heroCode = `import {
  DriveImage,
  DriveVideo
} from "@driveloader/react";

export function App() {
  return (
    <>
      <DriveImage src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view" />

      <DriveVideo
        src="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?type=video"
        controls
        preload="metadata"
      />
    </>
  );
}`;

  const featureCards = [
    {
      title: "Smart URL Resolution",
      description: "Parses drive.google.com/file/d/, open?id=, uc?id=, docs, lh3, and raw 28+ char file IDs instantly.",
      icon: Zap,
      gradient: "from-blue-500/20 to-indigo-500/20",
      border: "border-blue-500/30",
    },
    {
      title: "Google Drive Video Support",
      description: "Stream videos with poster thumbnails, HTML5 controls, and metadata extraction (duration, width, height).",
      icon: Video,
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
    },
    {
      title: "Public Folder Loading",
      description: "Load all media assets from public Google Drive folders using API v3 with pagination and extension filters.",
      icon: Folder,
      gradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/30",
    },
    {
      title: "Mixed Media Galleries",
      description: "<DriveGallery /> automatically inspects assets and renders images and videos side-by-side seamlessly.",
      icon: Grid,
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
    },
    {
      title: "Endpoint Learning",
      description: "Remembers working CDN endpoints per file ID and prioritizes them in future resolutions.",
      icon: Cpu,
      gradient: "from-indigo-500/20 to-blue-500/20",
      border: "border-indigo-500/30",
    },
    {
      title: "Request Coalescing",
      description: "Deduplicates concurrent in-flight requests for identical file IDs to eliminate redundant network traffic.",
      icon: RefreshCw,
      gradient: "from-rose-500/20 to-red-500/20",
      border: "border-rose-500/30",
    },
    {
      title: "In-Memory Caching",
      description: "LRU capacity eviction and TTL expiration with real-time performance metrics (getCacheStats()).",
      icon: Database,
      gradient: "from-amber-500/20 to-yellow-500/20",
      border: "border-amber-500/30",
    },
    {
      title: "Stateful Custom Hooks",
      description: "React hooks (useDriveImage, useDriveVideo, useDriveFolder) for total programmatic state control.",
      icon: Layers,
      gradient: "from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/30",
    },
    {
      title: "100% TypeScript & Zero-Deps",
      description: "Fully typed API contracts, actionable error hierarchy, ultra-lightweight and tree-shakeable.",
      icon: ShieldCheck,
      gradient: "from-blue-500/20 to-indigo-500/20",
      border: "border-blue-500/30",
    },
  ];

  return (
    <div className="relative overflow-hidden space-y-24 pb-20">
      {/* Background Animated Glow Mesh */}
      <div className="hero-glow" />

      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Version Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 fill-blue-400/30" />
            <span>DriveLoader v1.2.0 Released</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">Google Drive Video & Mixed Galleries</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turn Google Drive into your <br />
            <span className="text-gradient">React Media CDN.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-normal">
            The complete React library for loading, streaming, caching, and resolving Google Drive hosted images, videos, and public folders.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/docs"
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/Pranav00076/driveLoader"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl font-semibold text-gray-200 bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 transition-all flex items-center gap-2.5 cursor-pointer shadow-sm"
            >
              <GithubIcon className="w-4 h-4 text-gray-300" />

              <span>GitHub</span>
            </a>
            <a
              href="https://www.npmjs.com/package/@driveloader/react"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl font-semibold text-gray-200 bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 transition-all flex items-center gap-2.5 cursor-pointer shadow-sm"
            >
              <Package className="w-4 h-4 text-red-400" />
              <span>NPM</span>
            </a>
          </div>

          {/* Hero Code Example Box */}
          <div className="pt-8 max-w-3xl mx-auto text-left">
            <CodeBlock code={heroCode} language="tsx" filename="App.tsx" />
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Why Standard Drive Links Fail
          </h2>
          <p className="text-gray-400 text-base">
            Understand the CORS and HTML wrapper restrictions of Google Drive URLs, and see how DriveLoader fixes them seamlessly.
          </p>
        </div>
        <WhyComparison />
      </section>

      {/* HOW IT WORKS PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Resolution Pipeline Architecture
          </h2>
          <p className="text-gray-400 text-base">
            Click through the 6-stage resolution pipeline engine powering DriveLoader's instant CDN delivery.
          </p>
        </div>
        <PipelineDiagram />
      </section>

      {/* FEATURE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Built for Production React Apps
          </h2>
          <p className="text-gray-400 text-base">
            Everything you need to deliver high-performance Google Drive media CDN features out of the box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`glass-card p-6 rounded-2xl border ${feat.border} space-y-3 relative overflow-hidden group`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} border border-gray-700/50 flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{feat.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* INSTALLATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 lg:p-12 rounded-3xl border border-gray-800 max-w-4xl mx-auto space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Get Started in Seconds</h2>
            <p className="text-gray-400 text-sm">Install via your favorite package manager and start loading Google Drive media immediately.</p>
          </div>

          {/* Package Manager Tabs */}
          <div className="flex justify-center gap-2 p-1 bg-gray-900/90 rounded-xl border border-gray-800 max-w-xs mx-auto">
            {(["npm", "pnpm", "bun", "yarn"] as const).map((mgr) => (
              <button
                key={mgr}
                onClick={() => setInstallTab(mgr)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  installTab === mgr ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                {mgr}
              </button>
            ))}
          </div>

          {/* Install Command Display Bar */}
          <div className="bg-[#070a12] border border-gray-800 rounded-2xl p-4 flex items-center justify-between font-mono text-sm text-blue-400 max-w-lg mx-auto shadow-inner">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-500" />
              <span>{installCommands[installTab]}</span>
            </div>
            <button
              onClick={handleCopyInstall}
              className="p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors cursor-pointer"
              title="Copy to clipboard"
            >
              {copiedInstall ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* OPEN SOURCE COMMUNITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 rounded-3xl border border-gray-800 text-center space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Open Source & Developer First</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800">
              <Star className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white">100%</div>
              <div className="text-xs text-gray-400 font-medium">Open Source MIT</div>
            </div>
            <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800">
              <Download className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white">Zero</div>
              <div className="text-xs text-gray-400 font-medium">Runtime Dependencies</div>
            </div>
            <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800">
              <GitFork className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white">TypeScript</div>
              <div className="text-xs text-gray-400 font-medium">100% Type-Safe</div>
            </div>
            <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800">
              <Users className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-white">v1.2.0</div>
              <div className="text-xs text-gray-400 font-medium">Latest Release</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
