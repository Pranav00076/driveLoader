"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Zap, Image, Video, Folder, Layers, Cpu, Database, RefreshCw, Sparkles, HelpCircle } from "lucide-react";

export function DocsSidebar() {
  const pathname = usePathname();

  const sections = [
    {
      title: "Getting Started",
      items: [
        { name: "Introduction", href: "/docs", slug: "introduction" },
        { name: "Installation", href: "/docs/installation", slug: "installation" },
        { name: "Quick Start", href: "/docs/quick-start", slug: "quick-start" },
      ],
    },
    {
      title: "Core Components",
      items: [
        { name: "<DriveImage />", href: "/docs/drive-image", slug: "drive-image" },
        { name: "<DriveVideo />", href: "/docs/drive-video", slug: "drive-video" },
        { name: "<DriveGallery />", href: "/docs/drive-gallery", slug: "drive-gallery" },
      ],
    },
    {
      title: "Features & API",
      items: [
        { name: "Public Folder Support", href: "/docs/folder-support", slug: "folder-support" },
        { name: "Custom React Hooks", href: "/docs/hooks", slug: "hooks" },
        { name: "Core Utilities", href: "/docs/utilities", slug: "utilities" },
        { name: "Caching & Memory", href: "/docs/caching", slug: "caching" },
        { name: "Retry & Failover Engine", href: "/docs/retry-logic", slug: "retry-logic" },
        { name: "Performance Optimization", href: "/docs/performance", slug: "performance" },
      ],
    },
    {
      title: "Resources",
      items: [
        { name: "Migration Guide (v1.2.0)", href: "/docs/migration-guide", slug: "migration-guide" },
        { name: "FAQ & Troubleshooting", href: "/docs/faq", slug: "faq" },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block pr-6 space-y-6">
      <div className="sticky top-20 space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
              {sec.title}
            </h4>
            <ul className="space-y-1">
              {sec.items.map((item) => {
                const isActive = pathname === item.href || (item.slug === "introduction" && pathname === "/docs");
                return (
                  <li key={item.slug}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20 shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
