import BannerCard from "@/app/(website)/(home)/_components/BannerCard";
import CategoriesCarousel from "@/app/(website)/(home)/_components/CategoriesCarousel";
import Features from "@/app/(website)/(home)/_components/Features";
import NoticeBanner from "@/app/(website)/(home)/_components/NoticeBanner";
import Slider from "@/app/(website)/(home)/_components/Slider";
import BlogCard from "@/app/(website)/_components/cards/BlogCard";
import ProductCard from "@/app/(website)/_components/cards/ProductCard";
import Carousel from "@/components/datadisplay/Carousel";
import { serverCache } from "@/constants/cacheNames";
import { homeFaqJsonLd, homepageJsonLd } from "@/constants/jsonlds";
import apiCRUD from "@/services/apiCRUD";
import { Index, Initials } from "@/types/apiTypes";

import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const initialsRes = (await apiCRUD({
    urlSuffix: "next/initials",
    requiresToken: false,
    ...serverCache.initials,
  })) as Initials;

  return {
    title: initialsRes.setting.seo_title
      ? initialsRes.setting.seo_title
      : "فابریک مد | خرید اینترنتی روسری، کیف، کفش و لباس زنانه",
    description: initialsRes.setting.seo_description
      ? initialsRes.setting.seo_description
      : "خرید آنلاین انواع روسری، کیف، کفش و لباس زنانه در فابریک مد ✅ ارسال سریع، ضمانت اصالت کالا و بهترین قیمت بازار. همین حالا سفارش دهید.",
    keywords: [
      "فابریک مد",
      "خرید روسری",
      "خرید کیف زنانه",
      "خرید کفش زنانه",
      "خرید لباس زنانه",
      "فروشگاه آنلاین پوشاک زنانه",
      "مد زنانه",
    ],
    alternates: {
      canonical: process.env.NEXT_PUBLIC_BASE_PATH + "/",
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      url: process.env.NEXT_PUBLIC_BASE_PATH + "/",
      title: "فابریک مد | خرید اینترنتی روسری، کیف، کفش و لباس زنانه",
      description:
        "خرید آنلاین انواع روسری، کیف، کفش و لباس زنانه در فابریک مد ✅ ارسال سریع، ضمانت اصالت کالا و بهترین قیمت بازار.",
      siteName: "فابریک مد",
      images: [
        {
          url: process.env.NEXT_PUBLIC_IMG_BASE + initialsRes.setting.logo,
          width: 1200,
          height: 630,
          alt: initialsRes.setting.title
            ? initialsRes.setting.title
            : "فابریک مد - فروشگاه اینترنتی پوشاک زنانه",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@fabricmod",
      title: initialsRes.setting.title
        ? initialsRes.setting.title
        : "فابریک مد | خرید اینترنتی روسری، کیف، کفش و لباس زنانه",
      description: initialsRes.setting.description
        ? initialsRes.setting.description
        : "فروش اینترنتی انواع روسری، کیف، کفش و لباس زنانه با ارسال سریع و ضمانت اصالت کالا. فابریک مد انتخاب اول بانوان شیک‌پوش.",
      images: [process.env.NEXT_PUBLIC_IMG_BASE + initialsRes.setting.logo],
    },
  };
}

export default async function HomePage() {
  console.log("Rendering HomePage");
  return(
  <h1>
  hiiiii
  </h1>
  )
  const initialsRes = (await apiCRUD({
    urlSuffix: "next/initials",
    requiresToken: false,
    ...serverCache.initials,
  })) as Initials;
  const dataRes = await apiCRUD({
    urlSuffix: "next",
    requiresToken: false,
    ...serverCache.index,
  });
  const data: Index = dataRes?.data;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageJsonLd(initialsRes)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeFaqJsonLd(initialsRes)),
        }}
      />
      <div>
        <Slider slidesData={data?.banners?.slider} />

        <section className="mt-4 flex gap-4 max-md:flex-col">
          {data?.banners?.three?.[0] &&
            data?.banners?.three?.[1] &&
            (data?.banners?.three?.[2] ? (
              <div className="flex flex-[0.5] flex-col gap-4">
                <BannerCard
                  bgImg={data.banners.three[0].image}
                  headTitle={data.banners.three[0]?.pre_title}
                  title={data.banners.three[0].title}
                  description={data.banners.three[0].text}
                  data={data.banners.three[0]}
                />
                <BannerCard
                  bgImg={data.banners.three[1].image}
                  headTitle={data.banners.three[1]?.pre_title}
                  title={data.banners.three[1].title}
                  description={data.banners.three[1].text}
                  data={data.banners.three[0]}
                />
              </div>
            ) : (
              <div className="flex flex-[1] gap-4 max-lg:flex-col">
                <div className="flex-[0.5]">
                  <BannerCard
                    bgImg={data.banners.three[0].image}
                    headTitle={data.banners.three[0]?.pre_title}
                    title={data.banners.three[0].title}
                    description={data.banners.three[0].text}
                    data={data.banners.three[0]}
                    containerStyle="max-md:max-h-[200px]"
                  />
                </div>
                <div className="flex-[0.5]">
                  <BannerCard
                    bgImg={data.banners.three[1].image}
                    headTitle={data.banners.three[1]?.pre_title}
                    title={data.banners.three[1].title}
                    description={data.banners.three[1].text}
                    data={data.banners.three[0]}
                    containerStyle="max-md:max-h-[200px]"
                  />
                </div>
              </div>
            ))}

          {data?.banners?.three?.[2] && (
            <>
              <div className="flex-[0.5] max-md:hidden">
                <BannerCard
                  bgImg={data.banners.three[2].image}
                  headTitle={data.banners.three[2]?.pre_title}
                  title={data.banners.three[2].title}
                  description={data.banners.three[2].text}
                  data={data.banners.three[0]}
                  height={624}
                />
              </div>
              <div className="md:hidden">
                <BannerCard
                  bgImg={data.banners.three[2].image}
                  headTitle={data.banners.three[2]?.pre_title}
                  title={data.banners.three[2].title}
                  description={data.banners.three[2].text}
                  data={data.banners.three[0]}
                  height={300}
                />
              </div>
            </>
          )}
        </section>
        <CategoriesCarousel />

        <Carousel
          title="جدید ترین ها"
          moreButton
          autoplay
          ButtonLink="/shop?sortBy=latest"
          cards={data?.latest_products?.map((p) => (
            <ProductCard product={p} key={p.slug} />
          ))}
        />

        {/* Dynamic Carousels from Index.carousels */}
        {data?.carousels?.map((carousel, idx) => (
          <div
            key={carousel.id}
            className={`${idx % 2 === 0 ? "rounded-[20px] bg-[url('/images/offerBg.png')]" : ""}`}
          >
            <Carousel
              title={carousel.name}
              moreButton
              autoplay
              ButtonLink={
                carousel.slug ? "/shop/category/" + carousel.slug : undefined
              }
              cards={carousel.products?.map((product) => (
                <ProductCard product={product} key={product.slug} />
              ))}
            />
          </div>
        ))}

        {data?.banners?.call_to_action?.[0] && (
          <NoticeBanner data={data.banners.call_to_action[0]} />
        )}

        <Carousel
          title="وبلاگ و مجله ما"
          moreButton
          ButtonLink="/blog"
          cards={data?.posts?.map((p) => <BlogCard key={p.slug} blog={p} />)}
        />
        <div className="my-12">
          <Features />
        </div>
      </div>
    </main>
  );
}
