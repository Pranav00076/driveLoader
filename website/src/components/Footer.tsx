import React from "react";
import Link from "next/link";
import { Sparkles, Package, Heart } from "lucide-react";
import { GithubIcon } from "@/components/Icons";


export function Footer() {
  return (
    <footer className="bg-[#060911] border-t border-gray-800/80 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-[#090d16] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">DriveLoader</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The complete Google Drive Media CDN for React applications. Effortlessly load, stream, cache, and resolve hosted images, videos, and public folders.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/Pranav00076/driveLoader"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
                title="GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />

              </a>
              <a
                href="https://www.npmjs.com/package/@driveloader/react"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                title="NPM Package"
              >
                <Package className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Documentation</h4>
            <ul className="space-y-2.5">
              <li><Link href="/docs" className="hover:text-white transition-colors">Introduction</Link></li>
              <li><Link href="/docs/installation" className="hover:text-white transition-colors">Installation</Link></li>
              <li><Link href="/docs/drive-image" className="hover:text-white transition-colors">&lt;DriveImage /&gt;</Link></li>
              <li><Link href="/docs/drive-video" className="hover:text-white transition-colors">&lt;DriveVideo /&gt;</Link></li>
              <li><Link href="/docs/drive-gallery" className="hover:text-white transition-colors">&lt;DriveGallery /&gt;</Link></li>
              <li><Link href="/docs/folder-support" className="hover:text-white transition-colors">Public Folders</Link></li>
            </ul>
          </div>

          {/* Column 3: Features & Tools */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Tools & Hubs</h4>
            <ul className="space-y-2.5">
              <li><Link href="/playground" className="hover:text-white transition-colors">Interactive Playground</Link></li>
              <li><Link href="/examples" className="hover:text-white transition-colors">Examples Gallery</Link></li>
              <li><Link href="/api-reference" className="hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog Hub</Link></li>
              <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog (v1.2.0)</Link></li>
            </ul>
          </div>

          {/* Column 4: Project Info */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Open Source</h4>
            <ul className="space-y-2.5">
              <li><a href="https://github.com/Pranav00076/driveLoader/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MIT License</a></li>
              <li><a href="https://github.com/Pranav00076/driveLoader/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contributing</a></li>
              <li><a href="https://github.com/Pranav00076/driveLoader/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Issue Tracker</a></li>
              <li><a href="https://github.com/Pranav00076/driveLoader/releases" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Releases</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} DriveLoader Contributors. Released under the MIT License.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" /> for the React developer ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
