import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "fabric.web-developers.shop",
      },
      {
        protocol: "http",
        hostname: "87.248.156.50",
        port:8000
      },
      {
        protocol: "https",
        hostname: "trustseal.enamad.ir",
      },
      {
        protocol: "http",
        hostname: "87.248.156.50",
        port: "8000",
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
