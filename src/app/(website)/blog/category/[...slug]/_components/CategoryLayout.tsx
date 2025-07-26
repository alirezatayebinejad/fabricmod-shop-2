"use client";
import PageHeader from "@/app/(website)/_components/layout/PageHeader";
import BlogSidebar from "@/app/(website)/blog/_components/BlogSidebar";
import BlogsList from "@/app/(website)/blog/_components/BlogsList";
import HeaderFilters from "@/app/(website)/blog/_components/HeaderFilters";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import { useFiltersContext } from "@/contexts/SearchFilters";
import apiCRUD from "@/services/apiCRUD";
import { PostsIndexSite } from "@/types/apiTypes";
import useSWR from "swr";
import { useRef } from "react";
import RetryError from "@/components/datadisplay/RetryError";
import { Spinner } from "@heroui/spinner";

export default function CategoryLayout({
  categorySlug,
  CategoryInitialData,
}: {
  categorySlug: string;
  CategoryInitialData: PostsIndexSite;
}) {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    filters &&
      `next/posts?category=${categorySlug}${filters ? "?" + filters : ""}`,
    (url: string) => apiCRUD({ urlSuffix: url, requiresToken: false }),
    { keepPreviousData: true },
  );

  const posts: PostsIndexSite = data?.data || CategoryInitialData;
  const postsRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    changeFilters("page=" + page);
    if (postsRef.current) {
      postsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const blogBanner = posts?.banners?.find((b) => b.mode === "blog");

  if (isLoading && !posts)
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  if (error) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutate();
          }}
        />
      </div>
    );
  }
  return (
    <main>
      <div>
        <PageHeader
          img={
            blogBanner
              ? process.env.NEXT_PUBLIC_IMG_BASE + blogBanner.image
              : "/images/imageplaceholder.png"
          }
          title="وبلاگ"
          breadCrumb={
            <Breadcrumb
              items={[
                { title: "خانه", link: "/" },
                { title: "وبلاگ" },
                { title: "دسته بندی" },
                {
                  title:
                    posts?.categories?.find((c) => c.slug === categorySlug)
                      ?.name || "",
                },
              ]}
            />
          }
        />

        <div className="mt-[35px] flex gap-20">
          <div className="flex-[0.25] max-[1244px]:hidden">
            <BlogSidebar blogIndex={posts} categSlug={categorySlug} />
          </div>
          <div className="mb-16 flex flex-[0.75] flex-col gap-[35px] max-[1244px]:flex-[1]">
            <div>
              <HeaderFilters blogIndex={posts} categSlug={categorySlug} />
            </div>
            <div ref={postsRef}>
              <BlogsList
                blogs={posts}
                loading={isLoading}
                error={error}
                mutate={mutate}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
