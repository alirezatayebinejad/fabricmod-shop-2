import { GlobalDataType } from "@/contexts/GlobalData";
import {
  Initials,
  PostShowSite,
  ProductIndexSite,
  ProductShowSite,
} from "@/types/apiTypes";
import {
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  ItemList,
  Product,
  WebPage,
  WithContext,
} from "schema-dts";

// Homepage JSON-LD (already in function form)
export const homepageJsonLd = (
  initialsRes: Initials,
): WithContext<WebPage> => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name:
    initialsRes?.setting?.title || "آسان باتری - فروشگاه آنلاین باتری خودرو",
  description: initialsRes?.setting?.description || "خرید انواع باتری خودرو...",
  url: "https://asanbatri.com/",
});

// Blog post JSON-LD
export const blogPostJsonLd = (
  data: PostShowSite,
): WithContext<BlogPosting> => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: data?.seo_title || data?.title,
  description: data?.seo_description || data?.description,
  image: data?.primary_image
    ? [process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image]
    : undefined,
  author: {
    "@type": "Organization",
    name: "آسان باتری",
  },
  publisher: {
    "@type": "Organization",
    name: "آسان باتری",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${process.env.NEXT_PUBLIC_BASE_PATH}/blog/${data?.slug}`,
  },
  datePublished: data?.created_at,
  dateModified: data?.updated_at,
  url: `${process.env.NEXT_PUBLIC_BASE_PATH}/blog/${data?.slug}`,
  keywords: data?.tags?.map((tag: any) => tag.name).join(", "),
  commentCount: data?.comments_count,
  aggregateRating:
    data?.rate > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: data?.rate,
          bestRating: 5,
          worstRating: 1,
          ratingCount: 1,
        }
      : undefined,
});

// Blog FAQ JSON-LD (inline, returns null if no faqs)
export const blogFaqJsonLd = (data: PostShowSite) =>
  data?.faqs && data.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faqs.map((faq: any) => ({
          "@type": "Question",
          name: faq.subject,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.body,
          },
        })),
      }
    : null;

// Blog post breadcrumb JSON-LD
export const postBreadcrumbJsonLd = (
  data: PostShowSite,
): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "خانه",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "بلاگ",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/blog`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: data?.title,
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/blog/${data?.slug}`,
    },
  ],
});

// Related posts JSON-LD (inline, returns null if none)
export const relatedPostsJsonLd = (
  data: PostShowSite,
): WithContext<ItemList> | null => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: data.related_posts.map((post: any, index: number) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "BlogPosting",
      headline: post.title,
      url: `${process.env.NEXT_PUBLIC_BASE_PATH}/blog/${post.slug}`,
    },
  })),
});

// FAQ JSON-LD (for general FAQ pages)
export const faqJsonLd = (
  faqs?: GlobalDataType["initials"]["setting"]["faqs"],
): WithContext<FAQPage> => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs?.map((faq: any) => ({
    "@type": "Question",
    name: faq.subject,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.body,
    },
  })),
});

// Products list JSON-LD
export const productsJsonLd = (
  products: ProductIndexSite,
): WithContext<ItemList> => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "محصولات فروشگاه آسان باتری",
  description: "تمام محصولات موجود در فروشگاه آسان باتری",
  itemListElement: products?.products?.map((p: any, index: number) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/product/${p.slug}`,
    name: p.name,
    image: [
      p.primary_image
        ? process.env.NEXT_PUBLIC_IMG_BASE + p.primary_image
        : "/images/imageplaceholder.png",
    ],
    // description: p.description || "",
    offers: {
      "@type": "Offer",
      price: p.sale_check ? p.sale_price : p.price,
      priceCurrency: "IRT",
      availability:
        parseInt(p.quantity || "0") > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  })),
});

// Shop breadcrumb JSON-LD
export const shopBreadcrumbJsonLd = (): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "خانه",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "فروشگاه",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop`,
    },
  ],
});

// Product JSON-LD
export const productJsonLd = (data: ProductShowSite): WithContext<Product> => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: data?.name,
  image: data?.images?.map(
    (img: any) => process.env.NEXT_PUBLIC_IMG_BASE + img.image,
  ),
  description: data?.seo_description || data?.description,
  sku:
    (data?.price_check &&
      typeof data.price_check === "object" &&
      data?.price_check?.sku) ||
    "",
  brand: {
    "@type": "Brand",
    name: data?.brand?.name || "No Brand",
  },
  category: data?.category?.name,
  offers: {
    "@type": "Offer",
    priceCurrency: "Toman",
    price:
      data?.price_check && typeof data.price_check === "object"
        ? data.price_check.sale_price || data.price_check.price
        : undefined,
    availability: "https://schema.org/InStock",
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/product/${data?.slug}`,
  },
  aggregateRating: data?.rate
    ? {
        "@type": "AggregateRating",
        ratingValue: data?.rate?.toFixed(1),
      }
    : undefined,
});
