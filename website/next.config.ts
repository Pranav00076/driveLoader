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
};

export default nextConfig;
