import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "87.107.146.92",
        port: "8080",
      },
      {
        protocol: "http",
        hostname: "asanaz.web-developers.shop",
      },
      {
        protocol: "https",
        hostname: "app.asanaz.com",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
