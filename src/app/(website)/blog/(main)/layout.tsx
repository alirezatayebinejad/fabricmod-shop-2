import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "وبلاگ فابریک‌ مد";
  const description =
    "لیست کامل مطالب وبلاگ فابریک‌ مد با امکان فیلتر و جستجو در زمینه مد، استایل و اخبار روز دنیای مد";
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_PATH}/blog`;

  return {
    title,
    description,
    keywords: [
      "وبلاگ",
      "فابریک‌ مد",
      "مد",
      "استایل",
      "راهنمای خرید لباس",
      "اخبار مد",
      "نکات استایلینگ",
      "لباس زنانه",
      "کیف زنانه",
      "کفش زنانه",
      "روسری",
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
          alt: "وبلاگ فابریک‌ مد",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "وبلاگ | فابریک‌ مد",
      description:
        "مطالب آموزشی و اخبار مرتبط با مد، استایل، راهنمای خرید و بررسی محصولات در وبلاگ فابریک‌ مد.",
      images: [process.env.NEXT_PUBLIC_IMG_BASE + "/brand/Logo.png"],
    },
  };
}

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
