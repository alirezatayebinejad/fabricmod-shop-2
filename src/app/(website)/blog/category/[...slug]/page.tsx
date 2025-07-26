import CategoryLayout from "@/app/(website)/blog/category/[...slug]/_components/CategoryLayout";
import { serverCacheDynamic } from "@/constants/cacheNames";
import apiCRUD from "@/services/apiCRUD";
import { PostsIndexSite } from "@/types/apiTypes";
import { Metadata } from "next";

export const metadata: Metadata = {
  //is setted in the page component
};

export default async function PostsCategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const slug = (await params).slug[0];
  const dataRes = await apiCRUD({
    urlSuffix: "next/posts?category=" + slug,
    requiresToken: false,
    ...serverCacheDynamic(slug).postCategory,
  });
  const data: PostsIndexSite = dataRes?.data;

  const categoryName = data?.categories?.find((c) => c.slug === slug)?.name;
  metadata.title = "دسته بندی " + categoryName;
  metadata.description = "تمامی پست های مربوط به دسته بندی " + categoryName;

  return (
    <main>
      <div>
        <CategoryLayout categorySlug={slug} CategoryInitialData={data} />
      </div>
    </main>
  );
}
