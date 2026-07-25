"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Command,
  Package,
  Menu,
  X,
  BookOpen,
  Play,
  Grid,
  Layers,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Docs", href: "/docs", icon: BookOpen },
    { name: "Playground", href: "/playground", icon: Play },
    { name: "Examples", href: "/examples", icon: Grid },
    { name: "API Reference", href: "/api-reference", icon: Layers },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#090d16]/85 backdrop-blur-xl border-b border-gray-800/80 shadow-lg shadow-black/30"
          : "bg-[#090d16]/40 backdrop-blur-md border-b border-gray-800/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src="/LogoDL.png"
            alt="DriveLoader Logo"
            className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
              DriveLoader
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v1.2.0
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* Command Palette Search Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 bg-gray-900/90 border border-gray-800 rounded-xl hover:border-gray-700 hover:text-gray-200 transition-colors shadow-inner cursor-pointer"
          >
            <Command className="w-3.5 h-3.5 text-gray-400" />
            <span>Search docs...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 text-gray-400 rounded border border-gray-700">
              ⌘K
            </kbd>
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Pranav00076/driveLoader"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-white bg-gray-900/60 hover:bg-gray-800 rounded-xl border border-gray-800/80 transition-all"
            title="GitHub Repository"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* NPM Package */}
          <a
            href="https://www.npmjs.com/package/@driveloader/react"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-red-400 bg-gray-900/60 hover:bg-gray-800 rounded-xl border border-gray-800/80 transition-all"
            title="NPM Package"
          >
            <Package className="w-4 h-4" />
          </a>

          {/* Get Started CTA */}
          <Link
            href="/docs"
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-blue-500/40 transition-all active:scale-95 whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className="p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-xl"
          >
            <Command className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090d16]/95 border-b border-gray-800 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60"
              >
                <Icon className="w-4 h-4 text-blue-400" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-gray-800 flex gap-2">
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/Pranav00076/driveLoader"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-300 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
