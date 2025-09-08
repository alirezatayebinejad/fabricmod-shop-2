import CategoryLayout from "@/app/(website)/shop/category/[...category]/_components/CategoryLayout";
import { serverCacheDynamic } from "@/constants/cacheNames";
import {
  categoryBreadcrumbJsonLd,
  categoryJsonLd,
  categoryProductsJsonLd,
} from "@/constants/jsonlds";
import apiCRUD from "@/services/apiCRUD";
import { ProductCategoryShowSite } from "@/types/apiTypes";
import { Metadata } from "next";
import Head from "next/head";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.category[0];
  const dataRes = await apiCRUD({
    urlSuffix: "next/categories/" + slug,
    requiresToken: false,
    ...serverCacheDynamic(slug).productCategory,
  });
  const data: ProductCategoryShowSite = dataRes?.data;

  const pageTitle = "دسته بندی " + data?.name;
  const pageDescription = "تمامی محصولات مربوط به دسته بندی " + data?.name;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/category/${slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string[] }>;
}) {
  const slug = (await params).category[0];
  const dataRes = await apiCRUD({
    urlSuffix: "next/categories/" + slug,
    requiresToken: false,
    ...serverCacheDynamic(slug).productCategory,
  });
  const data: ProductCategoryShowSite = dataRes?.data;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/category/${slug}`;

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={"دسته بندی " + data?.name} />
        <meta
          property="og:description"
          content={"تمامی محصولات مربوط به دسته بندی " + data?.name}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={"دسته بندی " + data?.name} />
        <meta
          name="twitter:description"
          content={"تمامی محصولات مربوط به دسته بندی " + data?.name}
        />
      </Head>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryBreadcrumbJsonLd(data)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryProductsJsonLd(data)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryJsonLd(data)),
          }}
        />

        <div>
          <CategoryLayout categorySlug={slug} initialCategoryData={data} />
        </div>
      </main>
    </>
  );
}
