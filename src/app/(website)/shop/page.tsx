"use client";
import PageHeader from "@/app/(website)/_components/layout/PageHeader";
import HeaderFilters from "@/app/(website)/shop/_components/HeaderFilters";
import ProductsList from "@/app/(website)/shop/_components/ProductsList";
import ShopFilters from "@/app/(website)/shop/_components/ShopFilters";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import { useFiltersContext } from "@/contexts/SearchFilters";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { ProductIndexSite } from "@/types/apiTypes";
import { useRef } from "react";
import RetryError from "@/components/datadisplay/RetryError";
import { Spinner } from "@heroui/spinner";

export default function ShopPage() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `next/products${filters ? "?" + filters : ""}`,
    (url) => apiCRUD({ urlSuffix: url, requiresToken: false }),
    { keepPreviousData: true },
  );
  const products: ProductIndexSite = data?.data;
  const productsRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    changeFilters("page=" + page);
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  if (isLoading && !products)
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
            products?.banners[0]?.image
              ? process.env.NEXT_PUBLIC_IMG_BASE + products.banners[0].image
              : "/images/imageplaceholder.png"
          }
          title="فروشگاه"
          breadCrumb={
            <Breadcrumb
              items={[{ title: "خانه", link: "/" }, { title: "فروشگاه" }]}
            />
          }
        />
        <div className="mt-[35px] flex gap-20">
          <div className="flex-[0.25] max-[1244px]:hidden">
            <ShopFilters />
          </div>
          <div className="mb-16 flex flex-[0.75] flex-col gap-[35px] max-[1244px]:flex-[1]">
            <div>
              <HeaderFilters product={products} />
            </div>
            <div ref={productsRef}>
              <ProductsList
                product={products}
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
