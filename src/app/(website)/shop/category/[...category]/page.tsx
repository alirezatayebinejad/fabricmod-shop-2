import CategoryLayout from "@/app/(website)/shop/category/[...category]/_components/CategoryLayout";
import { serverCacheDynamic } from "@/constants/cacheNames";
import apiCRUD from "@/services/apiCRUD";
import { ProductCategoryShowSite } from "@/types/apiTypes";
import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  //is setted in the page component
};

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

  metadata.title = "دسته بندی " + data?.name;
  metadata.description = "تمامی محصولات مربوط به دسته بندی " + data?.name;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_PATH}/shop/category/${slug}`;

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
      </Head>
      <main>
        <div>
          <CategoryLayout categorySlug={slug} initialCategoryData={data} />
        </div>
      </main>
    </>
  );
}
