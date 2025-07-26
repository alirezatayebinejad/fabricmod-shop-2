"use client";
import ProductCard from "@/app/(website)/_components/cards/ProductCard";
import RevealEffect from "@/components/wrappers/RevealEffect";
import { ProductCategoryShowSite, ProductIndexSite } from "@/types/apiTypes";
import { Pagination } from "@heroui/pagination";
import RetryError from "@/components/datadisplay/RetryError";
import { Skeleton } from "@/components/datadisplay/Skeleton";

export default function ProductsList({
  product,
  onPageChange,
  error,
  loading,
  mutate,
}: {
  product?: ProductIndexSite | ProductCategoryShowSite["data"];
  onPageChange?: (page: number) => void;
  loading?: boolean;
  error?: boolean;
  mutate?: () => void;
}) {
  return (
    <section>
      {error ? (
        <div className="col-span-full">
          <RetryError onRetry={mutate || (() => {})} />
        </div>
      ) : loading ? (
        <div className="grid grid-cols-3 place-items-center gap-4 max-[977px]:grid-cols-2 max-[760px]:grid-cols-3 max-[550px]:grid-cols-2 max-[300px]:grid-cols-1">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-56 w-full" />
          ))}
        </div>
      ) : (
        <RevealEffect
          mode="fade"
          options={{
            triggerOnce: true,
          }}
        >
          <div className="grid grid-cols-3 place-items-center gap-4 max-[977px]:grid-cols-2 max-[760px]:grid-cols-3 max-[550px]:grid-cols-2 max-[300px]:grid-cols-1">
            {product?.products?.map((p) => (
              <ProductCard fullSize key={p.id} product={p} />
            ))}
          </div>
        </RevealEffect>
      )}
      <div dir="ltr" className="mt-5">
        <Pagination
          showControls
          isCompact
          color="primary"
          page={product?.meta?.current_page}
          total={product?.meta?.last_page || 1}
          size="sm"
          variant="bordered"
          onChange={onPageChange}
          classNames={{
            item: "border-none text-TextColor",
            cursor: "bg-primary text-primary-foreground rounded-md",
          }}
        />
      </div>
    </section>
  );
}
