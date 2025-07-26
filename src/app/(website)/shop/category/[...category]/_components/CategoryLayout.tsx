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
    </>
  );
}
