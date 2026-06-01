import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://api.tracknit.com/wp-json/tracknit/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
