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
import RevealEffect from "@/components/wrappers/RevealEffect";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Minus, Plus } from "lucide-react";

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
      
      <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
          درباره {category?.name}
        </h2>
        <div className="prose prose-lg max-w-none leading-8 text-gray-700 prose-headings:mb-4 prose-headings:mt-8 prose-headings:font-semibold prose-h2:text-xl prose-h3:text-lg prose-p:mb-4 prose-li:marker:text-primary dark:prose-invert">
          <ParseHTML htmlContent={category?.content} />
        </div>

        { category?.faqs && category?.faqs.length > 0 && (
          <div className="mt-12">
                <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  سوالات متداول درباره {category?.name}
                </h2>
                <RevealEffect mode="customFadeUp" options={{ triggerOnce: true }}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1 mx-5">
                      {category?.faqs?.map((faq, index) => (
                        <Accordion key={index} variant="splitted">
                          <AccordionItem
                            aria-label={faq.subject}
                            title={faq.subject}
                            classNames={{
                              base: "rounded-[5px] shadow-none border-1 border-border bg-boxBg250",
                              indicator: "text-TextLow",
                              title: "text-TextColor",
                              content: "text-TextLow",
                            }}
                            indicator={({ isOpen }) =>
                              isOpen ? <Minus className="rotate-90" /> : <Plus />
                            }
                          >
                            {faq.body}
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                </RevealEffect>
          </div>
        )}

      </div>
    </>
  );
}
