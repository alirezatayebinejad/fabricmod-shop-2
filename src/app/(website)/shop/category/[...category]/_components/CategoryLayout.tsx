"use client";
import HeaderFilters from "@/app/(website)/shop/_components/HeaderFilters";
import ProductsList from "@/app/(website)/shop/_components/ProductsList";
import ShopFilters from "@/app/(website)/shop/_components/ShopFilters";
import { Spinner } from "@heroui/spinner";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { ProductCategoryShowSite } from "@/types/apiTypes";
import { useRef } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import RetryError from "@/components/datadisplay/RetryError";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import PageHeader from "@/app/(website)/_components/layout/PageHeader";
import { ParseHTML } from "@/components/datadisplay/ParseHtml";
import FaqsList from "@/app/(website)/faqs/_components/FaqsList";

export default function CategoryLayout({
  categorySlug,
  initialCategoryData,
}: {
  categorySlug: string;
  initialCategoryData: ProductCategoryShowSite;
}) {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    filters && `next/categories/${categorySlug}${filters ? "?" + filters : ""}`,
    (url: string) => apiCRUD({ urlSuffix: url, requiresToken: false }),
    { keepPreviousData: true },
  );
  const categoryRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    changeFilters("page=" + page);
    if (categoryRef.current) {
      categoryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const category: ProductCategoryShowSite = data?.data || initialCategoryData;
  console.log(category);
  if (isLoading && !category)
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
    <>
      <PageHeader
        img={
          category?.banners[0]?.image
            ? process.env.NEXT_PUBLIC_IMG_BASE + category.banners[0].image
            : "/images/imageplaceholder.png"
        }
        title={category?.name}
        breadCrumb={
          <Breadcrumb
            items={[
              { title: "خانه", link: "/" },
              { title: "فروشگاه" },
              { title: "دسته بندی" },
              { title: category?.name },
            ]}
          />
        }
      />
      <div className="mt-[35px] flex gap-20">
        <div className="flex-[0.25] max-[1244px]:hidden">
          <ShopFilters
            mode="category"
            categoryAtrributes={category?.attributes}
            categorySlug={category?.slug}
          />
        </div>
        <div className="mb-16 flex flex-[0.75] flex-col gap-[35px] max-[1244px]:flex-[1]">
          <div>
            <HeaderFilters product={category?.data} />
          </div>
          <div ref={categoryRef}>
            <ProductsList
              product={category?.data}
              loading={isLoading}
              error={error}
              mutate={mutate}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {category?.content && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
              درباره {category?.name}
            </h2>
            <div className="prose editor_display prose-lg prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-semibold prose-h2:text-xl prose-h3:text-lg prose-p:mb-4 prose-li:marker:text-primary dark:prose-invert max-w-none leading-8 text-gray-700">
              <ParseHTML htmlContent={category?.content} />
            </div>
          </>
        )}

        {category?.faqs && category?.faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 mt-12 text-2xl font-bold text-gray-800 dark:text-gray-100">
              سوالات متداول درباره {category?.name}
            </h2>
            <FaqsList faqslist={category.faqs} />
          </div>
        )}
      </div>
    </>
  );
}
