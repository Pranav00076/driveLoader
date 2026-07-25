import path from "path";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isProd
    ? {
        output: "export",
        distDir: "../dist-docs",
      }
    : {}),
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.29.171", "localhost", "127.0.0.1", "*.local"],
  webpack: (config) => {
    config.resolve.alias["@driveloader/react"] = path.resolve(__dirname, "../dist/index.js");
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@driveloader/react": "../dist/index.js",
    },
  },
};

export default nextConfig;
