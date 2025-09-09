import CategoryLayout from "@/app/(website)/shop/category/[...category]/_components/CategoryLayout";
import { serverCacheDynamic } from "@/constants/cacheNames";
import {
  categoryBreadcrumbJsonLd,
  categoryFaqJsonLd,
  categoryJsonLd,
  categoryProductsJsonLd,
} from "@/constants/jsonlds";
import apiCRUD from "@/services/apiCRUD";
import { ProductCategoryShowSite } from "@/types/apiTypes";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params; // Resolve the Promise
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

  return (
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
      {data?.faqs?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(categoryFaqJsonLd(data)),
          }}
        />
      )}

      <div>
        <CategoryLayout categorySlug={slug} initialCategoryData={data} />
      </div>
    </main>
  );
}
