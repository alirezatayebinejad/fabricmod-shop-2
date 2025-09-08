import PageHeader from "@/app/(website)/_components/layout/PageHeader";
import ContactInfo from "@/app/(website)/contact/_components/ContactInfo";
import Title from "@/components/datadisplay/Title";
import { serverCache } from "@/constants/cacheNames";
import {
  contactBreadcrumbJsonLd,
  contactPageJsonLd,
} from "@/constants/jsonlds";
import apiCRUD from "@/services/apiCRUD";
import { Initials, PageShowSite } from "@/types/apiTypes";
import Script from "next/script";

export async function generateMetadata() {
  const dataRes = await apiCRUD({
    urlSuffix: "next/contact-us",
    requiresToken: false,
    ...serverCache.contact,
  });

  const data: PageShowSite = dataRes?.data;

  return {
    title: data?.seo_title || data?.title || "تماس با فابریک مد",
    description:
      data?.seo_description ||
      data?.description ||
      "برای ارتباط با تیم فابریک مد با ما در تماس باشید.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_PATH}/contact`,
    },
    openGraph: {
      title: data?.seo_title || data?.title,
      description: data?.seo_description || data?.description,
      url: `${process.env.NEXT_PUBLIC_BASE_PATH}/contact`,
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

export default async function ContactPage() {
  const dataRes = await apiCRUD({
    urlSuffix: "next/contact-us",
    requiresToken: false,
    ...serverCache.contact,
  });
  const initialsRes = (await apiCRUD({
    urlSuffix: "next/initials",
    requiresToken: false,
    ...serverCache.initials,
  })) as Initials;

  const data: PageShowSite = dataRes?.data;
  return (
    <main className="overflow-hidden">
      <Script
        id="contact-page-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageJsonLd(data, initialsRes)),
        }}
      />
      <Script
        id="contact-breadcrumb-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactBreadcrumbJsonLd()),
        }}
      />
      <Title title={data?.title} styles={{ container: "pt-5 pb-16" }} />
      {data?.primary_image && (
        <div className="mb-24">
          <PageHeader
            img={process.env.NEXT_PUBLIC_IMG_BASE + data?.primary_image}
          />
        </div>
      )}
      <ContactInfo data={data} />
      {data?.body && (
        <div
          dangerouslySetInnerHTML={{ __html: data?.body }}
          className="pages_content md:mx-[45px]"
        ></div>
      )}
    </main>
  );
}
