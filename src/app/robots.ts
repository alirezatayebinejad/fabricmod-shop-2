import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/dashboard", "/panel/"],
    },
    sitemap: process.env.NEXT_PUBLIC_BASE_PATH + "/sitemap.xml",
  };
}
