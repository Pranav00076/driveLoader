import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "../dist-docs",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

