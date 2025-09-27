import PageHeader from "@/app/(website)/_components/layout/PageHeader";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import { ParseHTML } from "@/components/datadisplay/ParseHtml";
import Title from "@/components/datadisplay/Title";
import { serverCache } from "@/constants/cacheNames";
import { rulesPageJsonLd } from "@/constants/jsonlds";
import apiCRUD from "@/services/apiCRUD";
import { PageShowSite } from "@/types/apiTypes";

export async function generateMetadata() {
  const dataRes = await apiCRUD({
    urlSuffix: "next/regulations",
    requiresToken: false,
    ...serverCache.rules,
  });
  const data: PageShowSite = dataRes?.data;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_PATH}/regulations`;

  return {
    title: data?.seo_title || data?.title || "قوانین و مقررات - فابریک مد",
    description:
      data?.seo_description ||
      data?.description ||
      "مطالعه قوانین و مقررات فابریک مد برای خرید و استفاده از خدمات سایت.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data?.seo_title || data?.title,
      description: data?.seo_description || data?.description,
      url: canonicalUrl,
      images: data?.primary_image
        ? [
            {
              url: process.env.NEXT_PUBLIC_IMG_BASE + data.primary_image,
              alt: data?.title,
            },
          ]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.seo_title || data?.title,
      description: data?.seo_description || data?.description,
      images: data?.primary_image
        ? [process.env.NEXT_PUBLIC_IMG_BASE + data.primary_image]
        : [],
    },
  };
}

export default async function RulesPage() {
  const dataRes = await apiCRUD({
    urlSuffix: "next/regulations",
    requiresToken: false,
    ...serverCache.rules,
  });
  const data: PageShowSite = dataRes?.data;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(rulesPageJsonLd(data)),
        }}
      />
      <div>
        <PageHeader
          img={process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image}
          title="قوانین و مقررات"
          breadCrumb={
            <Breadcrumb
              items={[
                { title: "خانه", link: "/" },
                { title: data?.title || "" },
              ]}
            />
          }
        />
        <div className="editor_display mx-auto my-9 max-w-[800px]">
          <Title
            title={data?.title}
            styles={{ container: "items-center my-16" }}
          />
          <ParseHTML htmlContent={data?.body} />
        </div>
      </div>
    </main>
  );
}
