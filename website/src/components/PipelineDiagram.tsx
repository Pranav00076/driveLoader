"use client";

import React, { useState } from "react";
import { Link2, Search, Cpu, RefreshCw, Database, Layers, CheckCircle2, ArrowRight } from "lucide-react";

export function PipelineDiagram() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: "input",
      title: "1. Google Drive Link",
      subtitle: "Raw URL or File ID",
      icon: Link2,
      color: "from-blue-500 to-indigo-500",
      description:
        "Accepts any link format: drive.google.com/file/d/{ID}/view, open?id={ID}, uc?id={ID}, docs.google.com, lh3.googleusercontent.com, or raw 28+ char File IDs.",
      codeSnippet: `const input = "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view";`,
    },
    {
      id: "parser",
      title: "2. Extract File ID",
      subtitle: "Pattern Matching & Detection",
      icon: Search,
      color: "from-indigo-500 to-purple-500",
      description:
        "Regex engines extract the exact base64url File ID and auto-detect whether the asset is an image or video format variant.",
      codeSnippet: `const fileId = extractFileId(input); // => "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"
const isVideo = isDriveVideo(input); // => false`,
    },
    {
      id: "resolver",
      title: "3. Resolve Endpoint",
      subtitle: "Endpoint Learning Prioritization",
      icon: Cpu,
      color: "from-purple-500 to-pink-500",
      description:
        "Generates candidate CDN URLs (lh3, uc?export=view, drive.thumbnail, docs.uc) and prioritizes endpoints with proven historical success.",
      codeSnippet: `const candidates = generateCandidateUrls(fileId);
// Prioritizes candidate endpoint learned from past resolutions`,
    },
    {
      id: "retry",
      title: "4. Automatic Retry",
      subtitle: "Request Deduplication",
      icon: RefreshCw,
      color: "from-pink-500 to-rose-500",
      description:
        "Probes candidate endpoints with timeout controls. Coalesces concurrent in-flight requests for identical file IDs to eliminate redundant network traffic.",
      codeSnippet: `// Concurrent calls coalesce into single active fetch promise
// Automatic failover if primary candidate endpoint times out`,
    },
    {
      id: "cache",
      title: "5. Memory Cache",
      subtitle: "LRU & TTL In-Memory Cache",
      icon: Database,
      color: "from-rose-500 to-amber-500",
      description:
        "Successful CDN streams and metadata are cached in high-performance memory cache with configurable TTL (default 1 hr) and LRU capacity eviction.",
      codeSnippet: `defaultCache.set(fileId, { imageUrl, metadata }, cacheTTL);`,
    },
    {
      id: "component",
      title: "6. React Component",
      subtitle: "Direct Binary CDN Stream",
      icon: Layers,
      color: "from-emerald-500 to-teal-500",
      description:
        "Renders direct HTML5 <img> or <video> stream with skeleton placeholders, fade-in animations, fallback UI, and IntersectionObserver lazy loading.",
      codeSnippet: `<DriveImage src={input} alt="Resolved Media" fade={true} />`,
    },
  ];

  return (
    <div className="w-full my-8">
      {/* Interactive Step Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? "bg-gray-800/90 border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]"
                  : "bg-gray-900/60 border-gray-800/80 hover:bg-gray-800/40 hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br ${step.color} p-0.5 flex items-center justify-center`}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-gray-200 truncate">{step.title}</div>
              <div className="text-[9px] sm:text-[10px] text-gray-400 truncate">{step.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Step Inspector Panel */}
      <div className="glass-card rounded-2xl p-6 border border-gray-800 bg-[#0d1322]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center shadow-lg`}
            >
              {React.createElement(steps[activeStep].icon, { className: "w-5 h-5 text-white" })}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{steps[activeStep].title}</h3>
              <p className="text-xs text-blue-400 font-medium">{steps[activeStep].subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Step {activeStep + 1} of {steps.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              {steps[activeStep].description}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-gray-400">
              {activeStep > 0 && (
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white cursor-pointer"
                >
                  ← Previous Step
                </button>
              )}
              {activeStep < steps.length - 1 && (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#070a12] border border-gray-800/80 rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">
              Pipeline Execution Trace
            </div>
            <pre className="text-blue-300 whitespace-pre">{steps[activeStep].codeSnippet}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
