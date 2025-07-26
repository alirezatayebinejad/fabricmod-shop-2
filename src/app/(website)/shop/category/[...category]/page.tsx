import CategoryLayout from "@/app/(website)/shop/category/[...category]/_components/CategoryLayout";
import { serverCacheDynamic } from "@/constants/cacheNames";
import apiCRUD from "@/services/apiCRUD";
import { ProductCategoryShowSite } from "@/types/apiTypes";
import { Metadata } from "next";

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

  return (
    <main>
      <div>
        <CategoryLayout categorySlug={slug} initialCategoryData={data} />
      </div>
    </main>
  );
}
