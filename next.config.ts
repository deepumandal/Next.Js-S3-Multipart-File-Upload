import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
      allowedOrigins: ["*"],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
