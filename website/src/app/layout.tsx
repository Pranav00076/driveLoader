"use client";

import React, { useState } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <title>DriveLoader — The Complete Google Drive Media CDN for React</title>
        <meta
          name="description"
          content="Official home of @driveloader/react. Effortlessly load, stream, cache, and resolve Google Drive hosted images, videos, and public folders in React."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/LogoDL.png" />
        <link rel="apple-touch-icon" href="/LogoDL.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090d16] text-gray-100 antialiased selection:bg-blue-500/30 selection:text-blue-200">
        <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
