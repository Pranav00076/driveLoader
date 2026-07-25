"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, Play, Grid, Layers, FileText, History, ArrowRight } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const searchItems = [
    { title: "Documentation Overview", category: "Docs", href: "/docs", icon: BookOpen, keywords: "guide introduction quickstart" },
    { title: "Installation & Setup", category: "Docs", href: "/docs/installation", icon: BookOpen, keywords: "npm pnpm yarn bun setup install" },
    { title: "<DriveImage /> Component", category: "Components", href: "/docs/drive-image", icon: BookOpen, keywords: "image photo skeleton fallback lazy" },
    { title: "<DriveVideo /> Component", category: "Components", href: "/docs/drive-video", icon: BookOpen, keywords: "video stream player poster metadata controls" },
    { title: "<DriveGallery /> Component", category: "Components", href: "/docs/drive-gallery", icon: BookOpen, keywords: "gallery grid folder mixed media" },
    { title: "Public Folder Loading", category: "Docs", href: "/docs/folder-support", icon: BookOpen, keywords: "useDriveFolder loadFolderAssets api key" },
    { title: "useDriveImage Hook", category: "Hooks", href: "/docs/hooks#useDriveImage", icon: BookOpen, keywords: "hook resolve image state" },
    { title: "useDriveVideo Hook", category: "Hooks", href: "/docs/hooks#useDriveVideo", icon: BookOpen, keywords: "hook resolve video state metadata" },
    { title: "Single Image Playground", category: "Playground", href: "/playground", icon: Play, keywords: "interactive demo sandbox test url" },
    { title: "Video Player Playground", category: "Playground", href: "/playground?tab=video", icon: Play, keywords: "video demo stream test poster" },
    { title: "Folder Loader Playground", category: "Playground", href: "/playground?tab=folder", icon: Play, keywords: "folder demo assets list grid" },
    { title: "Resolver Diagnostics Playground", category: "Playground", href: "/playground?tab=resolver", icon: Play, keywords: "diagnostics candidates endpoints analysis" },
    { title: "Examples Gallery Recipes", category: "Examples", href: "/examples", icon: Grid, keywords: "code recipes snippets gallery" },
    { title: "Complete API Reference", category: "API Reference", href: "/api-reference", icon: Layers, keywords: "types options exports functions errors" },
    { title: "DriveLoader Blog", category: "Blog", href: "/blog", icon: FileText, keywords: "articles news tutorial architecture" },
    { title: "Changelog & Version Timeline", category: "Changelog", href: "/changelog", icon: History, keywords: "v1.2.0 v1.1.0 release notes updates" },
  ];

  const filtered = query.trim() === ""
    ? searchItems
    : searchItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent state or keyboard event
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0e1424] border border-gray-800 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search documentation..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No matching commands or pages found for "{query}"
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSelect(item.href)}
                  className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between hover:bg-gray-800/70 text-left group transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-200 group-hover:text-white block">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-blue-400 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="p-3 border-t border-gray-800 bg-[#0a0e1a] text-xs text-gray-500 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span>Use <kbd className="px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded border border-gray-700">↑</kbd> <kbd className="px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded border border-gray-700">↓</kbd> to navigate</span>
          </div>
          <div>Press <kbd className="px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded border border-gray-700">ESC</kbd> to exit</div>
        </div>
      </div>
    </div>
  );
}
