import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  async rewrites() {
    const gateway = (
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"
    ).replace(/\/$/, "");

    return [
      {
        source: "/api/v1/:path*",
        destination: `${gateway}/api/v1/:path*`
      }
    ];
  }
};

export default nextConfig;
