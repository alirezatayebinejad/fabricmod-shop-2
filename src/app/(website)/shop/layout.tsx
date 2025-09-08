import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "فروشگاه فابریک‌ مد";
  const description =
    "لیست کامل محصولات فروشگاه فابریک‌ مد با امکان فیلتر، جستجو و خرید آنلاین روسری، کفش، کیف و لباس زنانه";
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_PATH}/shop`;

  return {
    title,
    description,
    keywords: [
      "فروشگاه",
      "فابریک‌ مد",
      "روسری",
      "کفش زنانه",
      "کیف زنانه",
      "لباس زنانه",
      "خرید روسری",
      "خرید کفش زنانه",
      "خرید کیف زنانه",
      "خرید لباس زنانه",
      "قیمت روسری",
      "قیمت کفش زنانه",
      "قیمت کیف زنانه",
      "قیمت لباس زنانه",
      "فروش اینترنتی روسری",
      "فروش اینترنتی کفش زنانه",
      "فروش اینترنتی کیف زنانه",
      "فروش اینترنتی لباس زنانه",
      "فروشگاه آنلاین روسری",
      "فروشگاه آنلاین کفش زنانه",
      "فروشگاه آنلاین کیف زنانه",
      "فروشگاه آنلاین لباس زنانه",
      "خرید آنلاین روسری",
      "خرید آنلاین کفش زنانه",
      "خرید آنلاین کیف زنانه",
      "خرید آنلاین لباس زنانه",
      "ارسال رایگان",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      url: canonicalUrl,
      siteName: "فابریک‌ مد",
      title,
      description,
      images: [
        {
          url: process.env.NEXT_PUBLIC_IMG_BASE + "/brand/Logo.png",
          width: 1200,
          height: 630,
          alt: "فروشگاه فابریک‌ مد",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "فروشگاه | فابریک‌ مد",
      description:
        "لیست کامل محصولات فروشگاه فابریک‌ مد با امکان فیلتر، جستجو و خرید آنلاین روسری، کفش، کیف و لباس زنانه.",
      images: [process.env.NEXT_PUBLIC_IMG_BASE + "/brand/Logo.png"],
    },
  };
}

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
