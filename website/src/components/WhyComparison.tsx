"use client";

import React, { useState } from "react";
import { XCircle, CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Sparkles, ArrowRight } from "lucide-react";

export function WhyComparison() {
  const [activeTab, setActiveTab] = useState<"problem" | "solution">("problem");

  return (
    <div className="w-full my-8">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gray-900/90 p-1 rounded-xl border border-gray-800 flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab("problem")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "problem"
                ? "bg-red-500/10 text-red-400 border border-red-500/20 shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <XCircle className="w-4 h-4 text-red-400" />
            Standard Google Drive Links Fail
          </button>
          <button
            onClick={() => setActiveTab("solution")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "solution"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            DriveLoader Fixes Them Automatically
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Standard Link Failure */}
        <div
          className={`glass-card rounded-2xl p-6 border transition-all ${
            activeTab === "problem"
              ? "border-red-500/40 bg-[#160c0f]/80 ring-1 ring-red-500/20"
              : "border-gray-800 bg-[#0f1422]/50 opacity-75"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Standard &lt;img /&gt; or &lt;video /&gt; Tag</h3>
              <p className="text-xs text-red-400 font-mono">drive.google.com/file/d/.../view</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/50 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong>HTML Viewing Page Wrapper:</strong> Drive share links return an HTML web page rather than pure binary media bytes.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/50 flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong>CORB / Cross-Origin Blocking:</strong> Chrome blocks responses with MIME type <code className="text-red-300 font-mono">text/html</code> inside media tags.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/50 flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong>Broken UI & Broken Video Players:</strong> Renders missing image icons or media playback errors across browsers.
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-black/50 rounded-xl border border-red-900/30 text-[11px] font-mono text-red-400 overflow-x-auto">
            <code>GET https://drive.google.com/file/d/ID/view -&gt; 200 OK (text/html) [CORB Blocked]</code>
          </div>
        </div>

        {/* Card 2: DriveLoader Solution */}
        <div
          className={`glass-card rounded-2xl p-6 border transition-all ${
            activeTab === "solution"
              ? "border-emerald-500/40 bg-[#0a1815]/80 ring-1 ring-emerald-500/20"
              : "border-gray-800 bg-[#0f1422]/50 opacity-75"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">DriveLoader (&lt;DriveImage /&gt; & &lt;DriveVideo /&gt;)</h3>
              <p className="text-xs text-emerald-400 font-mono">lh3.googleusercontent.com/d/...</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Direct CDN Binary Stream:</strong> Resolves file IDs into working Google Drive CDN endpoints (<code className="text-emerald-300 font-mono">image/*</code> & <code className="text-emerald-300 font-mono">video/*</code>).
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Endpoint Learning & Retry:</strong> Prioritizes fastest working candidate endpoints and caches CDN urls in memory.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Skeletons, Fade & Lazy Loading:</strong> Built-in skeleton placeholders, smooth opacity transitions, and IntersectionObserver.
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-black/50 rounded-xl border border-emerald-900/30 text-[11px] font-mono text-emerald-400 overflow-x-auto">
            <code>GET https://lh3.googleusercontent.com/d/ID -&gt; 200 OK (image/jpeg) [CDN Streamed]</code>
          </div>
        </div>
      </div>
    </div>
  );
}
