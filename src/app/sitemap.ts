import apiCRUD from "@/services/apiCRUD";
import { SitemapIndex } from "@/types/apiTypes";
import type { MetadataRoute } from "next";
//this file generates all the urls in one sitemap if the urls are more that 50,000 urls we should create multiple sitemap files somehow but for now this is enough  as we have products,posts,static pages less that 50,000
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapIndex: SitemapIndex = (
    await apiCRUD({
      urlSuffix: "next/sitemap",
      requiresToken: false,
    })
  ).data;

  const staticUrls = [
    {
      url: process.env.NEXT_PUBLIC_BASE_PATH!,
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_BASE_PATH! + "/shop",
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_BASE_PATH! + "/blog",
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_BASE_PATH! + "/contact",
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_BASE_PATH! + "/about",
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_BASE_PATH! + "/rules",
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_BASE_PATH! + "/faqs",
      lastModified: new Date(),
    },
  ];

  const productsUrls =
    sitemapIndex?.products?.map((p) => ({
      url: process.env.NEXT_PUBLIC_BASE_PATH + "/shop/product/" + p.slug,
      lastModified: new Date(),
    })) || [];
  const postsUrls =
    sitemapIndex?.posts?.map((p) => ({
      url: process.env.NEXT_PUBLIC_BASE_PATH + "/blog/post/" + p.slug,
      lastModified: new Date(),
    })) || [];

  const productsCategories: SitemapIndex["categories"] = [];
  const postsCategories: SitemapIndex["categories"] = [];
  sitemapIndex?.categories?.forEach((c) => {
    if (c.type === "product") productsCategories.push(c);
    else postsCategories.push(c);
  });

  const productsCategoriesUrls =
    productsCategories?.map((p) => ({
      url: process.env.NEXT_PUBLIC_BASE_PATH + "/shop/category/" + p.slug,
      lastModified: new Date(),
    })) || [];
  const postsCategoriesUrls =
    postsCategories?.map((p) => ({
      url: process.env.NEXT_PUBLIC_BASE_PATH + "/blog/category/" + p.slug,
      lastModified: new Date(),
    })) || [];

  const pagesUrls =
    sitemapIndex?.pages
      ?.filter(
        (p) =>
          p.mode !== "about-us" &&
          p.mode !== "regulations" &&
          p.mode !== "contact-us",
      )
      ?.map((p) => ({
        url: process.env.NEXT_PUBLIC_BASE_PATH + "/blog/post/" + p.slug,
        lastModified: new Date(),
      })) || [];

  return [
    ...staticUrls,
    ...pagesUrls,
    ...productsCategoriesUrls,
    ...postsCategoriesUrls,
    ...productsUrls,
    ...postsUrls,
  ];
}
