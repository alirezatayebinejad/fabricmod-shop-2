import Title from "@/components/datadisplay/Title";
import BgCircles from "@/components/svg/bgCircles";
import RevealEffect from "@/components/wrappers/RevealEffect";
import { serverCache } from "@/constants/cacheNames";
import { aboutBreadcrumbJsonLd, aboutPageJsonLd } from "@/constants/jsonlds";
import apiCRUD from "@/services/apiCRUD";
import { PageShowSite } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export async function generateMetadata() {
  const dataRes = await apiCRUD({
    urlSuffix: "next/about-us",
    requiresToken: false,
    ...serverCache.about,
  });

  const data: PageShowSite = dataRes?.data;

  return {
    title: data?.seo_title || data?.title || "درباره فابریک مد",
    description:
      data?.seo_description ||
      data?.description ||
      "فابریک مد، فروشگاه آنلاین فروش روسری و کیف و کفش و لباس زنانه با خدمات سریع و مطمئن.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_PATH}/about`,
    },
    openGraph: {
      title: data?.seo_title || data?.title,
      description: data?.seo_description || data?.description,
      url: `${process.env.NEXT_PUBLIC_BASE_PATH}/about`,
      images: data?.primary_image
        ? [
            {
              url: process.env.NEXT_PUBLIC_IMG_BASE + data.primary_image,
              alt: data?.title,
            },
          ]
        : [],
    },
  };
}

export default async function AboutPage() {
  const dataRes = await apiCRUD({
    urlSuffix: "next/about-us",
    requiresToken: false,
    ...serverCache.about,
  });
  const data: PageShowSite = dataRes?.data;
  const json: {
    title: string;
    after_title: string;
    btn_text: string;
    btn_link: string;
  } = data?.json?.startsWith("{") ? JSON.parse(data.json) : {};

  // Provide a fallback for btn_link to avoid undefined href
  const btnLink =
    typeof json?.btn_link === "string" && json.btn_link.trim() !== ""
      ? json.btn_link
      : "/";

  return (
    <main className="flex w-full justify-center overflow-hidden">
      <Script
        id="about-page-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageJsonLd(data)),
        }}
      />
      {/* Breadcrumb JSON-LD */}
      <Script
        id="about-breadcrumb-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutBreadcrumbJsonLd()),
        }}
      />

      <div className="m-[0_auto] max-w-[1950px]">
        <Title title={data.title} styles={{ container: "pt-5 pb-28" }} />
        <div className="relative mb-40 flex justify-evenly gap-[90px] px-5 max-md:flex-col-reverse md:px-12">
          <div className="absolute right-[-5px] top-[-100px]">
            <BgCircles />
          </div>
          <div className="absolute bottom-[-100px] left-[50px]">
            <BgCircles />
          </div>
          <div className="flex flex-[0.5] flex-col gap-[21px]">
            <RevealEffect
              mode="customFadeUp"
              options={{
                triggerOnce: true,
                cascade: true,
                damping: 0.3,
              }}
            >
              <h2 className="text-[48px] font-[700] text-primary max-md:text-[30px]">
                {json?.title}
              </h2>
              <h3 className="text-[36px] font-[600] max-md:text-[26px]">
                {json?.after_title}
              </h3>
              <p className="text-TextSize500">{data?.description}</p>
              <div>
                {json?.btn_text && btnLink ? (
                  <Link prefetch={false} href={btnLink}>
                    <Button
                      endContent={<ArrowLeft className="w-5 text-TextLow" />}
                      variant="bordered"
                      className="rounded-[32px] border-1 border-border transition-colors hover:bg-primary"
                    >
                      {json?.btn_text}
                    </Button>
                  </Link>
                ) : null}
              </div>
            </RevealEffect>
          </div>
          <div className="flex-[0.5] px-5">
            <div className="relative m-[0_auto] flex h-[370px] max-w-[404px] rounded-[24px] bg-boxBg300 max-md:h-[210px]">
              <div className="absolute right-[-50px] top-[-50px] h-[218px] w-[333px] animate-appearance-in overflow-hidden rounded-[24px] bg-boxBg300 p-4 max-md:h-[150px] max-md:w-[250px]">
                <div className="h-full w-full overflow-hidden rounded-[17px]">
                  <Image
                    src={
                      data?.primary_image
                        ? process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image
                        : "/images/imageplaceholder.png"
                    }
                    alt="تصویر"
                    width={300}
                    height={100}
                    className="w-full rounded-[17px] object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-[-50px] left-[-50px] flex h-[218px] w-[333px] animate-appearance-in justify-center rounded-[24px] bg-boxBg300 p-4 max-md:h-[150px] max-md:w-[250px]">
                <Image
                  src={"/fake/blog.png"}
                  alt="تصویر"
                  width={333}
                  height={218}
                  className="w-full rounded-[17px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        {data?.body && (
          <div
            dangerouslySetInnerHTML={{ __html: data.body }}
            className="pages_content md:mx-[45px]"
          ></div>
        )}
      </div>
    </main>
  );
}
