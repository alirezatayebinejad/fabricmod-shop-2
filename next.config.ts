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
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "app.fabricmod.com",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "trustseal.enamad.ir",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
    async redirects() {
    return [
      {
        source: '/shop/product/:slug/:id',
        destination: '/shop/product/:slug',
        permanent: true, // 301 redirect for SEO
      },
    ];
  },
};

export default nextConfig;
