"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PlaygroundApp } from "@/components/PlaygroundApp";

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") || "image";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>DriveLoader Interactive Playground</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl">
          Test live Google Drive images, videos, public folder loading, and candidate URL diagnostics in real-time.
        </p>
      </div>

      <PlaygroundApp initialTab={initialTab} />
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-gray-400">Loading Playground...</div>}>
      <PlaygroundContent />
    </Suspense>
  );
}
