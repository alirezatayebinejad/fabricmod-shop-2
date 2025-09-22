import { GlobalDataType } from "@/contexts/GlobalData";
import {
  Initials,
  PageShowSite,
  PostShowSite,
  ProductCategoryShowSite,
  ProductIndexSite,
  ProductShowSite,
  PostsIndexSite,
} from "@/types/apiTypes";
import {
  Blog,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  ItemList,
  Organization,
  Product,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts";

// Price helpers
const toRial = (val?: any) => Number(val || 0) * 10;
// default priceValidUntil -> end of next year (YYYY-MM-DD)
const defaultPriceValidUntil = () =>
  new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    .toISOString()
    .split("T")[0];

// Homepage JSON-LD (already in function form)
export const homepageJsonLd = (
  initialsRes: Initials,
): WithContext<WebPage | WebSite | Organization> => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name:
    initialsRes?.setting?.title ||
    "فابریک مد - فروشگاه آنلاین کیف و کفش و روسری",
  description:
    initialsRes?.setting?.description || "خرید انواع کیف و کفش و روسری...",
  url: process.env.NEXT_PUBLIC_BASE_PATH || "",
  isPartOf: {
    "@type": "WebSite",
    name: initialsRes?.setting?.title || "فابریک مد",
    url: process.env.NEXT_PUBLIC_BASE_PATH || "",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop?search={search_term_string}`,
      ...({
        "query-input": "required name=search_term_string",
      } as any),
    },
  },
  about: {
    "@type": "Organization",
    name: initialsRes?.setting?.title || "فابریک مد",
    url: process.env.NEXT_PUBLIC_BASE_PATH || "",
    logo:
      (initialsRes?.setting?.logo &&
        `${process.env.NEXT_PUBLIC_IMG_BASE}${initialsRes.setting.logo}`) ||
      undefined,
    sameAs: (initialsRes?.setting?.socials || [])
      .map((s) => s.value)
      .filter(Boolean),
    contactPoint: (initialsRes?.setting?.telephones || []).map((tel) => ({
      "@type": "ContactPoint",
      telephone: tel.value,
      contactType: "customer service",
      areaServed: "IR",
      availableLanguage: ["Persian"],
      name: tel.name,
    })),
  },
});

// Homepage FAQ JSON-LD
export const homeFaqJsonLd = (data: Initials) =>
  data?.setting?.faqs && data.setting?.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.setting?.faqs.map((faq: any) => ({
          "@type": "Question",
          name: faq.subject,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.body,
          },
        })),
      }
    : null;

// Blog breadcrumb
export const blogBreadcrumbJsonLd = (): WithContext<BreadcrumbList> => ({
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
      name: "وبلاگ",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/blog`,
    },
  ],
});

// Blog page JSON-LD
export const blogPageJsonLd = (
  posts: PostsIndexSite | null,
): WithContext<Blog> => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "وبلاگ",
  description: "مقالات و مطالب آموزشی",
  url: `${process.env.NEXT_PUBLIC_BASE_PATH}/blog`,
  publisher: {
    "@type": "Organization",
    name: "فابریک مد",
  },
  blogPost:
    posts?.posts?.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `${process.env.NEXT_PUBLIC_BASE_PATH}/blog/post/${p.slug}`,
      dateModified: p.updated_at,
      author: {
        "@type": "Organization",
        name: "فابریک مد",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_BASE_PATH}/blog/post/${p.slug}`,
      },
    })) || [],
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
    name: "فابریک مد",
  },
  publisher: {
    "@type": "Organization",
    name: "فابریک مد",
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
          ratingCount: Number(data?.rate) || 1,
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
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/blog/post/${data?.slug}`,
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
      url: `${process.env.NEXT_PUBLIC_BASE_PATH}/blog/post/${post.slug}`,
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
  name: "محصولات فروشگاه فابریک مد",
  description: "تمام محصولات موجود در فروشگاه فابریک مد",
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
      price: toRial(p.sale_check ? p.sale_price : p.price),
      priceCurrency: "IRR",
      priceValidUntil: p?.date_sale_to || defaultPriceValidUntil(),
      availability:
        parseInt(p.quantity_check || "0") > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        name: "Return & Warranty Policy",
        url: `${process.env.NEXT_PUBLIC_BASE_PATH}/rules`,
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        applicableCountry: "IR",
        merchantReturnDays: 7,
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        returnMethod: "https://schema.org/ReturnInStore",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "IRR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "d",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IR",
        },
      },
    },
    aggregateRating:
      p?.rate > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number((p.rate || 0).toFixed(1)),
            bestRating: 5,
            worstRating: 1,
            ratingCount: Number(p?.views_count?.toFixed?.(1)) || 1,
          }
        : undefined,
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
export const productJsonLd = (data: ProductShowSite): WithContext<Product> => {
  const images = [
    ...(data?.primary_image
      ? [process.env.NEXT_PUBLIC_IMG_BASE + data.primary_image]
      : []),
    ...(data?.images?.map(
      (img: any) => process.env.NEXT_PUBLIC_IMG_BASE + img.image,
    ) || []),
  ];

  const priceValue =
    data?.price_check && typeof data.price_check === "object"
      ? toRial(data.price_check.sale_price || data.variations[0].price)
      : undefined;

  const jsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/product/${data?.slug}`,
    name: data?.name,
    image: images,
    description: data?.seo_description || data?.description,
    sku:
      (data?.price_check &&
        typeof data.price_check === "object" &&
        data?.price_check?.sku) ||
      "",
    productID: (data?.id && data.id.toString()) || undefined,
    category: data?.category?.name,
    brand: {
      "@type": "Brand",
      name: data?.brand?.name || "No Brand",
      logo: data?.brand?.primary_image
        ? process.env.NEXT_PUBLIC_IMG_BASE + data.brand.primary_image
        : undefined,
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/product/${data?.slug}`,
      priceCurrency: "IRR",
      price: priceValue,
      priceValidUntil: (data as any)?.date_sale_to || defaultPriceValidUntil(),
      itemCondition: "https://schema.org/NewCondition",
      availability:
        data?.quantity_check
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        name: "Return & Warranty Policy",
        url: `${process.env.NEXT_PUBLIC_BASE_PATH}/rules`,
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        applicableCountry: "IR",
        merchantReturnDays: 7,
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        returnMethod: "https://schema.org/ReturnInStore",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "IRR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "d",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IR",
        },
      },
    },
  };

  if (data?.rate && Number(data.rate) > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(data.rate.toFixed(1)),
      bestRating: 5,
      worstRating: 1,
      ratingCount: Number((data as any)?.views_count) || 1,
    } as any;
  }

  return jsonLd;
};

// Shop page JSON-LD (Collection overview)
export const shopPageJsonLd = (
  products: ProductIndexSite | null,
): WithContext<WebPage> => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "فروشگاه فابریک مد",
  description:
    "لیست کامل محصولات فروشگاه فابریک مد با امکان فیلتر، جستجو و مرتب‌سازی",
  url: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop`,
  mainEntity: products
    ? {
        "@type": "ItemList",
        itemListElement:
          products.products?.map((p: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/product/${p.slug}`,
            name: p.name,
          })) || [],
      }
    : undefined,
});

// product faqs JSON-LD
export const productFaqJsonLd = (data: ProductShowSite) =>
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
// Product breadcrumb JSON-LD
export const productBreadcrumbJsonLd = (
  data: ProductShowSite,
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
      name: "فروشگاه",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop`,
    },
    // {
    //   "@type": "ListItem",
    //   position: 3,
    //   name: data?.category?.name,
    //   item: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/category/${data?.slug}`,
    // },
    {
      "@type": "ListItem",
      position: 3,
      name: data?.name,
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/product/${data?.slug}`,
    },
  ],
});

// Category JSON-LD
export const categoryJsonLd = (
  data: ProductCategoryShowSite,
): WithContext<CollectionPage> => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: (data as any)?.seo_title || `خرید ${data?.name}`,
  description: (data as any)?.seo_description || `لیست محصولات ${data?.name}`,
  url: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/category/${data.slug}`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement:
      data?.data?.products?.map((p: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/product/${p.slug}`,
        name: p.name,
      })) || [],
  },
});

// Category Breadcrumb JSON-LD
export const categoryBreadcrumbJsonLd = (
  data: ProductCategoryShowSite,
): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "خانه",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "فروشگاه",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: data?.name,
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/category/${data.slug}`,
    },
  ],
});

// Category Products ItemList JSON-LD
export const categoryProductsJsonLd = (
  data: ProductCategoryShowSite,
): WithContext<ItemList> => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `لیست محصولات دسته ${data?.name}`,
  description: `محصولات مرتبط با دسته‌بندی ${data?.name}`,
  itemListElement:
    data?.data?.products?.map((p: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/product/${p.slug}`,
      name: p.name,
      image: [
        p.primary_image
          ? process.env.NEXT_PUBLIC_IMG_BASE + p.primary_image
          : "/images/imageplaceholder.png",
      ],
      offers: {
        "@type": "Offer",
        price: toRial(p.sale_check ? p.sale_price : p.price),
        priceCurrency: "IRR",
        priceValidUntil: (p as any)?.date_sale_to || defaultPriceValidUntil(),
        availability:
          Number((p as any).quantity_check) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          name: "Return & Warranty Policy",
          url: `${process.env.NEXT_PUBLIC_BASE_PATH}/rules`,
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          applicableCountry: "IR",
          merchantReturnDays: 7,
          returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
          returnMethod: "https://schema.org/ReturnInStore",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: 0,
            currency: "IRR",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 1,
              unitCode: "d",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 1,
              unitCode: "d",
            },
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "IR",
          },
        },
      },
    })) || [],
});

export const contactPageJsonLd = (
  data: PageShowSite,
  initials: Initials,
): WithContext<WebPage> => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: data?.seo_title || data?.title || "تماس با فابریک مد",
  description:
    data?.seo_description ||
    data?.description ||
    "برای ارتباط با تیم فابریک مد با ما در تماس باشید.",
  url: `${process.env.NEXT_PUBLIC_BASE_PATH}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: "فابریک مد",
    url: process.env.NEXT_PUBLIC_BASE_PATH,
    contactPoint: initials.setting.telephones.map((tel) => ({
      "@type": "ContactPoint",
      telephone: tel.value,
      contactType: "customer service",
      availableLanguage: ["Persian", "English"],
      name: tel.name,
    })),
  },
});

// Category FAQ JSON-LD
export const categoryFaqJsonLd = (data: ProductCategoryShowSite) =>
  data?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faqs.map((f: any) => ({
          "@type": "Question",
          name: f.subject,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.body,
          },
        })),
      }
    : null;

export const contactBreadcrumbJsonLd = (): WithContext<BreadcrumbList> => ({
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
      name: "تماس با ما",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/contact`,
    },
  ],
});

export const aboutPageJsonLd = (data: PageShowSite): WithContext<WebPage> => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: data?.seo_title || data?.title || "درباره فابریک مد",
  description:
    data?.seo_description ||
    data?.description ||
    "فابریک مد، فروشگاه آنلاین فروش روسری و کیف و کفش و لباس زنانه با خدمات سریع و مطمئن.",
  url: `${process.env.NEXT_PUBLIC_BASE_PATH}/about`,
  mainEntity: {
    "@type": "Organization",
    name: "فابریک مد",
    url: process.env.NEXT_PUBLIC_BASE_PATH,
    // logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/${Initials}`,
    sameAs: [
      "https://www.instagram.com/asanbatri",
      "https://www.linkedin.com/company/asanbatri",
    ],
  },
});

// About Breadcrumb JSON-LD
export const aboutBreadcrumbJsonLd = (): WithContext<BreadcrumbList> => ({
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
      name: "درباره ما",
      item: `${process.env.NEXT_PUBLIC_BASE_PATH}/about`,
    },
  ],
});
// Rules Page JSON-LD
export const rulesPageJsonLd = (data: PageShowSite): WithContext<WebPage> => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: data?.title || "قوانین و مقررات - فابریک مد",
  description:
    data?.seo_description ||
    data?.description ||
    "مطالعه قوانین و مقررات فابریک مد برای خرید و استفاده از خدمات سایت.",
  url: `${process.env.NEXT_PUBLIC_BASE_PATH}/rules`,
});
