import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sa3wnq5xvsvtmuox.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
